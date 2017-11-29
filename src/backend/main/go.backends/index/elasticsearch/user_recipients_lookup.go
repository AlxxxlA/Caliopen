// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package index

import (
	"context"
	"encoding/json"
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"gopkg.in/olivere/elastic.v5"
)

type (
	returnedContact struct {
		Fname string `json:"family_name"`
		Gname string `json:"given_name"`
		Title string `json:"title"`
	}

	returnedParticipant struct {
		Address     string   `json:"address"`
		Contact_ids []string `json:"contact_ids"`
		Label       string   `json:"label"`
		Protocol    string   `json:"protocol"`
		Type        string   `json:"type"`
	}
	returnedMessage struct {
		Date string `json:"date"`
		Type string `json:"type"`
	}
)

// build ES queries and responses for finding relevant recipients when an user compose a message
func (es *ElasticSearchBackend) RecipientsSuggest(user_id, query_string string) (suggests []RecipientSuggestion, err error) {
	suggests = []RecipientSuggestion{}
	q_string := query_string
	user_id = "7d67bb5e-6683-4528-9a5c-bb292210a0ef_v10"
	// build nested queries for participants lookup
	queries := []elastic.Query{
		elastic.NewPrefixQuery("participants.label", q_string),
		elastic.NewPrefixQuery("participants.address.raw", q_string),
		elastic.NewTermQuery("participants.address.parts", q_string),
	}
	participants_fields_q := elastic.NewBoolQuery().Should(queries...)
	participants_q := elastic.NewNestedQuery("participants", participants_fields_q)
	participants_q.InnerHit(elastic.NewInnerHit().Size(1))

	// build queries for contact lookup
	queries = []elastic.Query{
		elastic.NewPrefixQuery("given_name", q_string).Boost(3),
		elastic.NewPrefixQuery("given_name.normalized", q_string).Boost(3),
		elastic.NewPrefixQuery("family_name", q_string).Boost(3),
		elastic.NewPrefixQuery("family_name.normalized", q_string).Boost(3),
	}
	contact_name_q := elastic.NewBoolQuery().Should(queries...)

	queries = []elastic.Query{
		elastic.NewPrefixQuery("emails.label", q_string).Boost(2),
		elastic.NewPrefixQuery("emails.address.raw", q_string).Boost(2),
		elastic.NewTermQuery("emails.address.parts", q_string).Boost(2),
	}
	nested_emails_q := elastic.NewBoolQuery().Should(queries...)
	emails_q := elastic.NewNestedQuery("emails", nested_emails_q)
	emails_q.InnerHit(elastic.NewInnerHit())

	// doc source pruning
	fsc := elastic.NewFetchSourceContext(true)
	fsc.Include("title")

	// run the query
	main_query := elastic.NewBoolQuery().Should(participants_q, contact_name_q, emails_q)
	search := es.Client.Search().
		Index(user_id).
		FetchSourceContext(fsc).
		Size(30)
	/** log the full json query to help development
	source, _ := main_query.Source()
	json_query, _ := json.Marshal(source)
	log.Infof("\nES query source: %s\n", json_query)
	agg_source, _ := max_date_agg.Source()
	json_agg, _ := json.Marshal(agg_source)
	log.Infof("\nES aggregation source: %s\n", json_agg)
	/** end of log **/
	result, err := search.Query(main_query).Do(context.TODO())
	if err != nil {
		return
	}
	participants_suggests := make(map[string]RecipientSuggestion)
	for _, hit := range result.Hits.Hits {
		log.Infof("%+v\n", hit)
		switch hit.Type {
		case MessageIndexType:
			suggest, e := extractParticipantInfos(hit)
			if e != nil {
				log.WithError(e).Warnf("failed to extract message participants")
			}
			//deduplicate
			if _, ok := participants_suggests[suggest.Address]; !ok {
				participants_suggests[suggest.Address] = suggest
				suggests = append(suggests, suggest)
			}
		case ContactIndexType:
			suggest, e := extractContactInfos(hit)
			if e != nil {
				log.WithError(e).Warnf("failed to extract contact info")
			}
			suggests = append(suggests, suggest)
		default:
			suggest := RecipientSuggestion{
				Source: "<" + hit.Type + ">",
			}
			suggests = append(suggests, suggest)
		}
	}

	return
}

func extractContactInfos(contact_hit *elastic.SearchHit) (suggest RecipientSuggestion, err error) {
	var contact returnedContact
	if e := json.Unmarshal(*contact_hit.Source, &contact); e != nil {
		err = errors.New("[ES RecipientSuggest] failed unmarshaling hit's source : " + e.Error())
		return
	}
	suggest.Source = "contact"
	suggest.Label = contact.Title
	suggest.Contact_Id = contact_hit.Id
	return
}

func extractParticipantInfos(message_hit *elastic.SearchHit) (suggest RecipientSuggestion, err error) {
	inner_hit := message_hit.InnerHits["participants"].Hits.Hits[0]
	var participant returnedParticipant
	if e := json.Unmarshal(*inner_hit.Source, &participant); e != nil {
		err = errors.New("[ES RecipientSuggest] failed unmarshaling hit's source : " + e.Error())
		return
	}
	suggest.Source = "participant"
	suggest.Label = participant.Label
	suggest.Address = participant.Address
	suggest.Protocol = participant.Protocol
	return
}

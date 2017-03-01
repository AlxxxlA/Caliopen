// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.
//
// only struct and interfaces definitions in this pkg

package objects

type (
	LocalIdentity struct {
		Address string   `json:"address"`
		Status  string   `json:"status"`
		Type    []string `json:"type"`
		UserId  []byte   `json:"user_id" cql:"user_id"`
	}
)

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'lingui-react';
import classnames from 'classnames';
import { WithTags, getTagLabel } from '../../../../modules/tags';
import Button from '../../../../components/Button';
import NavList, { ItemContent } from '../../../../components/NavList';

import './style.scss';

@withI18n()
class TagList extends Component {
  static propTypes = {
    onTagClick: PropTypes.func.isRequired,
    activeTag: PropTypes.string.isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };
  static defaultProps = {
  };
  state = {};

  sortTags = (i18n, tags) =>
    [...tags].sort((a, b) => getTagLabel(i18n, a).localeCompare(getTagLabel(i18n, b)));

  createHandleClickTag = tagName => () => {
    const { onTagClick } = this.props;

    onTagClick(tagName);
  }

  renderItem({ tagName, label }) {
    const { activeTag } = this.props;
    const tagClassName = classnames(
      'm-tag-list__tag',
      {
        'm-tag-list__tag--active': activeTag === tagName,
      }
    );

    return (
      <Button onClick={this.createHandleClickTag(tagName)} className={tagClassName}>{label}</Button>
    );
  }

  render() {
    const { i18n } = this.props;

    return (
      <NavList className="m-tag-list" dir="vertical">
        <ItemContent className="m-tag-list__item">
          {this.renderItem({
            tagName: '',
            label: i18n._('tag_list.all_contacts', { defaults: 'All contacts' }),
          })}
        </ItemContent>
        <WithTags render={userTags => this.sortTags(i18n, userTags).map(tag => (
          <ItemContent className="m-tag-list__item" key={tag.name}>
            {this.renderItem({
              tagName: tag.name,
              label: getTagLabel(i18n, tag),
            })}
          </ItemContent>
          ))}
        />
      </NavList>
    );
  }
}

export default TagList;

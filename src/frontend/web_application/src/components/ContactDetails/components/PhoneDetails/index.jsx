import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'lingui-react';
import Icon from '../../../Icon';

@withI18n()
class PhoneDetails extends Component {
  static propTypes = {
    phone: PropTypes.shape({}).isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };

  constructor(props) {
    super(props);
    this.initTranslations();
  }

  initTranslations() {
    const { i18n } = this.props;
    this.typeTranslations = {
      work: i18n._('contact.phone_type.work'),
      home: i18n._('contact.phone_type.home'),
      other: i18n._('contact.phone_type.other'),
    };
  }

  render() {
    const { phone } = this.props;

    return (
      <span className="m-phone-details">
        <Icon rightSpaced type="phone" />
        {phone.number}
        {' '}
        {phone.type && <small><em>{this.typeTranslations[phone.type]}</em></small>}
      </span>
    );
  }
}

export default PhoneDetails;

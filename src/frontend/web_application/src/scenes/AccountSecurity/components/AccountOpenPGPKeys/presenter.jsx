import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslator } from '@gandi/react-translate';
import Icon from '../../../../components/Icon';
import Button from '../../../../components/Button';
import Subtitle from '../../../../components/Subtitle';
import OpenPGPKey from '../../../../components/OpenPGPKey';
import AccountOpenPGPKeyForm from './components/AccountOpenPGPKeyForm';
import './style.scss';

@withTranslator()
class AccountOpenPGPKeys extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    privateKeys: PropTypes.arrayOf(PropTypes.shape({})),
    importForm: PropTypes.shape({}),
    isLoading: PropTypes.bool,
    onDeleteKey: PropTypes.func.isRequired,
    onImportKey: PropTypes.func.isRequired,
    onGenerateKey: PropTypes.func.isRequired,
    prefetch: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    privateKeys: null,
    importForm: null,
    isLoading: false,
  }

  state = {
    editMode: false,
  };

  componentDidMount() {
    if (this.props.prefetch) {
      this.props.prefetch();
    }
  }

  handleClickEditMode = () => {
    this.setState(prevState => ({
      editMode: !prevState.editMode,
    }));
  }

  renderPrivateKey = (keyPair, key) => {
    const { onDeleteKey } = this.props;

    return (
      <OpenPGPKey
        key={key}
        className="m-account-openpgp__keys"
        publicKeyArmored={keyPair.publicKeyArmored}
        privateKeyArmored={keyPair.privateKeyArmored}
        editMode={this.state.editMode}
        onDeleteKey={onDeleteKey}
      >
        <Icon type="key" />
      </OpenPGPKey>
    );
  }

  render() {
    const {
      __,
      isLoading,
      importForm,
      privateKeys,
      user,
      onImportKey,
      onGenerateKey,
    } = this.props;

    const activeButtonProp = this.state.editMode ? { color: 'active' } : {};

    return (
      <div className="m-account-openpgp">
        <Subtitle
          hr
          actions={(
            <Button
              className="pull-right"
              {...activeButtonProp}
              onClick={this.handleClickEditMode}
            >
              <Icon type="edit" />
              <span className="show-for-sr">{__('account.openpgp.action.edit-keys')}</span>
            </Button>
          )}
        >
          {__('account.openpgp.title')}
        </Subtitle>

        {privateKeys.map(this.renderPrivateKey)}
        {
          this.state.editMode && (
            <AccountOpenPGPKeyForm
              className="m-account-openpgp__form"
              emails={user.contact.emails}
              onImport={onImportKey}
              onGenerate={onGenerateKey}
              importForm={importForm}
              isLoading={isLoading}
            >
              <Icon type="key" />
            </AccountOpenPGPKeyForm>
        )}

        <div className="m-account-openpgp__info">
          <p>
            This feature is in high development process and can evolve quickly. The keys you will
            store here are available on your current browser only. This will not be uploaded on the
            server and you will not able to see it on any other devices.
          </p>
          <p>
            Be warned, the key pair generation is pretty slow and will freeze this page for
            approximatively 20 seconds (depends on your device capacities). A fix is in progress but
            may takes time to become available.
          </p>
        </div>
      </div>
    );
  }
}

export default AccountOpenPGPKeys;

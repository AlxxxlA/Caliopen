import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { v1 as uuidV1 } from 'uuid';
import { Switch, Checkbox, Label, FieldGroup } from '../';

import './style.scss';

class CheckboxFieldGroup extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    labelClassname: PropTypes.string,
    showTextLabel: PropTypes.bool,
    displaySwitch: PropTypes.bool,
    errors: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    id: undefined,
    className: null,
    labelClassname: null,
    showTextLabel: false,
    displaySwitch: false,
    errors: [],
  };

  state = {}

  render() {
    const {
      id,
      label,
      labelClassname,
      className,
      errors,
      showTextLabel,
      displaySwitch,
      ...inputProps
    } = this.props;

    const checkboxId = id || uuidV1();

    const renderCheckbox = () => (
      <Checkbox id={checkboxId} label={label} {...inputProps} />
    );

    const renderSwitch = () => (
      <div>
        <Switch id={checkboxId} label={label} {...inputProps} />
        {showTextLabel &&
          <Label
            htmlFor={checkboxId}
            className={classnames('m-checkbox-field-group__label', labelClassname)}
          >
            {label}
          </Label>
        }
      </div>
    );

    return (
      <FieldGroup errors={errors} className={classnames('m-checkbox-field-group', className)}>
        {displaySwitch ? renderSwitch() : renderCheckbox()}
      </FieldGroup>
    );
  }
}

export default CheckboxFieldGroup;

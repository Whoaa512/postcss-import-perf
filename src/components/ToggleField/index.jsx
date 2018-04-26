import classnames from 'classnames'
import React, { PureComponent } from 'react'

import Switch from '~/components/Switch'

import styles from './togglefield.css'

export default class ToggleField extends PureComponent {
    render() {
        const { input, meta } = this.props

        return (
            <span>
                <Switch
                    className={classnames({
                        [styles.error]: meta.touched && meta.error,
                    })}
                    onChange={input.onChange}
                    disabled={this.props.disabled}
                    height={32}
                    width={72}
                    offText={this.props.offText}
                    onText={this.props.onText}
                    value={input.checked}
                />
            </span>
        )
    }
}
 

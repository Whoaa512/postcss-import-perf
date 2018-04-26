import assign from 'lodash/assign'
import bindAll from 'lodash/bindAll'
import get from 'lodash/get'
import classNames from 'classnames'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import styles from './switch.css'

export default class Switch extends PureComponent {
    constructor() {
        super()
        this.state = {
            value: true,
            offset: 0,
            dragStart: null,
            didMove: false,
        }

        bindAll(this, ['_mouseDownFunc', '_mouseMoveFunc', '_mouseUpFunc'])

        this._events = {
            onMouseDown: this._mouseDownFunc,
            onTouchStart: this._mouseDownFunc,
            onMouseMove: this._mouseMoveFunc,
            onTouchMove: this._mouseMoveFunc,
            onMouseUp: this._mouseUpFunc,
            onTouchEnd: this._mouseUpFunc,
        }
    }

    componentWillMount() {
        this._handleProps(this.props)
    }

    _mouseDownFunc(e) {
        if (this.props.disabled || this.state.dragStart) {
            return null
        }
        e.preventDefault()
        e.stopPropagation()
        return this.setState({
            dragStart: getPageX(e) - this.state.offset,
            didMove: false,
        })
    }

    _mouseMoveFunc(e) {
        if (this.props.disabled || this.state.dragStart === null) {
            return null
        }
        e.preventDefault()
        e.stopPropagation()
        let change = getPageX(e) - this.state.dragStart

        change = Math.max(change, -this._labelWidth)
        change = Math.min(change, 0)
        return this.setState({
            offset: change,
            didMove: true,
        })
    }

    _mouseUpFunc(e) {
        if (this.props.disabled || this.state.dragStart === null) {
            return null
        }
        e.preventDefault()
        e.stopPropagation()

        let change = this.state.offset

        if (getPageX(e)) {
            change = getPageX(e) - this.state.dragStart
        }

        let next

        if (this.state.didMove) {
            next = change > -(this._labelWidth / 2)
        } else {
            next = !this.state.value
        }
        if (this.props.onChange) {
            this.props.onChange(next)
        }

        const offset = next ? 0 : -this._labelWidth

        return this.setState({
            value: next,
            offset,
            dragStart: null,
            didMove: false,
        })
    }

    componentWillReceiveProps(nextProps) {
        this._handleProps(nextProps)
    }

    _handleProps(newProps) {
        this._separatorWidth = Math.round(
            this.props.width * this.props.separatorRatio,
        )
        this._labelWidth = this.props.width - this._separatorWidth
        this._contentWidth = 2 * this._labelWidth + this._separatorWidth

        if ('value' in newProps) {
            const next = newProps.value
            const offset = next ? 0 : -this._labelWidth

            this.setState({ value: next, offset })
        }
    }

    render() {
        const disabledClassName = this.props.disabled
            ? styles.disabled
            : styles.enabled
        const outerStyle = this._elemStyle(this.props.width)
        const innerStyle = assign({}, this._elemStyle(this._contentWidth), {
            marginLeft: `${this.state.offset}px`,
        })

        if (!this.state.didMove) {
            const transition = 'margin-left 0.4s'

            assign(innerStyle, {
                WebkitTransition: transition,
                OTransition: transition,
                transition,
            })
        }
        const labelStyle = this._elemStyle(this._labelWidth)
        const separatorStyle = this._elemStyle(this._separatorWidth)

        return (
            <div
                onMouseLeave={this._mouseUpFunc}
                className={classNames(
                    styles.outer,
                    disabledClassName,
                    this.props.className,
                )}
                style={outerStyle}
            >
                <div className={styles.inner} style={innerStyle}>
                    <span
                        {...this._events}
                        className={styles.on}
                        style={labelStyle}
                    >
                        {this.props.onText}
                    </span>
                    <span
                        {...this._events}
                        className={styles.separator}
                        style={separatorStyle}
                    >
                        &nbsp;
                    </span>
                    <span
                        {...this._events}
                        className={styles.off}
                        style={labelStyle}
                    >
                        {this.props.offText}
                    </span>
                </div>
            </div>
        )
    }

    _elemStyle(width) {
        return {
            width: `${width}px`,
            height: `${this.props.height}px`,
        }
    }
}

function getPageX(e) {
    let touch

    if (e.originalEvent) {
        if (e.originalEvent.touches && e.originalEvent.touches.length) {
            touch = e.originalEvent.touches
        } else if (
            e.originalEvent.changedTouches &&
            e.originalEvent.changedTouches.length
        ) {
            touch = e.originalEvent.changedTouches
        }
    }
    return (
        e.pageX ||
        get(e, 'originalEvent.clientX') ||
        get(touch, '[0].clientX', false) ||
        get(e, 'currentPoint.x', false)
    )
}

Switch.defaultProps = {
    onText: 'on',
    offText: 'off',
    width: 96,
    height: 32,
    separatorRatio: 0.5,
}

Switch.propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.bool,
    disabled: PropTypes.bool,
    onText: PropTypes.string.isRequired,
    offText: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    separatorRatio: PropTypes.number.isRequired,
}

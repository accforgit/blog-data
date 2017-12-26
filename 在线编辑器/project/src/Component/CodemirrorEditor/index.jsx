import React, { Component } from 'react'
import codemirror from 'codemirror'
import PropTypes from 'prop-types'
import isEqual from 'lodash.isequal'
import debounce from 'lodash.debounce'

function normalizeLineEndings (str) {
	if (!str) return str
	return str.replace(/\r\n|\r/g, '\n')
}

let CodemirrorHandler = null

export default class ReactCodeMirror extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFocused: false
    }
  }
	componentWillMount () {
		this.componentWillReceiveProps = debounce(this.componentWillReceiveProps, 0)
		if (this.props.path) {
			console.error('Warning: react-codemirror: the `path` prop has been changed to `name`')
		}
	}
	componentDidMount () {
		this.codeMirror = codemirror.fromTextArea(this.textareaNode, this.props.options)
		CodemirrorHandler = this.codeMirror
		CodemirrorHandler.on('change', this.codemirrorValueChanged.bind(this))
		CodemirrorHandler.on('cursorActivity', this.cursorActivity.bind(this))
		CodemirrorHandler.on('focus', this.focusChanged.bind(this, true))
		CodemirrorHandler.on('blur', this.focusChanged.bind(this, false))
		CodemirrorHandler.on('scroll', this.scrollChanged.bind(this))
		CodemirrorHandler.setValue(this.props.defaultValue || this.props.value || '')
	}
	componentWillUnmount () {
		if (this.codeMirror) {
			this.codeMirror.toTextArea()
		}
	}
	componentWillReceiveProps(nextProps) {
		if (this.codeMirror && nextProps.value !== undefined && nextProps.value !== this.props.value && normalizeLineEndings(this.codeMirror.getValue()) !== normalizeLineEndings(nextProps.value)) {
			if (this.props.preserveScrollPosition) {
				var prevScrollPosition = this.codeMirror.getScrollInfo()
				this.codeMirror.setValue(nextProps.value)
				this.codeMirror.scrollTo(prevScrollPosition.left, prevScrollPosition.top)
			} else {
				this.codeMirror.setValue(nextProps.value)
			}
		}
		if (typeof nextProps.options === 'object') {
			for (let optionName in nextProps.options) {
				if (nextProps.options.hasOwnProperty(optionName)) {
					this.setOptionIfChanged(optionName, nextProps.options[optionName])
				}
			}
		}
	}
	setOptionIfChanged (optionName, newValue) {
 		const oldValue = this.codeMirror.getOption(optionName)
 		if (!isEqual(oldValue, newValue)) {
 			this.codeMirror.setOption(optionName, newValue)
 		}
 	}
	getCodeMirror () {
		return this.codeMirror
	}
	focus () {
		if (this.codeMirror) {
			this.codeMirror.focus()
		}
	}
	focusChanged (focused) {
		this.setState({
			isFocused: focused,
		})
		this.props.onFocusChange && this.props.onFocusChange(focused)
	}
	cursorActivity (cm) {
		this.props.onCursorActivity && this.props.onCursorActivity(cm)
	}
	scrollChanged (cm) {
		this.props.onScroll && this.props.onScroll(cm.getScrollInfo())
	}
	codemirrorValueChanged (doc, change) {
		if (this.props.onChange && change.origin !== 'setValue') {
			this.props.onChange(doc.getValue(), change)
		}
	}
	render () {
		return (
			<div className={this.props.className ? 'ReactCodeMirror '+this.props.className : 'ReactCodeMirror'}>
				<textarea
					ref={ref => this.textareaNode = ref}
					name={this.props.name || this.props.path}
					defaultValue={this.props.value}
					autoComplete="off"
					autoFocus={this.props.autoFocus}
				/>
			</div>
		)
	}
}

export {
	CodemirrorHandler
}

ReactCodeMirror.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.any,
  codeMirrorInstance: PropTypes.func,
  defaultValue: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onCursorActivity: PropTypes.func,
  onFocusChange: PropTypes.func,
  onScroll: PropTypes.func,
  options: PropTypes.object,
  path: PropTypes.string,
  value: PropTypes.string,
  preserveScrollPosition: PropTypes.bool
}

ReactCodeMirror.defaultProps = {
  preserveScrollPosition: false
}

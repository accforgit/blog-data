import React from 'react'
import marked from 'marked'
import highlight from 'highlight.js'

import '../../static/style/common.css'
import '../../static/style/js-highlight.css'
import './style.css'

highlight.configure({
  tabReplace: '  ',
  classPrefix: 'hljs-',
  languages: ['CSS', 'HTML, XML', 'JavaScript', 'PHP', 'Python', 'Stylus', 'TypeScript', 'Markdown']
})
marked.setOptions({
  highlight (code) {
    return highlight.highlightAuto(code).value
  }
})

export default class EditorA extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      aceBoxH: null,
      previewContent: ''
    }
    this.cacheValue()
    this.containerScroll = this.containerScroll.bind(this)
    this.onContentChange = this.onContentChange.bind(this)
  }
  render() {
    let state = this.state
    return [
      <header className="edit-header" key='header'>
        <input type="text" className="title-input" placeholder="输入文章标题..." spellCheck="false"/>
      </header>,
      <div className="editor-main-a" ref={node=>this.aceBox = node} style={{height: state.aceBoxH}} key='main'>
        <div className="common-container editor-container" onMouseOver={this.setCurrentIndex.bind(this, 1)} onScroll={this.containerScroll} ref={node=>this.editContainer=node}>
          <div contentEditable="plaintext-only" name="editor-wrapper" id="editor-wrapper" className="common-wrapper editor-wrapper" onInput={this.onContentChange} ref={node=>this.editWrap=node}></div>
        </div>
        <div className="common-container preview-container" ref={node=>this.previewContainer=node} onMouseOver={this.setCurrentIndex.bind(this, 2)} onScroll={this.containerScroll}>
          <div className="markdown-body common-wrapper preview-wrapper" ref={node=>this.previewWrap=node} dangerouslySetInnerHTML={{__html: state.previewContent}}></div>
        </div>
      </div>
    ]
  }

  componentDidMount() {
    this.setState({
      aceBoxH: document.documentElement.clientHeight - document.querySelector('.edit-header').offsetHeight + 'px'
    })
  }

  cacheValue() {
    this.currentTabIndex = 1
    this.hasContentChanged = false
    this.scale = 1
  }

  setCurrentIndex(index) {
    this.currentTabIndex = index
  }

  containerScroll(e) {
    this.hasContentChanged && this.setScrollValue()
    if (this.currentTabIndex === 1) {
      this.previewContainer.scrollTop = this.editContainer.scrollTop * this.scale
    } else {
      this.editContainer.scrollTop = this.previewContainer.scrollTop / this.scale
    }
  }

  onContentChange(e) {
    this.setState({
      previewContent: marked(e.target.innerText)
    })
    !this.hasContentChanged && (this.hasContentChanged = true)
  }

  setScrollValue() {
    // 设置值，方便 scrollBy 操作
    this.scale = (this.previewWrap.offsetHeight - this.previewContainer.offsetHeight) / (this.editWrap.offsetHeight - this.editContainer.offsetHeight)
    this.hasContentChanged = false
  }
}
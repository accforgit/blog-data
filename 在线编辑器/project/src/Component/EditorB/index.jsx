import React from 'react'
import marked from 'marked'
import highlight from 'highlight.js'

import AceEditor, {editorHandler} from '../../Component/AceEditor/index'

import 'brace/mode/markdown'
import 'brace/theme/github'

require('../../static/style/common.css')
require('../../static/style/js-highlight.css')
require('./style.css')

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
    this.onContentChange = this.onContentChange.bind(this)
  }
  render() {
    let state = this.state
    return [
      <header className="edit-header" key='header'>
        <input type="text" className="title-input" placeholder="输入文章标题..." spellCheck="false"/>
      </header>,
      <div className="editor-main-b" ref={node=>this.aceBox = node} style={{height: state.aceBoxH + 'px'}} key='main'>
        <div className="ace-tm common-container editor-container" onMouseOver={this.setCurrentIndex.bind(this, 1)} ref={node=>this.editContainer=node}>
          {
            state.aceBoxH &&
            <AceEditor
              mode="markdown"
              theme="github"
              wrapEnabled={true}
              tabSize={2}
              fontSize={14}
              showPrintMargin={false}
              showGutter={false}
              height={state.aceBoxH + 'px'}
              width={'100%'}
              debounceChangePeriod={60}
              onChange={this.onContentChange}
              onScroll={this.containerScroll.bind(this, 1)}
              onLoad={()=>{
                console.log('ace-loaded')
              }}
              name="aceEditorMain"
              editorProps={{$blockScrolling: false}}
            />
          }
        </div>
        <div className="common-container preview-container" ref={node=>this.previewContainer=node} onMouseOver={this.setCurrentIndex.bind(this, 2)} onScroll={this.containerScroll.bind(this, 2)}>
          <div className="markdown-body preview-wrapper" ref={node=>this.previewWrap=node}></div>
        </div>
      </div>
    ]
  }

  componentDidMount() {
    this.setState({
      aceBoxH: document.documentElement.clientHeight - document.querySelector('.edit-header').offsetHeight
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

  containerScroll(index, e) {
    this.hasContentChanged && this.setScrollValue()
    if (this.currentTabIndex === 1 && index === 1) {
      this.previewContainer.scrollTop = e.renderer.getScrollTop() * this.scale
    } else if(this.currentTabIndex === 2 && index === 2) {
      editorHandler.getSession().setScrollTop(this.previewContainer.scrollTop / this.scale)
    }
  }

  onContentChange(value) {
    this.previewWrap.innerHTML = marked(value)
    !this.hasContentChanged && (this.hasContentChanged = true)
  }

  setScrollValue() {
    // 设置值，方便 scrollBy 操作
    this.scale = (this.previewWrap.offsetHeight - this.previewContainer.offsetHeight) / (editorHandler.getSession().getScreenLength()*editorHandler.renderer.lineHeight - this.state.aceBoxH)
    this.hasContentChanged = false
  }
}
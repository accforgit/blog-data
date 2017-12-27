import React from 'react'
import marked from 'marked'
import highlight from 'highlight.js'

import CodemirrorEditor, {CodemirrorHandler} from '../CodemirrorEditor'

require('codemirror/lib/codemirror.css')
require('codemirror/theme/solarized.css')
// 搜索 Ctrl-F (PC), Cmd-F (Mac)
// 搜索的上一个结果 Shift-Ctrl-G (PC), Shift-Cmd-G (Mac)
// 搜索的下一个结果 Ctrl-G (PC), Cmd-G (Mac)
// 替换(replace)   Shift-Ctrl-F (PC), Cmd-Alt-F (Mac)
// 替换全部(replaceAll)   Shift-Ctrl-R (PC), Shift-Cmd-Alt-F (Mac)
require('codemirror/addon/search/search')
// 光标跳到第几行 Alt-G，例如输入 9:26，则光标定位到第9行第26列
require('codemirror/addon/search/jump-to-line')
// 搜索或者跳转行数出现的弹出框样式
require('codemirror/addon/dialog/dialog.css')
// 当输入 '>' 或 '/' 字符的时候, 自动关闭标签
require('codemirror/addon/edit/closetag')
// 当光标定位于编辑器内，并且按 F11的时候编辑框全屏
require('codemirror/addon/display/fullscreen')
// 全屏样式
require('codemirror/addon/display/fullscreen.css')

require('codemirror/mode/javascript/javascript')
require('codemirror/mode/jsx/jsx')
require('codemirror/mode/css/css')
require('codemirror/mode/sass/sass')
require('codemirror/mode/xml/xml')
require('codemirror/mode/markdown/markdown')

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

export default class EditorC extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      aceBoxH: null,
      previewContent: '',
      currentTabIndex: 1,
      hasContentChanged: false,
      scale: 1
    }
    this.CodemirrorOptions = {
      lineNumbers: true,
      theme: 'solarized',
      tabSize: 2,
      lineWrapping: true,
			readOnly: false,
      mode: 'markdown',
      // 是否自动闭合标签，基于 codemirror/addon/edit/closetag
      autoCloseTags: true,
      // 自定义快捷键
      extraKeys: this.setExtraKeys()
    }
  }
	render () {
    let state = this.state
    return [
      <header className="edit-header" key='header'>
        <input type="text" className="title-input" placeholder="输入文章标题..." spellCheck="false"/>
      </header>,
      <div className="editor-main-c" ref={node=>this.aceBox = node} style={{height: state.editorBoxH + 'px'}} key='main'>
        <div className="common-container editor-container" onMouseOver={this.setCurrentIndex.bind(this, 1)} ref={node=>this.editContainer=node}>
          {
            state.editorBoxH &&
            <CodemirrorEditor
              ref="editor"
              onScroll={this.containerScroll.bind(this, 1)}
              onChange={this.updateCode.bind(this)}
              options={this.CodemirrorOptions}
              autoFocus={true}/>
          }
        </div>
        <div className="common-container preview-container" ref={node=>this.previewContainer=node} onMouseOver={this.setCurrentIndex.bind(this, 2)} onScroll={this.containerScroll.bind(this, 2)}>
          <div className="markdown-body preview-wrapper" dangerouslySetInnerHTML={{__html: state.previewContent}} ref={node=>this.previewWrap=node}></div>
        </div>
      </div>
    ]
  }

  componentDidMount() {
    this.setState({
      editorBoxH: document.documentElement.clientHeight - document.querySelector('.edit-header').offsetHeight
    })
  }

  setCurrentIndex(index) {
    this.setState({
      currentTabIndex: index
    })
  }

  containerScroll(index, e) {
    let state = this.state
    state.hasContentChanged && this.setScrollValue()
    if (state.currentTabIndex === 1 && index === 1) {
      this.previewContainer.scrollTop = e.top * state.scale
    } else if(state.currentTabIndex === 2 && index === 2) {
      CodemirrorHandler.scrollTo(null, this.previewContainer.scrollTop / state.scale)
    }
  }

  setScrollValue() {
    // 设置值，方便 scrollBy 操作
    // 两个容器元素的高度是相同的
    let containerH = this.previewContainer.offsetHeight
    this.setState({
      scale: (this.previewWrap.offsetHeight - containerH) / (CodemirrorHandler.getScrollInfo().height - containerH),
      hasContentChanged: false
    })
  }
  
  updateCode(newCode) {
    this.setState({
      previewContent: marked(newCode)
    })
    !this.state.hasContentChanged && (this.setState({hasContentChanged: true}))
  }
  
  setExtraKeys() {
    // 自定义快捷键
    const that = this
    let appendTxtFn = ()=> {
      let resultObj = {}
      let key2Command = [
        { name: 'Ctrl-H', value: '## ', offset: 0 },
        { name: 'Ctrl-B', value: '**', offset: 1 },
        { name: 'Ctrl-K', value: '[]()', offset: 3 },
        { name: 'Alt-K', value: '``', offset: 1 },
        { name: 'Alt-C', value: '```js\n\n```', offset: 0, offsetLine: 1 },
        { name: 'Alt-I', value: '![alt]()', offset: 1 },
        { name: 'Alt-L', value: '* ', offset: 0 }
      ]
      key2Command.forEach((item, index)=>{
        resultObj[item.name] = (cm)=> {
          that.setCursor(cm, item.value, item.offset, item.offsetLine)
        }
      })
      return resultObj
    }
    let otherKeys = {
      'F11'(cm) {
        // 全屏
        cm.setOption('fullScreen', !cm.getOption('fullScreen'))
      },
      'Esc'(cm) {
        // 退出全屏
        if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false)
      }
    }
    return Object.assign(otherKeys, appendTxtFn())
  }

  setCursor(cm, appendValue, offset = 0, offsetLine = 0) {
    let newValue = cm.getValue() + appendValue
    cm.setValue(newValue)
    let lastLine = cm.lastLine() - offsetLine
    cm.setCursor(lastLine, cm.getLine(lastLine).length - offset)
    this.updateCode(newValue)
  }
}
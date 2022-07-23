import { useRef, useState, useEffect, CSSProperties } from 'react'
import EditBox from '@/components/edit-box'
import { genLess2Css, genTypeModuleScript, genReactModuleScript, genReactTsModuleScript, genVue2ModuleScript, genVue3ModuleScript } from '@/util/trans'
import { htmlTemplate, vue2Template, vue3Template, reactTemplate, reactTsTemplate } from '@/util/defaultTemplate'
import { languages, TEditBoxForwardRef, TLanguageData } from '@/util/edit-util'
import Resize, { EDirection, EMoveEffect } from '@/util/resize'
import './App.less'

const styleLanguageList = [
  { language: languages.css, template: '' },
  { language: languages.less, template: '' },
]
const scriptLanguageList = [
  { language: languages.javascript, template: '' },
  { language: languages.typescript, template: '' },
  { language: languages.vue2, template: vue2Template },
  { language: languages.vue3, template: vue3Template },
  { language: languages.react, template: reactTemplate },
  { language: languages.reactTs, template: reactTsTemplate },
]

function App() {
  const defaultScriptData = scriptLanguageList[3]
  // iframe
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  // editor
  const htmlRef = useRef<TEditBoxForwardRef>(null)
  const styleRef = useRef<TEditBoxForwardRef>(null)
  const scriptRef = useRef<TEditBoxForwardRef>(null)
  // dom
  const htmlContainerRef = useRef<HTMLDivElement>(null)
  const styleContainerRef = useRef<HTMLDivElement>(null)
  const scriptContainerRef = useRef<HTMLDivElement>(null)
  const editorWrapperRef = useRef<HTMLDivElement>(null)
  const previewWrapperRef = useRef<HTMLDivElement>(null)
  const previewSliderRef = useRef<HTMLDivElement>(null)
  const firstFreshDone = useRef(false)

  const [scriptLanguage, setScriptLanguage] = useState<TLanguageData>(defaultScriptData.language)
  const [styleLanguage, setStyleLanguage] = useState<TLanguageData>(styleLanguageList[0].language)
  const [iframePointerEventsStyle, setIframePointerEventsStyle] = useState<CSSProperties['pointerEvents']>('all')

  const updateFirstFreshDone = () => {
    if (htmlRef.current && styleRef.current && scriptRef.current && !firstFreshDone.current) {
      refreshIframe()
      firstFreshDone.current = true
    }
  }
  const resetIframe = () => {
    iframeRef.current!.contentWindow!.postMessage({ event: 'reload' })
  }
  const refreshIframe = async () => {
    const htmlContent = htmlRef.current!.getValue()
    const styleContent = styleRef.current!.getValue()
    const scriptContent = scriptRef.current!.getValue()
    const styleManageMap = {
      [languages.css.label]: () => styleContent,
      [languages.less.label]: () => genLess2Css(styleContent)
    }
    const scriptManageMap = {
      [languages.javascript.label]: () => ({ importMap: '', styles: [] as string[], content: scriptContent }),
      [languages.typescript.label]: () => genTypeModuleScript(scriptContent),
      [languages.vue2.label]: () => genVue2ModuleScript(scriptContent),
      [languages.vue3.label]: () => genVue3ModuleScript(scriptContent),
      [languages.react.label]: () => genReactModuleScript(scriptContent),
      [languages.reactTs.label]: () => genReactTsModuleScript(scriptContent),
    }
    const data = await scriptManageMap[scriptLanguage.label as keyof typeof scriptManageMap]()
    const transStyle = await styleManageMap[styleLanguage.label as keyof typeof styleManageMap]()
    iframeRef.current!.contentWindow!.postMessage({
      event: 'invoke',
      data: {
        html: htmlContent,
        style: (data?.styles || []).reduce((t, c) => t + c, transStyle),
        script: {
          importMap: data?.importMap || '',
          content: data?.content || ''
        }
      }
    })
  }
  const registerListeners = () => {
    const listener = (e: MessageEvent<{ event: 'loaded' }>) => {
      if (e.data.event === 'loaded' && firstFreshDone.current) {
        refreshIframe()
      }
    }
    window.addEventListener('message', listener)
    return () => {
      window.removeEventListener('message', listener)
    }
  }
  const moveReSize = () => {
    const minHeight = styleRef.current!.getMoveRef()!.offsetHeight
    const moveVInstance = new Resize({
      direction: EDirection.V,
      list: [
        { containerEle: scriptContainerRef.current!, minHeight },
        { moveData: [{ ele: styleRef.current!.getMoveRef()!, effect: EMoveEffect.Shrink }], minHeight, containerEle: styleContainerRef.current! },
        { moveData: [{ ele: htmlRef.current!.getMoveRef()!, effect: EMoveEffect.Shrink }], minHeight, containerEle: htmlContainerRef.current! }
      ]
    })
    const moveHInstance = new Resize({
      direction: EDirection.H,
      list: [
        { containerEle: editorWrapperRef.current!, minWidth: 0 },
        { moveData: [{ ele: previewSliderRef.current!, effect: EMoveEffect.Shrink }], containerEle: previewWrapperRef.current!, minWidth: 16 },
      ],
      moveStart() {
        setIframePointerEventsStyle('none')
      },
      moveEnd() {
        setIframePointerEventsStyle('all')
      }
    })
    return () => {
      moveHInstance.destory()
      moveVInstance.destory()
    }
  }

  useEffect(() => {
    const listenerDestroy = registerListeners()
    const moveDestory = moveReSize()
    return () => {
      moveDestory()
      listenerDestroy()
    }
  }, [scriptLanguage, styleLanguage])

  return (
    <div className="App">
      <div className="editor-wrapper" ref={editorWrapperRef}>
        <div className="editor-box script-box" ref={scriptContainerRef}>
          <EditBox
            ref={scriptRef}
            language={scriptLanguage}
            languageList={scriptLanguageList}
            defaultValue={defaultScriptData.template}
            languageChange={setScriptLanguage}
            mountedCallback={updateFirstFreshDone} />
        </div>
        <div className="editor-box" ref={styleContainerRef}>
          <EditBox
            ref={styleRef}
            language={styleLanguage}
            languageList={styleLanguageList}
            languageChange={setStyleLanguage}
            mountedCallback={updateFirstFreshDone} />
        </div>
        <div className="editor-box" ref={htmlContainerRef}>
          <EditBox ref={htmlRef} defaultValue={htmlTemplate} language={languages.html} mountedCallback={updateFirstFreshDone} />
        </div>
      </div>
      <div className="preview-wrapper" ref={previewWrapperRef}>
        <div className="slider-bar" ref={previewSliderRef}></div>
        <div className="main-content">
          <div className="preview-header">
            <button className="grey-btn run-btn" onClick={resetIframe}>运行</button>
          </div>
          <iframe
            ref={iframeRef}
            src="/iframe.html"
            frameBorder="0"
            sandbox="allow-downloads allow-forms allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
            allow="accelerometer; camera; encrypted-media; display-capture; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write; web-share"
            scrolling="auto"
            allowFullScreen
            loading="lazy"
            style={{ pointerEvents: iframePointerEventsStyle }}
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default App

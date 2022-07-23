import { useImperativeHandle, useRef, forwardRef, Ref } from 'react'
import Editor, { loader } from "@monaco-editor/react"
import { BeforeMount, OnMount } from '@monaco-editor/react/lib/types.d'
import * as MONACO from 'monaco-editor/esm/vs/editor/editor.api'
import { languages, themeMap, getCustomThemeNameByLanguage, TEditBoxForwardRef, TLanguageData } from '@/util/edit-util'
import vue2Language from '@/components/languages/vue2'
import './index.less'

loader.config({
  paths: { vs: 'https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.33.0/min/vs' }
})

export type TLanguageTemplateData = {
  language: TLanguageData
  template: string
}

export default forwardRef(function EditBox(props: {
  language: TLanguageData
  defaultValue?: string
  languageList?: TLanguageTemplateData[]
  mountedCallback: () => void
  languageChange?: (language: TLanguageData) => void
}, editBoxForwardRef: Ref<TEditBoxForwardRef>) {
  const editorRef = useRef<MONACO.editor.IStandaloneCodeEditor | null>(null)
  const selectRef = useRef<HTMLSelectElement | null>(null)
  const moveRef = useRef<HTMLDivElement | null>(null)

  const templateValue = props.languageList?.find(d => d.language.label === props.language.label)?.template

  useImperativeHandle(editBoxForwardRef, () => ({
    getValue() {
      return editorRef.current!.getValue()
    },
    getMoveRef() {
      return moveRef.current
    }
  }), [editorRef.current, moveRef.current])

  const handleBeforeMount: BeforeMount = monacoInstance => {
    // jsx
    const optionJs = monacoInstance.languages.typescript.javascriptDefaults.getCompilerOptions()
    optionJs.noLib = true
    optionJs.jsx = monacoInstance.languages.typescript.JsxEmit.React
    monacoInstance.languages.typescript.javascriptDefaults.setCompilerOptions(optionJs)
    // tsx
    monacoInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true
    })
    monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monacoInstance.languages.typescript.JsxEmit.React,
      jsxFactory: 'React.createElement',
      reactNamespace: 'React',
      allowNonTsExtensions: true,
      allowJs: true,
      target: monacoInstance.languages.typescript.ScriptTarget.Latest
    })
    // vue2
    monacoInstance.languages.register({ id: themeMap[languages.vue2.id] })
    monacoInstance.languages.setMonarchTokensProvider(themeMap[languages.vue2.id], vue2Language.syntax)
    monacoInstance.editor.defineTheme(getCustomThemeNameByLanguage(languages.vue2.id), vue2Language.theme)
    // vue3
    monacoInstance.languages.register({ id: themeMap[languages.vue3.id] })
    monacoInstance.languages.setMonarchTokensProvider(themeMap[languages.vue3.id], vue2Language.syntax)
    monacoInstance.editor.defineTheme(getCustomThemeNameByLanguage(languages.vue3.id), vue2Language.theme)
  }
  const handleEditorDidMount: OnMount = editor => {
    editorRef.current = editor
    setTimeout(() => {
      props.mountedCallback()
    })
  }
  const handleSelectLanguageChange: React.ChangeEventHandler<HTMLSelectElement> = e => {
    props.languageChange!(props.languageList![e.target.selectedIndex as number].language)
  }
  const handleFillTemplate = () => {
    editorRef.current!.setValue(templateValue || '')
  }
  
  return (
    <div className="edit-com">
      <div className="header-box" ref={moveRef}>
        <div className="box-left">
          <span className="language-text">{ props.language.label }</span>
          {
            props.languageList ? (
              <select ref={selectRef} value={props.language.label} onChange={handleSelectLanguageChange}>
                { props.languageList.map(l => <option key={l.language.label} value={l.language.label}>{l.language.label}</option>) }
              </select>
            ) : null
          }
        </div>
        <div className="box-right">
          {
            templateValue ? <button className="grey-btn fill-template" onClick={handleFillTemplate}>填入模板</button> : null
          }
        </div>
      </div>
      <div className="editor-parent">
        <Editor
          height="100%"
          theme="vs-dark"
          options={{
            minimap: {
              enabled: false
            }
          }}
          language={props.language.id}
          defaultValue={props.defaultValue}
          beforeMount={handleBeforeMount}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  )
})

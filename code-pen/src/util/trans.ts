import { parse, compileTemplate } from 'vue/compiler-sfc'
import { compile, parseComponent } from 'vue-template-compiler/browser'
import less from 'less'
import { encode as base64Encode } from 'js-base64'
import * as buble from 'vue-template-es2015-compiler/buble'
import * as babelStandalone from '@babel/standalone'

const scriptUrlMaps = {
  vue2: {
    name: 'vue',
    url: 'https://pdn.zijieapi.com/esm/bv/vue@2.6.14'
  },
  vue3: {
    name: 'vue',
    url: 'https://pdn.zijieapi.com/esm/bv/vue@3.2.37'
  },
  react: {
    name: 'react',
    url: 'https://pdn.zijieapi.com/esm/bv/react@17.0.2'
  },
  reactDOM: {
    name: 'react-dom',
    url: 'https://pdn.zijieapi.com/esm/bv/react-dom@17.0.2'
  },
  babel: {
    name: 'babel',
    url: 'https://cdn.bootcdn.net/ajax/libs/babel-standalone/7.0.0-beta.3/babel.min.js'
  }
} as const

type scriptModuleMapKey = keyof typeof scriptUrlMaps

const genImportMapContent = (data: typeof scriptUrlMaps[scriptModuleMapKey][]) => {
  const obj = data.reduce((t, c) => {
    t[c.name] = c.url
    return t
  }, {} as Record<typeof scriptUrlMaps[scriptModuleMapKey]['name'], typeof scriptUrlMaps[scriptModuleMapKey]['url']>)
  return `{"imports":${JSON.stringify(obj)},"scopes":{}}`
}

const strictModeCompile = (str: string) => {
  return buble.transform(str, {
    transforms: {
      modules: false,
      stripWith: true,
      stripWithFunctional: false
    },
    objectAssign: 'Object.assign'
  }).code
}

const genVue2Template = (template: string) => {
  const obj = compile(template)
  const strictModeFn = strictModeCompile(`var render = function () {${obj.render}}`)
  const str = `
    ${strictModeFn}
    var staticRenderFns = ${JSON.stringify(obj.staticRenderFns)}
    render._withStripped = true
    export { render, staticRenderFns }
  `
  return base64Encode(str)
}

const genVue3Template = (template: string) => {
  const { code } = compileTemplate({
    id: 'app',
    filename: 'App.vue',
    source: template
  })
  return base64Encode(code)
}

export const genLess2Css = async (lessStr: string) => {
  return (await less.render(lessStr)).css
}

const vueTemplateLess = async (styles: SFCBlock[]) => {
  let css: string[] = []
  for (const style of styles) {
    css.push(style.attrs.lang === 'less' ? await genLess2Css(style.content) : style.content)
  }
  return css
}

export const genTypeModuleScript = (originContent: string) => {
  let content = ''
  try {
    content = babelStandalone.transform(originContent, {
      filename: 'file.ts',
      presets: ['typescript']
    }).code
  } catch (err) {
    console.error(err)
    return
  }
  return { content, styles: [], importMap: '' }
}

export const genVue2ModuleScript = async (originContent: string) => {
  let data: {
    template: SFCBlock | undefined
    script: SFCBlock | undefined
    styles: SFCBlock[]
    customBlocks: SFCBlock[]
  } | null = null
  try {
    data = parseComponent(originContent)
  } catch (err) {
    console.error(err)
    return
  }
  const { template, script, styles } = data
  if (!template || !script) return
  const content = `
  import Vue from 'vue'
  import component from 'data:text/javascript;base64,${base64Encode(script!.content)}'
  import {render,staticRenderFns} from 'data:text/javascript;base64,${genVue2Template(template!.content)}'
  const options = typeof component === 'function' ? component.options : component;
  options.render=render;
  options.staticRenderFns=staticRenderFns;
  options._compiled=true;
  options.functional=false;
  options.__file = 'App.vue';

  new Vue({render:h=>h(component)}).$mount('#app');
  `
  return {
    importMap: genImportMapContent([scriptUrlMaps.vue2]),
    styles: await vueTemplateLess(styles),
    content,
  }
}

export const genVue3ModuleScript = async (originContent: string) => {
  const { descriptor, errors } = parse(originContent, { sourceMap: true })
  let babelScript = descriptor.script?.content || ''
  try {
    babelScript = babelStandalone.transform(babelScript, {
      filename: 'app.ts',
      presets: ['typescript']
    }).code
  } catch (err) {
    console.error(err)
    return
  }
  if (errors.length) return
  return {
    importMap: genImportMapContent([scriptUrlMaps.vue3]),
    styles: await vueTemplateLess(descriptor.styles as SFCBlock[]),
    content: `
    import { createApp } from 'vue'
    import App from 'data:text/javascript;base64,${base64Encode(babelScript)}'
    import {render} from 'data:text/javascript;base64,${genVue3Template(descriptor.template?.content || '')}'
    App.render = render;
    App.__file = 'App.vue';
    createApp(App).mount('#app');
    `
  }
}

export const genReactModuleScript = (originContent: string) => {
  let content = ''
  try {
    content = babelStandalone.transform(originContent, {
      presets: ['react']
    }).code
  } catch (err) {
    console.error(err)
    return
  }
  return {
    importMap: genImportMapContent([scriptUrlMaps.react, scriptUrlMaps.reactDOM]),
    styles: [],
    content,
  }
}

export const genReactTsModuleScript = (originContent: string) => {
  let content = ''
  try {
    content = babelStandalone.transform(originContent, {
      filename: 'file.tsx',
      presets: ['react', 'typescript']
    }).code
  } catch (err) {
    console.error(err)
    return
  }
  return {
    importMap: genImportMapContent([scriptUrlMaps.react, scriptUrlMaps.reactDOM]),
    styles: [],
    content,
  }
}

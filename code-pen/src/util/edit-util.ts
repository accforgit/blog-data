export const languages = {
  html: { id: 'html', label: 'html' },
  css: { id: 'css', label: 'css' },
  less: { id:'less', label: 'less' },
  javascript: { id: 'javascript', label: 'javascript' },
  typescript: { id: 'typescript', label: 'typescript' },
  vue2: { id: 'vue2', label: 'vue2' },
  vue3: { id: 'vue3', label: 'vue3' },
  react: { id: 'javascript', label: 'react' },
  reactTs: { id: 'typescript', label: 'reactTs' },
} as const

export type TLanguageKeys = keyof typeof languages

export type TLanguageData = typeof languages[keyof typeof languages]

export const themeMap = {
  [languages.vue2.id]: 'vue2',
  [languages.vue3.id]: 'vue3',
  [languages.react.id]: 'react',
  [languages.reactTs.id]: 'reactTs'
} as const

export type TEditBoxForwardRef = {
  getValue: () => string
  getMoveRef: () => HTMLDivElement | null
}

export const getCustomThemeNameByLanguage = (language: keyof typeof themeMap) => (themeMap[language] + '-theme')

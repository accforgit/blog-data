const nodeTypes = {
  element: 1,
  text: 3,
  comment: 8,
} as const

type TAstNode = {
  nodeType: typeof nodeTypes[keyof typeof nodeTypes]
  tag?: string
  attributes?: { [key: string]: string }
  content?: string
  children?: TAstNode[]
}

// 匹配标签之前的文字节点/空白符节点
function matchTextEmpty(s: string) {
  return s.match(/^[^<]+(?=<)/)
}
// 匹配标签之前的空白符节点
function matchEmpty(s: string) {
  return s.match(/^\s+/)
}
// 匹配注释标签
function matchComment(s: string) {
  return s.match(/^<!--[^>]*-->/)
}
// 匹配自闭合标签
function matchAutoCloseTag(s: string) {
  return s.match(/^<(input|img|br|hr|meta|link)[^>]*>/)
}

function manageSingleRoot(s: string) {
  // 文字节点/空白符节点
  let mt = matchTextEmpty(s)
  if (mt) {
    return {
      str: s.slice(mt[0].length),
      node: { nodeType: nodeTypes.text, content: mt[0] }
    }
  }
  // 空白符节点
  mt = matchEmpty(s)
  if (mt) {
    return {
      str: s.slice(mt[0].length),
      node: { nodeType: nodeTypes.text, content: mt[0] }
    }
  }
  // 自闭合标签
  mt = matchAutoCloseTag(s)
  if (mt) {
    return {
      str: s.slice(mt[0].length),
      node: genSingleStr(s).data
    }
  }
  // 注释标签
  mt = matchComment(s)
  if (mt) {
    return {
      str: s.slice(mt[0].length),
      node: { nodeType: nodeTypes.comment, content: mt[0] }
    }
  }
  return null
}

function manageSingleChild(s: string) {
  // 文字节点/空白符节点
  let mt = matchTextEmpty(s)
  if (mt) {
    return {
      str: s.slice(mt[0].length),
      node: { nodeType: nodeTypes.text, content: mt[0] }
    }
  }
  // 空白符节点
  mt = matchEmpty(s)
  if (mt) {
    return {
      str: s.slice(mt[0].length),
      node: { nodeType: nodeTypes.text, content: mt[0] }
    }
  }
  // 自闭合标签
  mt = matchAutoCloseTag(s)
  if (mt) {
    return {
      str: s.slice(mt[0].length),
      node: genSingleStr(s)
    }
  }
  // 注释标签
  mt = matchComment(s)
  if (mt) {
    return {
      str: s.slice(mt[0].length),
      node: { nodeType: nodeTypes.comment, content: mt[0] }
    }
  }
  return null
}

function genHTML(s: string) {
  const root = [] as TAstNode[]
  while (s.length) {
    const singleNode = manageSingleRoot(s)
    if (singleNode) {
      root.push(singleNode.node)
      s = singleNode.str
      continue
    }
    const stack = []
    while (s.length) {
      const singleChildNode = manageSingleChild(s)
      if (singleChildNode) {
        stack[stack.length - 1].children.push(singleChildNode.node)
        s = singleChildNode.str
        continue
      }
      const end = s.indexOf('</')
      const start = s.indexOf('<')
      // 匹配到了结束标签
      if (end <= start) {
        const mtEnd = s.match(/<\/(\w+)[^>]*>/)
        if (!mtEnd) {
          console.log('匹配结束标签失败：', s.slice(0, 20))
          return null
        }
        const tag = mtEnd[1]
        if (tag !== stack[stack.length - 1].tag) {
          console.log(`标签无法匹配，${tag} => ${stack[stack.length - 1].tag}`)
          return null
        }
        stack.pop()
        s = s.slice(mtEnd[0].length)
        if (stack.length === 0) {
          break
        }
      } else {
        // 匹配到了开始标签
        const beginRoot = genSingleStr(s)
        if (stack.length === 0) {
          root.push(beginRoot.data)
        } else {
          stack[stack.length - 1].children.push(beginRoot)
        }
        stack.push(beginRoot.data)
        s = s.slice(beginRoot.matchStr.length)
      }
    }
  }
  return root
}

function genSingleStr(s: string) {
  const mt = s.match(/^<(\w+)\s*([^>]*?)\s*(\/)?>/)
  const obj = {
    nodeType: nodeTypes.element,
    tag: mt[1],
    attributes: {},
    children: []
  } as TAstNode
  const attributes = mt[2]
  if (attributes) {
    const mt1 = attributes.match(/([^\s=]+)(=(["'])(.*?)\3)?/g)
    if (mt1) {
      mt1.forEach(p => {
        const kv = p.trim().split('=')
        obj.attributes[kv[0]] = kv[1].slice(1, -1)
      })
    }
  }
  return {
    data: obj,
    matchStr: mt[0]
  }
}

// 使用示例
genHTML(`<div class="bui-select-option"><!----> <!----> <div class="bui-select-option-wrapper"><div data-v-1214d703="" class="byted-option byted-option-md"><!----> <div> 不限 </div></div><div data-v-1214d703="" class="byted-option byted-option-selected byted-option-md"><!----> <div> 潜力计划 </div></div></div> <!----> <!----> </div>`)
genHTML(`<p>12</p><span><img ></span><img />  <input /><b></b>`)
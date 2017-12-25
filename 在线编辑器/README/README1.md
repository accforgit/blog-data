# 手把手教你用 `100`行代码实现基于 `react`的 `markdown` 输入 `+` 即时预览在线编辑器（一）

首先，我承认加上样式等辅助代码其实并不止 `100`行，但是主体的编辑器组件确实是 `100`行，甚至去掉注释以及空白行还不到 `80`行，所以这个标题也算是站得住脚。

标题中包含了数字，量化的东西总能引起人的思考，然后又是 `react`和 `markdown`这两个当下较为时髦的名词，勾起读者心中的好奇，再来个`手把手`，这三个字虽然几乎被用烂了，但其吸引眼球的能力流芳千古，让众多深陷于意大利面条代码堆中的猿类顿时有种小清新的感觉，三招合一，整个标题仿佛散发出夺目的金光，犹如黑暗迷雾中的一座灯塔，何愁点击率和评论数不蹭蹭往上涨？

那么，为何要标题党呢？

以我的写作经验来看，两篇完全一样的文章，标题取得中规中矩的那一篇，无论是阅读量还是好评率，亦或者互动量基本上是比不过标题取得惊心动魄、吸引眼球的那一篇，甚至可以说是远远不如。

这与技术无关，你技术再牛逼，但是你不会吹，或者含蓄点地说不会表现，不好意思，看你取得那个标题连点进去看看的欲望都没有，谁管你写这篇文章到底用了多长时间耗费了多少脑力和体力呢？你技术一般般，但是标题取得好，点进去一看，文章也很好，大家都很开心，要是点进去一看是挂羊头卖狗肉的，那也没关系，最起码增加了一个点击量嘛，要是读者肯花时间再骂你一句，那就更好了，因为又多一个评论了。

为什么会有这种感慨呢？

这个……一言难尽啊。

(其实我这个标题还是太委婉了，真要是标题党的话，就该是：震惊，看了这篇文章，前端菜鸟也能基于 `react`打造属于自己的 `markdown`在线编辑器！)

---

## `DOM`结构
首先，先上效果图：

![1](./img/1.gif)

>首先说明一下，本文的一些细节或者技巧是建立在我的[另外一篇文章](https://juejin.im/post/5a3bb40e5188252b145b38e3)上的，如果你在读的过程中，有什么地方不太清楚的，可以先去看看[那篇文章](https://juejin.im/post/5a3bb40e5188252b145b38e3)，或许可以找到答案。

左侧是 `markdown`输入框，右侧是对应的 `markdown`输出即时预览框，两个元素框可以相互跟随滚动。

由效果图可以基本确定，整个页面大概分为三个大块，顶部的 `header`标题输入框、主体左侧 `markdown`输入框、主体右侧 `markdown`即时预览框。

于是，可以很快速地写下 `DOM`：
```jsx
render() {
  return [
    <header key='header'>
      <input type="text" placeholder="输入文章标题..." spellCheck="false"/>
    </header>,
    <div key='main'>
      <div>
        <div contentEditable="plaintext-only"></div>
      </div>
      <div>
        <div></div>
      </div>
    </div>
  ]
}
```
结构很简单，没什么好说的，除了那个带有 `contentEditable`属性的`div`元素

能够作为输入框的元素大概有三种：`input`，`textarea`以及`contentEditable`不为 `false`的元素

因为要输入大段文本内容，所以 `input`是指望不上了，又需要比较方便地获取到输入内容的总高度，斟酌再三 `textarea`也可以划掉了，只剩下第三个选项了。

对于一个元素，只要指定其 `contentEditable`属性，并且其值不为 `false`，那么此元素就是可以编辑的，不过大部分人只知道 `contentEditable=true`是什么意思，可能还不知道此属性值还可以为 `plaintext-only`。

并且此属性还不止可以取这两个值，此属性一共支持 `6`个值，至于为什么我这里使用 `plaintext-only`而不是 `true`，以及那 `6`个值都是什么意思，具体可以参考 [张鑫旭大神的这篇文章](http://www.zhangxinxu.com/wordpress/2016/01/contenteditable-plaintext-only/)， 当取值为 `plaintext-only`时，表示当前可编辑元素只能输入纯文本，富文本是无法输入的。

另外，`contentEditable`属性本身虽然早就已经被包括 `IE6`在内的绝大部分浏览器所支持，兼容性不是问题，但是当其取值为`plaintext-only`时，则只有 `chrome`等现代浏览器可正确识别，并且识别率还比较低，不过我觉得这不是问题，既然连`markdown`在线编辑器都用上了，那么这个用户的电脑上不至于还有 `IE6`的存在。

将样式补齐后，基本上编辑器的雏形就有了，左侧输入框可以任意输入内容了，下一步，就要把所输入的内容即时转为对应的预览页面。

---

## `marked`

将 `markdown`转为 `HTML`的插件有很多，我这里用的是其中较受欢迎的一个：[marked](https://github.com/chjj/marked)，此插件的优势在于编译速度，正好符合我们即时预览的需求。

首先安装此插件，安装完成后引入组件内：
```js
import marked from 'marked'
```

此插件使用很简单，只需要传入你所需要编译的 `markdown`文本，然后再根据需求设置相应的配置就行。

我们这里这里需要传入的 `markdown`文本自然就是在左侧输入框内输入的内容了，由于需要即时编译，所以就需要监听此输入框元素的输入事件(`input`)，每次输入都将输入的文本重新编译一次：
```html
<div contentEditable="plaintext-only" onInput={this.onContentChange}></div>
```

监听到文本内容发生变化，则对文本进行编译，并将编译出来的 `HTML`传入到右侧即时预览容器元素中：
```js
onContentChange(e) {
  this.setState({
    previewContent: marked(e.target.innerText, {breaks: true})
  })
}
```

`marked`就是暴露出来的编译方法，使用 `previewContent`这个 `state`来为右侧预览容器传入内容。

需要注意的是，我使用 `innerText`而不是 `innerHTML`来获取 `contentEditable`元素的内容，这是因为如果你使用 `innerHTML`的话，当你输入一些特殊字符，例如 `>`、`<`等，`innerHTML`的最终值都会自动帮你把这些特殊字符转为对应的 **字符实体**，例如 `<`转为 `&lt;`，`>`转为 `&gt;`。

这本来是没什么问题的，只要能正确显示就行了，但我们还需要将这些字符通过 `marked`转译为对应的 `HTML`，这样就有问题了，而使用 `innerText`就可以避免这个问题。

即时编译预览的问题`GET`

---

## 代码高亮

我们有时候可能会输出一些代码，如果能让代码高亮那就完美了，于是我引入了 [highlight.js](https://github.com/isagalaev/highlight.js)这个插件。

此插件可配合 `marked`一起使用，只需要对 `marked`进行配置，将 `highlight.js`作为一个配置项即可：
```js
marked.setOptions({
  highlight (code) {
    return highlight.highlightAuto(code).value
  }
})
```

这样，只要是通过 `marked`方法编译出来的`HTML`，就自动会应用上 `highlight.js`了，如果你还有其他的需求，也可以自己对 `marked`进行配置。

代码高亮`GET`

---

## 跟随滚动

这个问题的详细分析我已经在[另外一篇文章](https://juejin.im/post/5a3bb40e5188252b145b38e3)中说得差不多了，不清楚得可以去看下。

解决此问题的关键点只有两个：

1. 正确判断当前主动滚动的容器元素
2. 确定输入框容器元素与预览框容器元素之间 `scrollTop`的比例值

- 正确判断当前主动滚动的容器元素

不论是鼠标滚轮滚动还是拖动滚动条滚动，此时鼠标都肯定是在那个被滚动的容器范围内的，鼠标进入某个元素范围内会触发 `mouseover`事件，所以可以使用此事件来记录当前鼠标将要滚动的容器元素。
```html
<div className="common-container editor-container" onMouseOver={this.setCurrentIndex.bind(this, 1)}>
```

```js
setCurrentIndex(index) {
  this.currentTabIndex = index
}
```

如上，记录 `this.currentTabIndex`这个值，不同的值表示当前鼠标位于不同的元素上，接下来的滚动事件肯定就是这个元素触发的，确定了主动滚动元素，则其他的滚动就都是被动的跟随滚动了，便可以进行区分处理。

- 确定输入框容器元素与预览框容器元素之间 `scrollTop`的比例值

这个比例值 `scale`是可以根据已知条件确定的，即：
```
scale = (ch1 - ph1) / (ch2 - ph2)
```

至于上面的公式是什么意思，请移步我的[另外一篇文章](https://juejin.im/post/5a3bb40e5188252b145b38e3)，里面有详细说明。

```js
this.scale = (this.previewWrap.offsetHeight - this.previewContainer.offsetHeight) / (this.editWrap.offsetHeight - this.editContainer.offsetHeight)
```

`previewWrap`为右侧预览容器的内容元素，`previewContainer`为右侧预览容器元素；`editWrap`为左侧 `markdown`编辑容器的内容元素，`editContainer`为左侧 `markdown`编辑容器元素。

显而易见，由于你在左侧编辑框中输入内容的时候，输入框的内容高度(`this.editWrap.offsetHeight`)以及预览框内容的高度(`this.previewWrap.offsetHeight`)肯定是会发生相应变化的，所以 `scale`值也就不固定。

简单点话，每次监听到输入框的 `input`事件(输入、删除等操作都会触发此事件)，就重新计算一遍 `scale`值，这点性能损耗微乎其微，完全可用，不过本着一个技术人崇高的敬业精神也，稍微分析一下其实这点性能损耗还可以降到更低。

`scale`这个值只有当滚动容器的时候才会用到，所以没必要每次改变输入框内的文本就重新计算一次，只要保证在滚动的时候这个值是正确的就行了，并且也没必要每次滚动的时候都要重新计算一次 `scale`，只要输入框的内容没变，使用上次计算出来的值即可，因而可以使用一个变量 `hasContentChanged`来记录标识输入框内容是否发生了变化。

```js
onContentChange(e) {
  this.setState({
    previewContent: marked(e.target.innerText)
  })
  !this.hasContentChanged && (this.hasContentChanged = true)
}
```

简单的 `markdown`即时预览编辑器基本上就是这样了，如果你想要更加复杂的功能，只需要在此基础上进行增改即可。

例如，你想在其中插入一张图片，用`markdown`语法链接一个图片的格式大概是这种 `![图片](https://avatars2.githubusercontent.com/u/21095835?s=460&v=4)`，其实这与编辑器本身已经无关了，你只需要将上传的图片保存到服务器，或者用 `Blob`暂存在浏览器，然后将地址按照正确的语法赋给编辑器就行了。

---

## 更多

根据以上思路，基本上可以完成一个 `markdown`在线`+`预览编辑器了，虽然功能较为简单，但是确实是可用的，想要更加复杂的功能，可能还需要你自己在此基础上进行增改，比如自定义搜索、搜索结果高亮、`markdown`输入文本高亮等，这些功能虽说难度不高，但是也不是几行代码就能完成的事情，如果真跟这些较劲的话，那么 `996`怕是跑不了了。

不过别担心，很明显，在线编辑器是一个历史悠久的刚需，在轮子造的飞起的前端领域，一个预置了所有你需要功能的开箱即用的编辑器插件肯定早就存在了，而你要做的，只是随便写几行配置就行。

类似的插件，大名鼎鼎的有 [Ace](https://github.com/ajaxorg/ace)、[CodeMirror](https://github.com/codemirror/CodeMirror)等。

听说一篇文章如果写得太长，耐心看到后面的人就会出现断崖式下跌，所以我决定将剩下的内容放到下一篇文章中，下篇文章，我将介绍如何使用 [Ace](https://github.com/ajaxorg/ace)来打造一个与本文类似的在线编辑器。
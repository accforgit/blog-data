在一些支持用 `markdown`写文章的网站，例如 `掘金` 或者 `CSDN`等，后台写作页面，一般都是支持 `markdown`即时预览的，也就是将整个页面分成两部分，左半部分是你输入的 `markdown`文字，右半部分则即时输出对应的预览页面，例如下面就是 `CSDN`后台写作页面的 `markdown`即时预览效果：

![这里写图片描述](http://img.blog.csdn.net/20171220145227429?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvRGVlcExpZXM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

本文不是阐述如何从 `0`实现这种效果的（后续 **很可能** 会单出文章，），抛开其他，单看页面主体中左右两个容器元素，即 `markdown`输入框元素和预览显示框元素

本文要探讨的是，当这两个容器元素的内容都超出了容器高度，即都出现了滚动框的时候，如何在其中一个容器元素滚动时，让另外一个元素也随之滚动。

---

## `DOM`结构

既然是与滚动条有关，那么首先想到 `js`中控制滚动条高度的一个属性： `scrollTop`，只要能控制这个属性的值，自然也就能控制滚动条的滚动了。

对于以下 `DOM`结构：

```html
<div id="container">
  <div class="left"></div>
  <div class="right"></div>
</div>
```

其中，`.left`元素是左半部分输入框容器元素，`.right`元素是右半部分显示框容器元素，`.container`是它们共同的父元素。

由于需要溢出滚动，所以还需要设置一下对应的样式（只是关键样式，非全部）：
```css
#container {
  display: flex;
  border: 1px solid #bbb;
}
.left, .right {
  flex: 1;
  height: 100%;
  word-wrap: break-word;
  overflow-y: scroll;
}
```
再向 `.left`和 `.right`元素中塞入足够的内容，让二者出现滚动条，就是下面这种效果：

![这里写图片描述](http://img.blog.csdn.net/20171220155632166?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvRGVlcExpZXM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![这里写图片描述](http://img.blog.csdn.net/20171220155344554?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvRGVlcExpZXM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

样式是出来个大概了，下面就可以在这些 `DOM`上进行一系列的操作了。

---

## 初次尝试

大致思路，监听两个容器元素的滚动事件，在其中一个元素滚动的时候，获取这个元素的 `scrollTop`属性的值，同时将此值设置为另外一个滚动元素的 `scrollTop`值即可。

例如：

```
var l=document.querySelector('.left')
var r=document.querySelector('.right')
l.addEventListener('scroll',function(){
  r.scrollTop = l.scrollTop
})
```

效果如下：

![这里写图片描述](http://img.blog.csdn.net/20171221135052068?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvRGVlcExpZXM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

似乎很不错，但是现在是不仅想让右边跟随左边滚动，还想左边跟随右边滚动，于是再加以下代码：

```
l.addEventListener('scroll',function(){
  r.scrollTop = l.scrollTop
})
```

看上去很不错，然而，哪有那么简单的事情。

这个时候你再用鼠标滚轮进行滚动的时候，却发现滚动得有点吃力，两个容器元素的滚动似乎被什么阻碍住了，很难滚动。

仔细分析，原因很简单，当你在左边滚动的时候，触发了左边的滚动事件，于是右边跟随滚动，但是与此同时右边的跟随滚动也是滚动，于是也触发了右边的滚动，于是左边也要跟随右边滚动...然后就进入了一个类似于相互触发的情况，所以就会发现滚动得很吃力。

---

## 解决`scroll`事件同时触发的问题

想要解决上述问题，暂时有以下两种方案。

### 将 `scroll`事件换成 `mousewheel`事件

由于 `scroll`事件不仅会被鼠标主动滚动触发，同时改变容器元素的 `scrollTop`也会触发，元素的主动滚动其实就是鼠标滚轮触发的，所以可以将`scroll`事件换成一个对鼠标滚动敏感而不是元素滚动敏感的事件：'wheel'，于是上述监听代码变成了：

```
l.addEventListener('wheel',function(){
    r.scrollTop = l.scrollTop
})
r.addEventListener('wheel',function(){
    l.scrollTop = r.scrollTop
})
```

效果如下：

似乎是有点用，但是实际上还有两个问题。

- 当滚动其中一个容器元素的时候，另外一个容器元素虽然也跟着滚动，但滚动得并不流畅，高度有明显的瞬间弹跳

在网上找了一圈，没有找到关于 `wheel`事件滚动频率相关内容，我推测这可能就是此事件的一个 `feature`

鼠标每次滚动基本上都并不是以 `1px`为单位的，其最小单元远比 `scroll`事件小的多，我用我的鼠标在 `chrome`浏览器上滚动，每次滚过的距离都恰好是 `100px`，不同的鼠标或者浏览器这个数值应该都是不一样的，
而 `wheel`事件其实真正监听的是鼠标滚轮滚过一个齿轮卡点的事件，这也就能解释为何会出现弹跳的现象了。

一般来说，鼠标滚轮每滚过一个齿轮卡点，就能监听到一个`wheel`事件，从开始到结束，被鼠标主动滚动的元素已经滚动了 `100px`，所以另外一个跟随滚动的容器元素也就瞬间跳动了 `100px`，而之所以上述 `scroll`事件不会让跟随滚动元素出现瞬间弹跳，则是因为跟随滚动元素每次 `scrollTop`发生变化时，其值不会有 `100px`那么大的跨度，可能也没有小到`1px`，但由于其触发频率高，滚动跨度小，最起码在视觉上就是平滑滚动的了。

- `wheel`只是监听鼠标滚轮事件，但如果是用鼠标拖动滚动条，就不会触发此事件，另外的日期元素也就不会跟随滚动了

这个其实很好解决，用鼠标拖动滚动条肯定是能触发 `scroll`事件的，而在这种情况下，你肯定能够很轻易地判断出这个被拖动的滚动条是属于哪个容器元素的，只需要处理这个容器的滚动事件就行，另外一个跟随滚动容器的滚动事件不做处理即可。

## 实时判断

第一种，两个元素都绑定 `onScroll`事件，用 `mousemove`事件来设定当前鼠标是滚动哪个元素，然后滚动另外一个元素；
第二种，滚动事件`mouseWheel`，不太灵敏，且跳动较大；
第三种，延迟滚动
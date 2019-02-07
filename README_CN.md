# THREE.DOMTexture
将 DOM 转化成 threejs 纹理
## 概述
```DOMTexture``` 通过Blob 和 Foreign object SVG对象将 DOM 转化为纹理.
## 用法
引入script
```html
<script src="three.min.js"></script>
<script src="DOMTexture.min.js"></script>
```
创建纹理
```javascript
    var domTexture = new THREE.DOMTexure(options, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy)
    // 在纹理创建和DOM更新的时候别忘了设置needsUpdate去更新纹理
    domTexture.needsUpdate = true;
```
构造函数的第一个参数 ```options```，它可以为```DOM```，```DOMString```或者```object```，其他参数与 [THREE.Texture](https://threejs.org/docs/index.html#api/textures/Texture) 一致.
```javascript
  // DOM
  new THREE.DOMTexture(document.createElement('div'))
  // DOMString
  new THREE.DOMTexture('<div>...</div>')
  // object
  new THREE.DOMTexture({
      width: <number> // 内部 DOM 的宽度, 默认值：512
      height: <number> // 内部 DOM 的高度, 默认值： 512
      content: <DOM | DOMString> // 内部 DOM
  })
```

```domTexture``` 在 ```THREE.Texture``` 实例基础上新增的方法:
* ```setWidth``` - 设置内部 DOM 的宽度
* ```setHeight``` - 设置内部 DOM 的高度
* ```setContent``` -  设置内部 DOM [ ```DOM``` 或 ```DOMString``` ]
* ```domInlineStyle``` - 将环境中的样式写入到 DOM 中. 会影响 ```DOM``` 本身, 对 ```DOMString```无效果.
函数调用后需要更新纹理

## 注意事项
因为使用了Foreign object SVG，有一些事项需要注意
* __Internet Explorer 浏览器不支持__.
* SVG foreignObject 有很多安全限制, 任何对外部的访问都会失败 (i.e. link, iframes, web fonts)
    - 如果你想要使用```<link>``` 来引入一些样式, 你可以使用```<style>```并且将CSS内联进去.
    - 如果你想要使用```<img>```, 你可以设置一个```<div>``` 将图片设置为它的背景. __--WARN: 背景图片不能为url，但可以是```base64```__
* ```DOMTexture``` 可以获取到内部DOM中的 ```<style>``` , 但是无法获取到环境中的. 你可以调用```domTexture.domInlineStyle()``` 将环境样式内联到 DOM 上. __--WARN: ```domInlineStyle``` 会影响到你的DOM, 在内部为 ```DOMString``` 的情况时无效__

## TODO
* 将一些DOM上的事件绑定到纹理上
* 以转化的方式处理 ```<img>``` 和 ```<link>``` 等标签

## License
MIT licensed

Copyright (c) 2017 jinrui

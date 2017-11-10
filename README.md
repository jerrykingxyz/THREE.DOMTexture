# THREE.DOMTexture
Transform DOM to threejs texture
## Overview
```DOMTexture``` transform DOM to threejs texture with Blob and Foreign object SVG.
## Usage
Include script
```html
<script src="three.min.js"></script>
<script src="DOMTexture.min.js"></script>
```
create texture
```javascript
    var domTexture = new THREE.DOMTexure(options, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy)
    // don't forget update texture when you update the dom
    domTexture.needsUpdate = true;
```
the first parameter is ```options``` to set DOM
* ```width``` - internal DOM width, default ```512```
* ```height``` - internal DOM height, default ```512```
* ```content``` - internal DOM [ ```DOM``` or ```DOM string``` ]

other parameters is the same as [THREE.Texture](https://threejs.org/docs/index.html#api/textures/Texture).

The methods that ```domTexture``` added on ```THREE.Texture```:
* ```setWidth``` - set internal DOM width
* ```setHeight``` - set internal DOM height
* ```setContent``` -  set internal DOM [ ```DOM``` or ```DOM string``` ]
* ```domInlineStyle``` - write the context style to the element. affect your ```DOM```, useless for ```DOM string```.

## Caveats
Due to the use of Foreign object SVG, there are some things to be aware of.
* __Internet Explorer is not supported__, as it doesn't support the foreignObject tag in SVG.
* SVG's foreignObject is subject to strong security, any external content will likely fail (i.e. link, iframes, web fonts)
    - if you want to ```<link>``` some stylesheet, you can use ```<style>``` and write CSS in it.
    - if you want to use ```<img>```, you can use ```<div>``` and set the image as background. __--WARN: The background can not be a URL, but it can be ```base64```__
* ```DOMTexture``` can get style inside the ```<style>``` of the __internal DOM__, but can not get in the document context. you can run ```domTexture.domInlineStyle()``` to write the context style to the element. __--WARN: ```domInlineStyle``` will affect your DOM, useless for ```DOM string```__

## TODO
* binding some DOM events to texture
* transform ```<img>```

## License
MIT licensed

Copyright (c) 2017 jinrui
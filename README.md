# THREE.DOMTexture
Transform DOM to threejs texture
## Overview
Transform DOM to threejs texture with Blob and Foreign object SVG.
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
* ```width``` - canvas width, default ```512```
* ```height``` - canvas height, default ```512```
* ```content``` - ```DOM``` or ```DOM string``` you want to generate

other parameters is the same as [THREE.Texture](https://threejs.org/docs/index.html#api/textures/Texture)

## Caveats
Writing

## TODO
Writing

## License
MIT licensed

Copyright (c) 2017 jinrui
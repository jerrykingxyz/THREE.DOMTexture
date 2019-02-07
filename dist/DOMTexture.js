(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
	typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
	(factory((global.DOMTexture = {}),global.THREE));
}(this, (function (exports,three) { 'use strict';

	var supportsCSSText = getComputedStyle(document.body).cssText !== "";

	function inlineStyles(elem) {
	  var computedStyle = getComputedStyle(elem);
	  if(supportsCSSText) {
	    elem.style.cssText = computedStyle.cssText;
	  } else {
	    for(var key in computedStyle) {
	      var value = computedStyle[key];

	      if(isNaN(key * 1) && typeof value !== 'function' && !(/^(cssText|length|parentRule)$/).test(key)) {
	        elem.style[key] = value;
	      }
	    }
	  }
	}

	var DOMCanvas = function (option) {
	  if (typeof option === 'string' || option instanceof Element) {
	    option = { content: option };
	  }
	  option = Object.assign({
	    width: 512,
	    height: 512,
	    content: null
	  }, option);

	  var canvas = document.createElement('canvas');
	  canvas.width = option.width;
	  canvas.height = option.height;

	  // generate svg
	  var svg = document.createElement('svg');
	  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
	  svg.setAttribute('width', option.width);
	  svg.setAttribute('height', option.height);
	  var foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
	  foreignObject.setAttribute('width', '100%');
	  foreignObject.setAttribute('height', '100%');
	  var svgContent = document.createElement('div');
	  svgContent.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
	  svgContent.setAttribute('style', 'width:100%;height:100%;');
	  svgContent.innerText = '__content__';
	  foreignObject.appendChild(svgContent);
	  svg.appendChild(foreignObject);

	  // generate img
	  var img = document.createElement('img');
	  img.onload = (function () {
	    this.ctx.clearRect(0, 0, this.width, this.height);
	    this.ctx.drawImage(img, 0, 0);
	    if (typeof this.renderComplete === 'function') {
	      this.renderComplete();
	    }
	  }).bind(this);

	  // generate file reader
	  var reader = new FileReader();
	  reader.onloadend = function () {
	    img.src = reader.result;
	  };

	  // export
	  this.canvas = canvas;
	  this.ctx = canvas.getContext('2d');
	  this.svg = svg;
	  this.img = img;
	  this.reader = reader;
	  this.renderComplete = option.renderComplete;

	  this.width = option.width;
	  this.height = option.height;
	  this.content = option.content;
	};

	DOMCanvas.prototype = {

	  setWidth: function (width) {
	    if (typeof width === 'number') {
	      this.width = width;
	      this.canvas.width = width;
	      this.svg.setAttribute('width', width);
	    }

	    return this;
	  },

	  setHeight: function (height) {
	    if (typeof height === 'number') {
	      this.height = height;
	      this.canvas.height = height;
	      this.svg.setAttribute('height', height);
	    }

	    return this;
	  },

	  setContent: function (content) {
	    this.content = content;

	    return this;
	  },

	  setRenderComplete: function (fn) {
	    this.renderComplete = fn;

	    return this;
	  },

	  contentInlineStyle: function () {
	    if (this.content instanceof Element) {
	      var content = this.content;
	      inlineStyles(content);

	      content.querySelectorAll('*').forEach(inlineStyles);
	    }

	    return this;
	  },

	  render: function (renderContent) {
	    if (!renderContent) {
	      renderContent = this.content;
	    }

	    var content = '';
	    if (typeof renderContent === 'string') {
	      content = renderContent;
	    } else if (renderContent instanceof Element) {
	      content = renderContent.outerHTML;
	    }

	    var data = this.svg.outerHTML.replace('__content__', content);
	    var blob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
	    this.reader.readAsDataURL(blob);
	  }
	};

	var DOMTexture = function (options, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding) {

	  var domCanvas = new DOMCanvas(options);

	  domCanvas.setRenderComplete((function () {
	    this.version ++;
	  }).bind(this));

	  three.Texture.call(this, domCanvas.canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

	  this.domCanvas = domCanvas;
	  Object.defineProperty(this, 'needsUpdate', {
	    set: function (value) {
	      if (value === true) {
	        domCanvas.render();
	      }
	    }
	  });

	};

	DOMTexture.prototype = Object.assign(Object.create( three.Texture.prototype ), {

	  constructor: DOMTexture,

	  setWidth: function (width) {
	    this.domCanvas.setWidth(width);
	  },

	  setHeight: function (height) {
	    this.domCanvas.setHeight(height);
	  },

	  setContent: function (content) {
	    this.domCanvas.setContent(content);
	  },

	  domInlineStyle: function () {
	    this.domCanvas.contentInlineStyle();
	  }

	});

	if (typeof window !== 'undefined' && typeof window.THREE === 'object') {
	  window.THREE.DOMCanvas = DOMCanvas;
	  window.THREE.DOMTexture = DOMTexture;
	}

	exports.DOMCanvas = DOMCanvas;
	exports.DOMTexture = DOMTexture;

	Object.defineProperty(exports, '__esModule', { value: true });

})));

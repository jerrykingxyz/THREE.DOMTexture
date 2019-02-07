
const supportsCSSText = getComputedStyle(document.body).cssText !== "";

function inlineStyles(elem) {
  const computedStyle = getComputedStyle(elem);
  if(supportsCSSText) {
    elem.style.cssText = computedStyle.cssText;
  } else {
    for(const key in computedStyle) {
      const value = computedStyle[key];

      if(isNaN(key * 1) && typeof value !== 'function' && !(/^(cssText|length|parentRule)$/).test(key)) {
        elem.style[key] = value;
      }
    }
  }
}

const DOMCanvas = function (option) {
  if (typeof option === 'string' || option instanceof Element) {
    option = { content: option }
  }
  option = Object.assign({
    width: 512,
    height: 512,
    content: null
  }, option);

  let canvas = document.createElement('canvas');
  canvas.width = option.width;
  canvas.height = option.height;

  // generate svg
  let svg = document.createElement('svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', option.width);
  svg.setAttribute('height', option.height);
  let foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
  foreignObject.setAttribute('width', '100%');
  foreignObject.setAttribute('height', '100%');
  let svgContent = document.createElement('div');
  svgContent.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  svgContent.setAttribute('style', 'width:100%;height:100%;');
  svgContent.innerText = '__content__';
  foreignObject.appendChild(svgContent);
  svg.appendChild(foreignObject);

  // generate img
  let img = document.createElement('img');
  img.onload = (function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.drawImage(img, 0, 0);
    if (typeof this.renderComplete === 'function') {
      this.renderComplete()
    }
  }).bind(this);

  // generate file reader
  let reader = new FileReader();
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
      let content = this.content;
      inlineStyles(content);

      content.querySelectorAll('*').forEach(inlineStyles)
    }

    return this;
  },

  render: function (renderContent) {
    if (!renderContent) {
      renderContent = this.content
    }

    let content = '';
    if (typeof renderContent === 'string') {
      content = renderContent;
    } else if (renderContent instanceof Element) {
      content = renderContent.outerHTML;
    }

    let data = this.svg.outerHTML.replace('__content__', content);
    let blob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    this.reader.readAsDataURL(blob);
  }
};

export default DOMCanvas;

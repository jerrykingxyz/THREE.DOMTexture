
const supportsCSSText = getComputedStyle(document.body).cssText !== "";

function inlineStyles(elem) {
  const computedStyle = getComputedStyle(elem);
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

class DOMCanvas {

  constructor (option) {
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
    svgContent.innerText = '__content__';
    foreignObject.appendChild(svgContent);
    svg.appendChild(foreignObject);

    // generate img
    var img = document.createElement('img');
    img.onload = (function () {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.drawImage(img, 0, 0);
      if (typeof this.renderComplete === 'function') {
        this.renderComplete()
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
  }

  setWidth (width) {
    if (typeof width === 'number') {
      this.width = width;
      this.canvas.width = width;
      this.svg.setAttribute('width', width);
    }

    return this;
  }

  setHeight (height) {
    if (typeof height === 'number') {
      this.height = height;
      this.canvas.height = height;
      this.svg.setAttribute('height', height);
    }

    return this;
  }

  setContent (content) {
    this.content = content;

    return this;
  }

  setRenderComplete (fn) {
    this.renderComplete = fn;

    return this;
  }

  contentInlineStyle () {
    if (this.content instanceof Element) {
      var content = this.content;
      inlineStyles(content);

      content.querySelectorAll('*').forEach(inlineStyles)
    }

    return this;
  }

  render (renderContent) {
    if (!renderContent) {
      renderContent = this.content
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
}

export default DOMCanvas;

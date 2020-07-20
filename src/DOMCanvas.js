const supportsCSSText = getComputedStyle(document.body).cssText !== "";

function inlineStyles(elem) {
  const computedStyle = getComputedStyle(elem);
  if (supportsCSSText) {
    elem.style.cssText = computedStyle.cssText;
  } else {
    for (const key in computedStyle) {
      const value = computedStyle[key];

      if (
        isNaN(key * 1) &&
        typeof value !== "function" &&
        !/^(cssText|length|parentRule)$/.test(key)
      ) {
        elem.style[key] = value;
      }
    }
  }
}

const DOMCanvas = function(option) {
  if (typeof option === "string" || option instanceof Element) {
    option = { content: option };
  }
  option = Object.assign(
    {
      width: 512,
      height: 512,
      content: null,
      dpr: window.devicePixelRatio || 1
    },
    option
  );

  const dpr = option.dpr;
  const canvas = document.createElement("canvas");
  canvas.width = option.width * dpr;
  canvas.height = option.height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  // generate svg
  const svg = document.createElement("svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("width", option.width);
  svg.setAttribute("height", option.height);
  const foreignObject = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "foreignObject"
  );
  foreignObject.setAttribute("width", "100%");
  foreignObject.setAttribute("height", "100%");
  const svgContent = document.createElement("div");
  svgContent.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  svgContent.setAttribute("style", "width:100%;height:100%;");
  svgContent.innerText = "__content__";
  foreignObject.appendChild(svgContent);
  svg.appendChild(foreignObject);

  // generate img
  const img = document.createElement("img");
  img.onload = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.drawImage(img, 0, 0);
    if (typeof this.onRenderComplete === "function") {
      this.onRenderComplete();
    }
  }.bind(this);

  // generate file reader
  const reader = new FileReader();
  reader.onloadend = function() {
    img.src = reader.result;
  };

  // export
  this.canvas = canvas;
  this.ctx = ctx;
  this.svg = svg;
  this.img = img;
  this.reader = reader;
  this.onRenderComplete = option.onRenderComplete;

  this.width = option.width;
  this.height = option.height;
  this.content = option.content;
  this.dpr = dpr;
};

DOMCanvas.prototype = {
  constructor: DOMCanvas,

  setWidth: function(width) {
    if (typeof width === "number") {
      this.width = width;
      this.canvas.width = width * this.dpr;
      this.svg.setAttribute("width", width);
    }

    return this;
  },

  setHeight: function(height) {
    if (typeof height === "number") {
      this.height = height;
      this.canvas.height = height * this.dpr;
      this.svg.setAttribute("height", height);
    }

    return this;
  },

  setContent: function(content) {
    this.content = content;

    return this;
  },

  setDPR: function(dpr) {
    if (typeof dpr === "number") {
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.ctx.scale(dpr, dpr);
    }

    return this;
  },

  setOnRenderComplete: function(fn) {
    this.onRenderComplete = fn;

    return this;
  },

  contentInlineStyle: function() {
    if (this.content instanceof Element) {
      const content = this.content;
      inlineStyles(content);

      content.querySelectorAll("*").forEach(inlineStyles);
    }

    return this;
  },

  render: function(renderContent) {
    if (!renderContent) {
      renderContent = this.content;
    }

    let content = "";
    if (typeof renderContent === "string") {
      content = renderContent;
    } else if (renderContent instanceof Element) {
      content = renderContent.outerHTML;
    }

    const data = this.svg.outerHTML.replace("__content__", content);
    const blob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
    this.reader.readAsDataURL(blob);
  }
};

export default DOMCanvas;

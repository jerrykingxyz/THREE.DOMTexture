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

export class DOMCanvas {
  constructor(option) {
    if (typeof option === "string" || option instanceof Element) {
      option = { content: option };
    }
    option = Object.assign(
      {
        width: 512,
        height: 512,
        content: "",
        dpr: window.devicePixelRatio || 1,
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

    // export
    this.canvas = canvas;
    this.ctx = ctx;
    this.svg = svg;
    this.img = img;

    this.width = option.width;
    this.height = option.height;
    this.content = option.content;
    this.dpr = dpr;
  }

  setSize(params) {
    const width = params.width || this.width;
    const height = params.height || this.height;
    const dpr = params.pdr || this.dpr;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.ctx.scale(dpr, dpr);

    this.svg.setAttribute("width", width);
    this.svg.setAttribute("height", height);

    this.width = width;
    this.height = height;
    this.dpr = dpr;
    return this;
  }

  setContent(content) {
    this.content = content;

    return this;
  }

  contentInlineStyle() {
    if (this.content instanceof Element) {
      const content = this.content;
      inlineStyles(content);

      content.querySelectorAll("*").forEach(inlineStyles);
    }

    return this;
  }

  clone() {
    return new DOMCanvas({
      width: this.width,
      height: this.height,
      dpr: this.dpr,
      content: this.content,
    });
  }

  render() {
    const content =
      this.content instanceof Element ? this.content.outerHTML : this.content;

    const data = this.svg.outerHTML.replace("__content__", content);
    const img = this.img;
    const ctx = this.ctx;

    return new Promise(function (res) {
      img.onload = function () {
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.drawImage(img, 0, 0);
        img.onload = null;
        res();
      };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(data);
    });
  }
}

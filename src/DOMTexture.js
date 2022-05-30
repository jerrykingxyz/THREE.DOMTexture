import { Texture } from "three";
import { DOMCanvas } from "./DOMCanvas";

export class DOMTexture extends Texture {
  constructor(options, ...args) {
    const domCanvas = new DOMCanvas(options);

    super(domCanvas.canvas, ...args);

    this.domCanvas = domCanvas;
  }

  set needsUpdate(value) {
    if (value !== true) {
      return;
    }
    this.domCanvas.render().then(
      function () {
        this.version++;
        this.source.needUpdate = true;
      }.bind(this)
    );
  }

  setWidth(width) {
    this.domCanvas.setWidth(width);
  }

  setHeight(height) {
    this.domCanvas.setHeight(height);
  }

  setContent(content) {
    this.domCanvas.setContent(content);
  }

  setDPR(dpr) {
    this.domCanvas.setDPR(dpr);
  }

  domInlineStyle() {
    this.domCanvas.contentInlineStyle();
  }
}

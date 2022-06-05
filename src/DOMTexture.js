import { Texture } from "three";
import { DOMCanvas } from "./DOMCanvas";

export class DOMTexture extends Texture {
  constructor(options, ...args) {
    const domCanvas =
      options instanceof DOMCanvas ? options : new DOMCanvas(options);

    super(domCanvas.canvas, ...args);

    this.domCanvas = domCanvas;
  }

  updateSize(params) {
    this.domCanvas.setSize(params);
    const newTexture = new DOMTexture(this.domCanvas).copy(this);
    this.dispose();
    return newTexture;
  }

  setContent(content) {
    this.domCanvas.setContent(content);
  }

  domInlineStyle() {
    this.domCanvas.contentInlineStyle();
  }

  // overwrite Texture method
  set needsUpdate(value) {
    if (value !== true) {
      return;
    }
    this.domCanvas.render().then(
      function () {
        this.version++;
        this.source.needsUpdate = true;
      }.bind(this)
    );
  }

  clone() {
    const newTexture = new DOMTexture(this.domCanvas.clone());
    newTexture.copy({ ...this, source: newTexture.source });
    return newTexture;
  }
}

import { Texture } from 'three';
import DOMCanvas from './DOMCanvas';

class DOMTexture extends Texture {
  constructor (options, ...args) {
    const domCanvas = new DOMCanvas(options);
    super(domCanvas, ...args);

    domCanvas.setRenderComplete((function () {
      this.version ++;
    }).bind(this));
    this.domCanvas = domCanvas;
    Object.defineProperty(this, 'needsUpdate', {
      set: function (value) {
        if (value === true) {
          domCanvas.render();
        }
      }
    })
  }

  setWidth (width) {
    this.domCanvas.setWidth(width)
  }

  setHeight (height) {
    this.domCanvas.setHeight(height)
  }

  setContent (content) {
    this.domCanvas.setContent(content)
  }

  domInlineStyle () {
    this.domCanvas.contentInlineStyle()
  }
}

export default DOMTexture;

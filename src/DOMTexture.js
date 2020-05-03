import { Texture } from "three";
import DOMCanvas from "./DOMCanvas";

const DOMTexture = function(
  options,
  mapping,
  wrapS,
  wrapT,
  magFilter,
  minFilter,
  format,
  type,
  anisotropy,
  encoding
) {
  const domCanvas = new DOMCanvas(options);

  domCanvas.setOnRenderComplete(
    function() {
      this.version++;
    }.bind(this)
  );

  Texture.call(
    this,
    domCanvas.canvas,
    mapping,
    wrapS,
    wrapT,
    magFilter,
    minFilter,
    format,
    type,
    anisotropy,
    encoding
  );

  this.domCanvas = domCanvas;
  Object.defineProperty(this, "needsUpdate", {
    set: function(value) {
      if (value === true) {
        domCanvas.render();
      }
    }
  });
};

DOMTexture.prototype = Object.assign(Object.create(Texture.prototype), {
  constructor: DOMTexture,

  setWidth: function(width) {
    this.domCanvas.setWidth(width);
  },

  setHeight: function(height) {
    this.domCanvas.setHeight(height);
  },

  setContent: function(content) {
    this.domCanvas.setContent(content);
  },

  domInlineStyle: function() {
    this.domCanvas.contentInlineStyle();
  }
});

export default DOMTexture;

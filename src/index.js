import DOMCanvas from './DOMCanvas';
import DOMTexture from './DOMTexture';

if (typeof window !== 'undefined' && typeof window.THREE === 'object') {
  window.THREE.DOMCanvas = DOMCanvas;
  window.THREE.DOMTexture = DOMTexture;
}

export {
  DOMCanvas, DOMTexture
}
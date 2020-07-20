import { Texture } from "three";

type TContent = string | null | HTMLElement;
type TOption =
  | TContent
  | { width?: number; height?: number; content: TContent; dpr?: number };

declare class DOMCanvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  svg: HTMLElement;
  img: HTMLImageElement;
  reader: FileReader;
  onRenderComplete?: () => void;
  width: number;
  height: number;
  content: TContent;
  dpr: number;

  setWidth(width: number): DOMCanvas;
  setHeight(height: number): DOMCanvas;
  setContent(content: TContent): DOMCanvas;
  setDPR(dpr: number): DOMCanvas;
  setOnRenderComplete(fn?: () => void): DOMCanvas;
  contentInlineStyle(): DOMCanvas;
  render(content?: TContent): void;

  constructor(option?: TOption);
}

declare class DOMTexture extends Texture {
  domCanvas: DOMCanvas;
  setWidth(width: number): void;
  setHeight(height: number): void;
  setContent(content: string): void;
  setDPR(dpr: number): void;
  domInlineStyle(): void;
  constructor(options: TOption);
}

export { DOMCanvas, DOMTexture };

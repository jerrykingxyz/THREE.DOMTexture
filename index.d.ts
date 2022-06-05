import {
  Texture,
  Mapping,
  Wrapping,
  TextureFilter,
  PixelFormat,
  TextureDataType,
  TextureEncoding,
} from "three";

type TContent = string | HTMLElement;
type TSizeParams = {
  width?: number;
  height?: number;
  dpr?: number;
};
type TInitOption = TContent | (TSizeParams & { content: TContent });

declare class DOMCanvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  svg: HTMLElement;
  img: HTMLImageElement;
  width: number;
  height: number;
  content: TContent;
  dpr: number;

  setSize(params: TSizeParams): DOMCanvas;
  setContent(content: TContent): DOMCanvas;
  contentInlineStyle(): DOMCanvas;
  clone(): DOMCanvas;
  render(): Promise<void>;

  constructor(option?: TInitOption);
}

declare class DOMTexture extends Texture {
  domCanvas: DOMCanvas;

  updateSize(params: TSizeParams): DOMTexture;
  setContent(content: string): void;
  domInlineStyle(): void;

  constructor(
    options: TInitOption,
    mapping?: Mapping,
    wrapS?: Wrapping,
    wrapT?: Wrapping,
    magFilter?: TextureFilter,
    minFilter?: TextureFilter,
    format?: PixelFormat,
    type?: TextureDataType,
    anisotropy?: number,
    encoding?: TextureEncoding
  );
}

export { DOMCanvas, DOMTexture };

import { Notice } from "obsidian";
import { MindMapSettings } from "./settings";

export function copyImageToClipboard(
  svg: SVGElement,
  settings: MindMapSettings
) {
  const canvas = createCanvas(svg);
  const img = generateImage(svg, canvas, settings, () => {
    canvas.toBlob((blob: any) => {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]);
      new Notice("Screenshot copied to the clipboard.");
    });
  });
}

function createCanvas(svg: SVGElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = svg.clientWidth;
  canvas.height = svg.clientHeight;
  return canvas;
}

function generateImage(
  svg: SVGElement,
  canvas: HTMLCanvasElement,
  settings: MindMapSettings,
  callback: () => void
): HTMLImageElement {
  var ctx = canvas.getContext("2d");
  return drawInlineSVG(ctx, svg, settings, callback);
}

function drawInlineSVG(
  ctx: CanvasRenderingContext2D,
  svg: SVGElement,
  settings: MindMapSettings,
  callback: () => void
): HTMLImageElement {
  // get svg data
  let xml = new XMLSerializer().serializeToString(svg);

  const div = document.createElement("div");

  div.innerHTML = xml;

  const svgElement = div.querySelector("svg");
  svgElement.style.backgroundColor = settings.screenshotBgColor;

  xml = new XMLSerializer().serializeToString(svgElement);

  // make it base64
  const svg64 = btoa(unescape(encodeURIComponent(xml)));

  const b64Start = "data:image/svg+xml;base64,";

  // prepend a "header"
  const image64 = b64Start + svg64;

  const img = new Image();
  // set it as the source of the img element
  img.onload = function () {
    // draw the image onto the canvas
    ctx.drawImage(img, 0, 0);
    callback();
  };
  img.src = image64;
  return img;
}

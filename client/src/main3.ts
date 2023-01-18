import { IApplicationOptions } from 'pixi.js';
import MyWorker from './worker?worker'

const worker = new MyWorker()

const width = 800;
const height = 600;
const resolution = window.devicePixelRatio;
const canvas = document.createElement('canvas');

canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;
document.body.appendChild(canvas);

const view = canvas.transferControlToOffscreen();

const options: IApplicationOptions = {
  width,
  height,
  resolution,
  view,
  background: 0x1099bb
}

worker.postMessage({
  options,
}, [view]);
import { Application, Container, Texture, Sprite, IApplicationOptions } from '@pixi/webworker';

const initalize = ({ options }: { options: IApplicationOptions }) => {
  console.log(options)

  const app = new Application(options);

  const container = new Container();

  app.stage.addChild(container);

  // Create a new texture
  const textureUrl = new URL('vite.svg', 'http://localhost:5173/').toString();
  const texture = Texture.from(textureUrl);

  // Create a 5x5 grid of bunnies
  for (let i = 0; i < 25; i++) {
    const bunny = new Sprite(texture);
    bunny.anchor.set(0.5);
    bunny.x = (i % 5) * 40;
    bunny.y = Math.floor(i / 5) * 40;
    container.addChild(bunny);
  }

  // Move container to the center
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;

  // Center bunny sprite in local container coordinates
  container.pivot.x = container.width / 2;
  container.pivot.y = container.height / 2;

  // Listen for animate update
  app.ticker.add((delta: number) => {
    // rotate the container!
    // use delta to create frame-independent transform
    container.rotation -= 0.01 * delta;
  });
}

addEventListener('message', (ev) => {
  initalize(ev.data)
});

class App {
  app: Application;
  container: Container

  constructor(options: IApplicationOptions) {
    this.app = new Application(options);

    this.container = new Container();

    this.app.stage.addChild(this.container);
  }

  tick(delta: number) {

  }
}
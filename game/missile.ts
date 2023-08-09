import { Behavior_Instance } from "./app.js";
import Behavior from "./core/behavior.js";
import Bounds, { Vector2 } from "./core/bounds.js";
import Ship from "./ship.js";

export default class Missile extends Behavior {

  protected IsPhysics: boolean = true;
  protected Tag: string = "Missile";

  inverted: boolean = false;

  setInverted(inverted: boolean) {
    this.inverted = inverted;
  }

  image: HTMLImageElement;

  height: number = 0;
  width: number = 0;

  speed: number = 300;

  constructor() {
    super();
    this.image = new Image();
  }

  Load() {
    this.image.src = './missile.png';
    this.image.addEventListener('load', () => {
      this.height = this.image.height;
      this.width = this.image.width;

      this.boundingBox = new Bounds(new
        Vector2(this.x, this.y), new
        Vector2(this.width, 10));

      this.setIsLoaded(true);
    })
  }

  Update(deltaTime: number) {
    if (this.inverted) {
      this.x -= this.speed * deltaTime;
      if (this.x < -this.width / 2) {
        this.Destroy();
      }
    }
    else {
      this.x += this.speed * deltaTime;
      if (this.x > Behavior_Instance.SCREEN_WIDTH + (this.width / 2)) {
        this.Destroy();
      }
    }
  }

  OnDestroy(): void {

  }

  OnCollisionEnter(other: Behavior): void {
    if (this.Tag === "Missile") {
      if (other.GetTag() === "Asteroide") {
        this.Destroy();
        Ship.instance.score += 100;
      }
    }
    else {
      if (other.GetTag() === "Player") {
        this.Destroy();
        other.Destroy();
      }
    }
  }

  Draw(ctx: CanvasRenderingContext2D, deltaTime: number) {

    if (this.inverted) {
      ctx.save();
      ctx.scale(-1, 1);

      ctx.drawImage(this.image,
        Math.round(-this.x - this.width / 2),
        Math.round(this.y - this.height / 2)
      );

      ctx.restore();

    }
    else {

      ctx.drawImage(this.image,
        Math.round(this.x - this.width / 2),
        Math.round(this.y - this.height / 2)
      );
    }
  }

}
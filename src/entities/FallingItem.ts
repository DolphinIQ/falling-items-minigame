import { Point, Sprite, type Ticker, type Texture, Graphics } from "pixi.js";
import 'pixi.js/math-extras';

class FallingItem
{
    sprite: Sprite;
    #rotationSpeed: number;
    #fallingSpeed: number;
    collisionRadius: number;

    constructor( texture: Texture )
    {
        texture.source.scaleMode = "nearest";
        this.sprite = new Sprite( texture );
        this.sprite.anchor.set( 0.5, 0.5 );
        this.#rotationSpeed = 0.005 + Math.random() * 0.02;
        // this.#fallingSpeed = 1 + Math.random() * 1;
        this.#fallingSpeed = 0.3 + Math.random() * 0.5;
        this.collisionRadius = 10;
    }

    update( time: Ticker )
    {
        this.sprite.position.y += this.#fallingSpeed * time.deltaTime;
        this.sprite.rotation += this.#rotationSpeed;
    }
}

export { FallingItem };
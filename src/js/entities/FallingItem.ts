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
        this.sprite.scale.set( 4 );
        this.sprite.anchor.set( 0.5, 0.5 );
        this.#rotationSpeed = 0.005 + Math.random() * 0.02;
        this.#fallingSpeed = 2 + Math.random() * 2;
        this.collisionRadius = 10;
    }

    update( time: Ticker, screenMarginX: number, screenMarginY: number ): void
    {
        this.sprite.position.y += this.#fallingSpeed * time.deltaTime;
        this.sprite.rotation += this.#rotationSpeed;

        // Responsive design check in case the window has shrunk
        if ( this.#isOutsideScreenWidthBounds( screenMarginX ) )
        {
            this.resetFallingPosition( screenMarginX, screenMarginY );
        }
    }

    #isOutsideScreenWidthBounds( marginX: number ): boolean
    {
        if ( this.sprite.position.x < marginX || this.sprite.position.x > window.innerWidth - marginX )
        {
            return true;
        }
        return false;
    }

    resetFallingPosition( marginX: number, marginY: number ): void
    {
        this.sprite.position.x = marginX + Math.random() * (window.innerWidth - (marginX * 2));
        this.sprite.position.y = marginY + Math.random() * window.innerHeight * 0.3;
    }
}

export { FallingItem };
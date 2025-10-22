import { Assets, Point, Sprite, Texture, Ticker } from "pixi.js";
import type { FallingItem } from "./FallingItem";

class PlayerInput
{
    left: boolean;
    right: boolean;
    constructor()
    {
        this.left = false;
        this.right = false;
    }
}

class Player
{
    sprite: Sprite;
    velocity: Point;
    #acceleration: Point;
    #input: PlayerInput;
    health: number;

    constructor( texture: Texture )
    {
        texture.source.scaleMode = "nearest";
        this.velocity = new Point( 0, 0 );
        // this.#acceleration = new Point( 40, 0 );
        this.#acceleration = new Point( 20, 0 ); //////////////////////
        this.#input = new PlayerInput();
        this.sprite = new Sprite( texture );
        this.sprite.scale.set( 2 );
        this.sprite.anchor.set( 0.5, 0.5 );
        this.sprite.bounds.width *= 0.5;
        this.health = 10;

        window.addEventListener( "keydown", ( evt ) => {
            this.#keymap( evt.key, true );
        }, false );
        window.addEventListener( "keyup", ( evt ) => {
            this.#keymap( evt.key, false );
        }, false );
    }

    #keymap( key: string, isPressedDown: boolean ): void
    {
        if ( key === 'ArrowLeft' )
        {
            this.#input.left = isPressedDown;
        }
        if ( key === 'ArrowRight' )
        {
            this.#input.right = isPressedDown;
        }
    }

    update( time: Ticker, floorFriction: number ): void
    {
        if ( this.#input.left )
        {
            this.velocity.x -= this.#acceleration.x;
        }
        if ( this.#input.right )
        {
            this.velocity.x += this.#acceleration.x;
        }
        this.velocity.x *= floorFriction;
        if ( Math.abs( this.velocity.x ) < 0.01 )
        {
            this.velocity.x = 0;
        }

        this.sprite.position.x += this.velocity.x / time.deltaMS;
        this.sprite.position.y -= this.velocity.y / time.deltaMS;
    }

    collidesWithFallingItem( item: FallingItem ): boolean
    {
        if (
            item.sprite.x + item.collisionRadius > this.sprite.x - this.sprite.bounds.width &&
            item.sprite.x - item.collisionRadius < this.sprite.x + this.sprite.bounds.width &&
            item.sprite.y + item.collisionRadius > this.sprite.y - this.sprite.bounds.height &&
            item.sprite.y - item.collisionRadius < this.sprite.y + this.sprite.bounds.height
        ) {
            return true;
        }
        return false;
    }
}

export { Player };
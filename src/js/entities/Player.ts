import { Point, Sprite, Texture, Ticker } from "pixi.js";
import type { FallingItem } from "./FallingItem";
import { playSound, Sounds } from "../Sounds";
import type { Level } from "../Level";
import { UI } from "../UI";
import type { Game } from "../Game";

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

    constructor( private readonly game: Game, texture: Texture )
    {
        texture.source.scaleMode = "nearest";
        this.velocity = new Point( 0, 0 );
        this.#acceleration = new Point( 40, 0 );
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
        if ( key === 'ArrowLeft' || key === 'a' )
        {
            this.#input.left = isPressedDown;
        }
        if ( key === 'ArrowRight' || key === 'd' )
        {
            this.#input.right = isPressedDown;
        }
    }

    onUpdate( time: Ticker )
    {
        // Handle input
        if ( this.#input.left )
        {
            this.velocity.x -= this.#acceleration.x / time.deltaMS;
        }
        if ( this.#input.right )
        {
            this.velocity.x += this.#acceleration.x / time.deltaMS;
        }

        // Apply factors like friction to velocity 
        this.velocity.x *= this.game.getCurrentLevel().floorFrictionFactor;
        if ( Math.abs( this.velocity.x ) < 0.01 )
        {
            this.velocity.x = 0;
        }

        // Finally apply velocity to position
        this.sprite.position.x += this.velocity.x;
        this.sprite.position.y -= this.velocity.y;

        // Check position against screen bounds, allowing bouncing off screen edges
        if ( this.sprite.position.x < this.game.getCurrentLevel().playerScreenBoundsX ) // left bounds
        {
            this.velocity.x = Math.abs( this.velocity.x ) * this.game.getCurrentLevel().floorFrictionFactor;
            this.velocity.x = Math.max( this.velocity.x, Player.MIN_BOUNDS_VELOCITY );
            this.sprite.position.x += this.velocity.x * 0.2;
        }
        if ( this.sprite.position.x > window.innerWidth - this.game.getCurrentLevel().playerScreenBoundsX ) // right bounds
        {
            this.velocity.x = -Math.abs( this.velocity.x ) * this.game.getCurrentLevel().floorFrictionFactor;
            this.velocity.x = Math.min( this.velocity.x, -Player.MIN_BOUNDS_VELOCITY );
            this.sprite.position.x += this.velocity.x * 0.2;
        }
    }

    collect( item: FallingItem, currentLevel: Level )
    {
        playSound( Sounds.eating );
        currentLevel.score += 1;
        UI.updateScore( currentLevel.score, currentLevel.winningScoreCount );
        item.resetFallingPosition();
    }

    reset( floorHeight: number ): void
    {
        this.sprite.position.set( window.innerWidth / 2, window.innerHeight - floorHeight - 75 );
        this.health = Player.MAX_HEALTH;
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

    static MAX_HEALTH: number = 10;
    static MIN_BOUNDS_VELOCITY: number = 20;
}

export { Player };
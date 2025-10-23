import { Sprite, type Ticker, type Texture } from "pixi.js";
import 'pixi.js/math-extras';
import type { OnUpdate } from "../onUpdate";
import type { Game } from "../Game";
import { playSound, Sounds } from "../Sounds";
import { UI } from "../UI";

class FallingItem implements OnUpdate
{
    game: Game;
    sprite: Sprite;
    private rotationSpeed: number;
    private fallingSpeed: number;
    collisionRadius: number;

    constructor( texture: Texture, game: Game )
    {
        texture.source.scaleMode = "nearest";
        this.sprite = new Sprite( texture );
        this.sprite.scale.set( 4 );
        this.sprite.anchor.set( 0.5, 0.5 );
        this.sprite.cullable = true;
        this.rotationSpeed = 0.005 + Math.random() * 0.02;
        this.fallingSpeed = Math.random() * 4;
        this.collisionRadius = 10;
        this.game = game;
    }

    onUpdate( ticker: Ticker ): void
    {
        this.updatePosition( ticker );

        if ( this.itemPassedThroughFloor() ) // Player failed to catch the item
        {
            playSound( Sounds.lostHealth );
            this.resetFallingPosition();
            this.game.player.health -= 1;
            UI.updateHealth( this.game.player.health );
            if ( this.game.player.health <= 0 )
            {
                this.game.getCurrentLevel().lose();
            }
        }
    }

    updatePosition( time: Ticker ): void
    {
        this.sprite.position.y += (this.game.getCurrentLevel().gravity + this.fallingSpeed) * time.deltaTime;
        this.sprite.rotation += this.rotationSpeed;

        // Responsive design check in case the window has shrunk
        if ( this.isOutsideScreenWidthBounds( this.game.getCurrentLevel().itemsScreenBoundsX ) )
        {
            this.resetFallingPosition();
        }
    }

    private itemPassedThroughFloor(): boolean
    {
        if ( this.sprite.position.y > window.innerHeight )
        {
            return true;
        }
        return false;
    }

    private isOutsideScreenWidthBounds( marginX: number ): boolean
    {
        if ( this.sprite.position.x < marginX || this.sprite.position.x > window.innerWidth - marginX )
        {
            return true;
        }
        return false;
    }

    resetFallingPosition(): void
    {
        const marginX = this.game.getCurrentLevel().itemsScreenBoundsX;
        const marginY = this.game.getCurrentLevel().itemsScreenBoundsY;
        this.sprite.position.x = marginX + Math.random() * (window.innerWidth - (marginX * 2));
        this.sprite.position.y = marginY + Math.random() * marginY * 0.5;
    }
}

export { FallingItem };
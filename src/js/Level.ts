import { Graphics, type Ticker } from "pixi.js";
import type { OnUpdate } from "./onUpdate";
import type { Game } from "./Game";
import { UI } from "./UI";

type LevelOptions =
{
    id: number;
    itemsScreenBoundsX: number;
    itemsScreenBoundsY: number;
    floorHeight: number;
    floorColor: number; // Hexadecimal color, for example 0xFF0000
    floorFrictionFactor: number;
    gravity: number;
    activeItemsCount: number;
    winningScoreCount: number;
};

class Level implements OnUpdate
{
    game: Game;
    id: number;
    itemsScreenBoundsX: number;
    itemsScreenBoundsY: number;
    playerScreenBoundsX: number;
    floorHeight: number;
    floorColor: number;
    floorFrictionFactor: number;
    gravity: number;
    activeItemsCount: number;
    winningScoreCount: number;
    score: number;
    floor: Graphics;

    constructor( game: Game, options: LevelOptions )
    {
        this.game = game;
        this.id = options.id;
        this.itemsScreenBoundsX = options.itemsScreenBoundsX;
        this.itemsScreenBoundsY = options.itemsScreenBoundsY;
        this.playerScreenBoundsX = options.itemsScreenBoundsX - 50;
        this.floorHeight = options.floorHeight;
        this.floorColor = options.floorColor;
        this.floorFrictionFactor = options.floorFrictionFactor;
        this.gravity = options.gravity;
        if ( options.activeItemsCount > Level.MAXIMUM_ITEMS_COUNT )
        {
            throw Error( `Active items count for level ${ this.id } is over the limit!` );
        }
        this.activeItemsCount = options.activeItemsCount;
        this.winningScoreCount = options.winningScoreCount;
        this.score = 0;

        this.floor = new Graphics();
        this.floor.rect( 0, window.innerHeight - this.floorHeight, 4096, this.floorHeight );
        this.floor.fill( this.floorColor );
    }

    onUpdate( ticker: Ticker ): void
    {      
        if ( this.score >= this.winningScoreCount )
        {
            this.finish();
        }
    }

    start()
    {
        UI.updateLevel( this.id );
        UI.updateScore( 0, this.winningScoreCount );
        this.game.renderer.staticObjects.addChild( this.floor );
    }

    cleanup()
    {
        this.score = 0;
        this.game.renderer.staticObjects.removeChild( this.floor );
    }

    lose()
    {
        this.cleanup();
        this.game.lose();
    }

    finish()
    {
        this.cleanup();
        this.game.endLevel();
    }

    static MAXIMUM_ITEMS_COUNT: number = 100;
}

export { Level };
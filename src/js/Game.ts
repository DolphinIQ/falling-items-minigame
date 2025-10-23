
import { Application, Container, Texture, Ticker } from 'pixi.js';
import { FallingItem } from './entities/FallingItem';
import { Player } from './entities/Player';
import { UI } from './UI';
import { Level } from './Level';
import type { TextureAssets } from './initialization/initTextures';
import type { OnUpdate } from './onUpdate';

import GameStats from 'gamestats.js';
const stats = new GameStats();
document.body.appendChild( stats.dom );

class Renderer
{
    app: Application; // Pixi!!!
    staticObjects: Container;
    dynamicObjects: Container;

    constructor()
    {
        this.app = new Application();
        this.staticObjects = new Container({
            isRenderGroup: true,
        });
        this.dynamicObjects = new Container({
            isRenderGroup: true,
        });
    }

    async init( game: Game )
    {
        await this.app.init({ background: '#1e768bff', resizeTo: window, backgroundAlpha: 1 });
        document.body.appendChild( this.app.canvas );

        this.app.stage.addChild( this.staticObjects, this.dynamicObjects );

        this.app.ticker.add( ( ticker ) => {
            game.onUpdate( ticker );
        } );
    }
}

class Game implements OnUpdate
{
    renderer: Renderer;
    private isRunning: boolean;
    player: Player;
    private fallingItemsPool: FallingItem[] = [];
    private levels: Level[] = [];
    private currentLevel: Level | null = null;

    constructor( textures: TextureAssets )
    {
        this.renderer = new Renderer();
        this.isRunning = true;

        this.player = new Player( this, textures.hero );
        this.renderer.dynamicObjects.addChild( this.player.sprite );
        this.initFood( textures );
    }

    async initRenderer()
    {
        await this.renderer.init( this );
    }

    setLevels( levels: Level[] ): void
    {
        this.levels = levels;
        this.currentLevel = this.levels[ 0 ];
    }

    getCurrentLevel(): Level
    {
        if ( !this.currentLevel )
        {
            throw new Error( `Couldnt get current level!` );
        }
        return this.currentLevel;
    }

    onUpdate( ticker: Ticker ): void
    {
        if ( this.isRunning === false ) return;

        stats.begin();

        this.getCurrentLevel().onUpdate( ticker );

        for ( let i = 0; i < this.getCurrentLevel().activeItemsCount; i++ )
        {
            const item = this.fallingItemsPool[ i ];

            item.onUpdate( ticker );

            if ( this.player.collidesWithFallingItem( item ) ) // Player caught the item
            {
                this.player.collect( item, this.getCurrentLevel() );
            }
        }

        this.player.onUpdate( ticker );

        stats.end();
    }

    initFood( textures: TextureAssets ): void
    {
        const foodTexturesKeys: string[] = Object.keys( textures.foods );
        for ( let i = 0; i < Level.MAXIMUM_ITEMS_COUNT; i++ )
        {
            const textureSrc: string | undefined = foodTexturesKeys[ i % foodTexturesKeys.length ];
            if ( textureSrc === undefined ) throw new Error( "Couldnt resolve falling item texture path" );
            const itemTexture: Texture | undefined = textures.foods[ textureSrc ];
            if ( itemTexture === undefined ) throw new Error( "Couldnt get texture from textures" );

            const item = new FallingItem( itemTexture, this );
            this.fallingItemsPool.push( item );
            this.renderer.dynamicObjects.addChild( item.sprite );
        }
    }

    startLevel( level: Level ): void
    {
        this.currentLevel = level;
        this.currentLevel.start();
        this.isRunning = true;

        for ( const item of this.fallingItemsPool )
        {
            item.resetFallingPosition();
        }
        this.player.reset( this.currentLevel.floorHeight );

        UI.updateLevel( this.currentLevel.id );
        UI.updateHealth( this.player.health );
        UI.updateScore( this.currentLevel.score, this.currentLevel.winningScoreCount );
        UI.endGameMenuHide();
    }

    start(): void
    {
        this.startLevel( this.levels[ 0 ] );
    }

    endLevel(): void
    {
        this.isRunning = false;
        const nextLevelIndex = this.getCurrentLevel().id + 1;
        if ( nextLevelIndex < this.levels.length )
        {
            this.startLevel( this.levels[ nextLevelIndex ] );
        }
        else
        {
            this.win();
        }
    }

    lose(): void
    {
        this.isRunning = false;
        UI.endGameMenuShow();
    }

    win(): void
    {
        UI.endGameMenuShow( "YOU WON!" ); // Show winning screen
    }
}

export { Game };
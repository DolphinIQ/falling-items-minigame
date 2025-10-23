// description: This example demonstrates how to use a Container to group and manipulate multiple sprites
import { Application, Assets, Bounds, Container, Graphics, Point, Rectangle, Sprite, Texture, Ticker, WebGLRenderer } from 'pixi.js';
import { FallingItem } from './entities/FallingItem';
import { Player } from './entities/Player';
import { playSound, Sounds } from './Sounds';
import GameStats from 'gamestats.js';
import { UI } from './UI';

const stats = new GameStats();
document.body.appendChild( stats.dom );

const fallingItems: FallingItem[] = [];
const helpers: Graphics[] = [];
let player: Player;
let playerGr: Graphics;
let isRunning: boolean = true;
const SCREEN_MARGIN_X: number = 100;
const SCREEN_MARGIN_Y: number = 140;
const PLAYER_SCREEN_MARGIN_X: number = 50;
const FRICTION_FACTOR: number = 0.84; // 0.92 for sliding

const main = async () =>
{
    UI.setTryAgainBtnCallback( () => resetLevel() );

    // Create a new application
    const app = new Application();
    await app.init({ background: '#125b6dff', resizeTo: window, backgroundAlpha: 1 });
    document.body.appendChild( app.canvas );

    const staticObjects = new Container({
        isRenderGroup: true,
    });
    const dynamicObjects = new Container({
        isRenderGroup: true,
    });
    app.stage.addChild( dynamicObjects );

    const FOOD_TEXTURES_PATH: string = "./static/textures/food/";
    const FOOD_TEXTURES_EXT: string = ".png";
    const foodTextures = await Assets.load([
        FOOD_TEXTURES_PATH + `Apple` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `AppleWorm` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `Avocado` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `Bacon` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `Beer` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `Boar` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `Bread` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `Brownie` + FOOD_TEXTURES_EXT,

        FOOD_TEXTURES_PATH + `Bug` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `Cheese` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `Cherry` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `Chicken` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `ChickenLeg` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `Cookie` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `DragonFruit` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `Eggplant` + FOOD_TEXTURES_EXT,
    ]);
    console.log( Object.keys( foodTextures ) );

    const HERO_PATH: string = "./static/textures/hero/";
    const HERO_EXT: string = ".png";
    const heroTexture: Texture = await Assets.load( HERO_PATH + `knight iso char_idle_0` + HERO_EXT );

    const foodTexturesKeys: string[] = Object.keys( foodTextures );
    for ( let i = 0; i < 10; i++ )
    {
        const textureSrc: string | undefined = foodTexturesKeys[ i % foodTexturesKeys.length ];
        if ( textureSrc === undefined )
        {
            console.error("Couldnt resolve falling item texture path");
            return;
        }
        const itemTexture: Texture = foodTextures[ textureSrc ];
        const item = new FallingItem( itemTexture );
        fallingItems.push( item );
        dynamicObjects.addChild( item.sprite );

        const gr = new Graphics(); /////////////////////////////////
        gr.circle(0, 0, item.collisionRadius);
        gr.stroke({ color: 0xffff00, width: 4 });
        dynamicObjects.addChild( gr );
        helpers.push( gr );
    }

    player = new Player( heroTexture );
    dynamicObjects.addChild( player.sprite );

    playerGr = new Graphics(); // ///////////////////////////////
    const size = 84 * 2;
    playerGr.rect( -size / 2 / 2, -size / 2, size / 2, size );
    playerGr.stroke({ color: 0xff0000 });
    // dynamicObjects.addChild( playerGr );

    resetLevel();

    app.ticker.add( gameLoop );
}
main();

const gameLoop = ( time: Ticker ): void =>
{
    if ( isRunning === false ) return;

    stats.begin();

    for ( const item of fallingItems )
    {
        item.update( time, SCREEN_MARGIN_X, SCREEN_MARGIN_Y );

        if ( itemPassedThroughFloor( item.sprite.position ) ) // Player failed to catch the item
        {
            playSound( Sounds.lostHealth );
            item.resetFallingPosition( SCREEN_MARGIN_X, SCREEN_MARGIN_Y );
            player.health -= 1;
            UI.updateHealth( player.health );
            if ( player.health <= 0 )
            {
                isRunning = false;
                UI.endGameMenuShow();
            }
        }

        if ( player.collidesWithFallingItem( item ) ) // Player caught the item
        {
            playSound( Sounds.eating );
            player.score += 1;
            UI.updateScore( player.score );
            item.resetFallingPosition( SCREEN_MARGIN_X, SCREEN_MARGIN_Y );
        }
    }
    for ( let i = 0; i < fallingItems.length; i++ )
    {
        helpers[ i ].position.copyFrom( fallingItems[ i ].sprite.position );
    }

    player.update( time, FRICTION_FACTOR, PLAYER_SCREEN_MARGIN_X );
    playerGr.position.copyFrom( player.sprite.position );

    stats.end();
}

const resetLevel = () =>
{
    for ( const item of fallingItems )
    {
        item.resetFallingPosition( SCREEN_MARGIN_X, SCREEN_MARGIN_Y );
    }
    player.reset();

    UI.updateHealth( player.health );
    UI.updateScore( player.score );
    UI.endGameMenuHide();
    isRunning = true;
}

const itemPassedThroughFloor = ( position: Point ): boolean =>
{
    if ( position.y > window.innerHeight )
    {
        return true;
    }
    return false;
}
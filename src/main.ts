// description: This example demonstrates how to use a Container to group and manipulate multiple sprites
import { Application, Assets, Bounds, Container, Graphics, Point, Rectangle, Sprite, Texture, WebGLRenderer } from 'pixi.js';
import { FallingItem } from './entities/FallingItem';
import { Player } from './entities/Player';
import GameStats from 'gamestats.js';

const stats = new GameStats();
document.body.appendChild( stats.dom );

let score = 0;

const positionIsInScreenBounds = ( position: Point ): boolean =>
{
    if ( position.x > window.innerWidth || position.y > window.innerHeight )
    {
        return false;
    }
    return true;
}

const clamp = ( x: number, min: number, max: number ): number =>
{
    if ( x < min ) x = min;
    if ( x > max ) x = max;
    return x;
}

const resetFallingPosition = ( position: Point ): void =>
{
    const MARGIN_X: number = 100;
    const MARGIN_Y: number = 540;
    position.x = MARGIN_X + Math.random() * (window.innerWidth - (MARGIN_X * 2));
    position.y = MARGIN_Y + Math.random() * window.innerHeight * 0.4;
}

// async function main ()
const main = async () =>
{
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
    const helpers: Graphics[] = [];
    
    const HERO_PATH: string = "./static/textures/hero/";
    const HERO_EXT: string = ".png";
    const heroTexture: Texture = await Assets.load( HERO_PATH + `knight iso char_idle_0` + HERO_EXT );

    const foodTexturesKeys: string[] = Object.keys( foodTextures );
    const fallingItems: FallingItem[] = [];
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
        item.sprite.scale.set( 4 );
        fallingItems.push( item );
        dynamicObjects.addChild( item.sprite );
        resetFallingPosition( item.sprite.position );

        const gr = new Graphics(); /////////////////////////////////
        gr.circle(0, 0, item.collisionRadius);
        gr.stroke({ color: 0xffff00, width: 4 });
        dynamicObjects.addChild( gr );
        helpers.push( gr );
    }

    const player: Player = new Player( heroTexture );
    dynamicObjects.addChild( player.sprite );
    player.sprite.position.set( window.innerWidth / 2, window.innerHeight - 150 );

    const playerGr = new Graphics(); // ///////////////////////////////
    const size = 84 * 2;
    playerGr.rect( -size / 2 / 2, -size / 2, size / 2, size );
    playerGr.stroke({ color: 0xff0000 });
    // dynamicObjects.addChild( playerGr );

    console.log( "Health:", player.health );

    app.ticker.add( ( time ) => {

        stats.begin();

        for ( const item of fallingItems )
        {
            item.update( time );
            if ( positionIsInScreenBounds( item.sprite.position ) === false )
            {
                resetFallingPosition( item.sprite.position );
                player.health -= 1;
                console.log( "Health:", player.health );
            }
        }
        for ( let i = 0; i < fallingItems.length; i++ )
        {
            helpers[ i ].position.copyFrom( fallingItems[ i ].sprite.position );
        }

        const FRICTION_FACTOR: number = 0.84; // 0.92 for sliding
        player.update( time, FRICTION_FACTOR );
        const PLAYER_SCREEN_MARGIN_LEFT: number = 50;
        const PLAYER_SCREEN_MARGIN_RIGHT: number = window.innerWidth - PLAYER_SCREEN_MARGIN_LEFT;

        if ( player.sprite.position.x < PLAYER_SCREEN_MARGIN_LEFT ||
            player.sprite.position.x > PLAYER_SCREEN_MARGIN_RIGHT )
        {
            player.velocity.x *= -FRICTION_FACTOR;
            player.sprite.position.x += player.velocity.x * 0.1;
        }
        playerGr.position.copyFrom( player.sprite.position );

        for ( const item of fallingItems )
        {
            if ( player.collidesWithFallingItem( item ) )
            {
                score += 1;
                resetFallingPosition( item.sprite.position );
                console.log( "Colliding with:", item.sprite.uid, "Score:", score );
            }
        }

        stats.end();
    } );
}
main();

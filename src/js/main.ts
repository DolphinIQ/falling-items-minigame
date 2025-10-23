// description: This example demonstrates how to use a Container to group and manipulate multiple sprites
import { Application, Assets, Container, Graphics, Point, Sprite, Texture, Ticker } from 'pixi.js';
import { FallingItem } from './entities/FallingItem';
import { Player } from './entities/Player';
import { playSound, Sounds } from './Sounds';
import { UI } from './UI';
import { Level } from './Level';
import GameStats from 'gamestats.js';

const stats = new GameStats();
document.body.appendChild( stats.dom );

const Levels: Level[] = [];
let currentLevel: Level;
let floor: Graphics;
const fallingItemsPool: FallingItem[] = [];
let player: Player;
let isRunning: boolean = true;

type TextureAssets = {
    foods: Record<string, Texture>,
    hero: Texture
};
const Textures: TextureAssets = {
    foods: {},
    hero: new Texture()
};

const initializeLevels = (): void =>
{
    Levels.push( new Level({
        id: 0,
        itemsScreenBoundsX: 100,
        itemsScreenBoundsY: -300,
        floorHeight: 75,
        floorColor: 0x449238,
        floorFrictionFactor: 0.86,
        gravity: 1,
        activeItemsCount: 15,
        winningScoreCount: 20,
    }) );
    Levels.push( new Level({
        id: 1,
        itemsScreenBoundsX: 100,
        itemsScreenBoundsY: -300,
        floorHeight: 125,
        floorColor: 0x95EAFF,
        floorFrictionFactor: 0.92,
        gravity: 2,
        activeItemsCount: 30,
        winningScoreCount: 30,
    }) );
    Levels.push( new Level({
        id: 2,
        itemsScreenBoundsX: 100,
        itemsScreenBoundsY: -300,
        floorHeight: 400,
        floorColor: 0x6F6F6F,
        floorFrictionFactor: 0.88,
        gravity: 1.2,
        activeItemsCount: 60,
        winningScoreCount: 60,
    }) );
    if ( Levels[ 0 ] === undefined )
    {
        throw Error( "Couldnt initialize the starting level." );
    }
    currentLevel = Levels[ 0 ];
}

const initializeUI = (): void =>
{
    UI.setTryAgainBtnCallback( () => startLevel( 0 ) );
    UI.updateLevel( currentLevel.id );
    UI.endGameMenuHide();
    UI.updateHealth( Player.MAX_HEALTH );
    UI.updateScore( 0, currentLevel.winningScoreCount );
}

const loadTextures = async () =>
{
    const FOOD_TEXTURES_PATH: string = "./static/textures/food/";
    const FOOD_TEXTURES_EXT: string = ".png";
    Textures.foods = await Assets.load([
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

        FOOD_TEXTURES_PATH + `Eggs` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `Fish` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `FishFillet` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `FishSteak` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `Grubs` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `Honey` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `Honeycomb` + FOOD_TEXTURES_EXT,
        FOOD_TEXTURES_PATH + `Jam` + FOOD_TEXTURES_EXT,
    ]);
    console.log( Object.keys( Textures.foods ) );

    const HERO_PATH: string = "./static/textures/hero/";
    const HERO_EXT: string = ".png";
    Textures.hero = await Assets.load( HERO_PATH + `knight iso char_idle_0` + HERO_EXT );
}

const main = async () =>
{
    // Initialization
    initializeLevels();
    initializeUI();
    await loadTextures();

    // Create a new application
    const app = new Application();
    await app.init({ background: '#1e768bff', resizeTo: window, backgroundAlpha: 1 });
    document.body.appendChild( app.canvas );

    const staticObjects = new Container({
        isRenderGroup: true,
    });
    const dynamicObjects = new Container({
        isRenderGroup: true,
    });
    app.stage.addChild( staticObjects, dynamicObjects );

    floor = new Graphics();
    staticObjects.addChild( floor );

    const foodTexturesKeys: string[] = Object.keys( Textures.foods );
    for ( let i = 0; i < Level.MAXIMUM_ITEMS_COUNT; i++ )
    {
        const textureSrc: string | undefined = foodTexturesKeys[ i % foodTexturesKeys.length ];
        if ( textureSrc === undefined ) throw new Error( "Couldnt resolve falling item texture path" );
        const itemTexture: Texture | undefined = Textures.foods[ textureSrc ];
        if ( itemTexture === undefined ) throw new Error( "Couldnt get texture from Textures" );

        const item = new FallingItem( itemTexture );
        item.sprite.cullable = true;
        fallingItemsPool.push( item );
        dynamicObjects.addChild( item.sprite );
    }

    player = new Player( Textures.hero );
    dynamicObjects.addChild( player.sprite );

    startLevel( currentLevel.id );

    app.ticker.add( gameLoop );
}
main();

const gameLoop = ( time: Ticker ): void =>
{
    if ( isRunning === false ) return;

    stats.begin();

    for ( let i = 0; i < currentLevel.activeItemsCount; i++ )
    {
        const item: FallingItem | undefined = fallingItemsPool[ i ];
        if ( !item ) throw new Error(`Couldnt find the item of index (${ i })`);

        item.update( time, currentLevel.gravity, currentLevel.itemsScreenBoundsX, currentLevel.itemsScreenBoundsY );

        if ( itemPassedThroughFloor( item.sprite.position ) ) // Player failed to catch the item
        {
            playSound( Sounds.lostHealth );
            item.resetFallingPosition( currentLevel.itemsScreenBoundsX, currentLevel.itemsScreenBoundsY );
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
            UI.updateScore( player.score, currentLevel.winningScoreCount );
            item.resetFallingPosition( currentLevel.itemsScreenBoundsX, currentLevel.itemsScreenBoundsY );

            if ( player.score >= currentLevel.winningScoreCount )
            {
                const nextLevelIdx = currentLevel.id + 1;
                if ( nextLevelIdx < Levels.length )
                {
                    startLevel( nextLevelIdx ); // Start next level
                }
                else
                {
                    isRunning = false;
                    UI.endGameMenuShow( "YOU WON!" ); // Show winning screen
                }
            }
        }
    }

    player.update( time, currentLevel.floorFrictionFactor, currentLevel.playerScreenBoundsX );

    stats.end();
}

const startLevel = ( levelId: number ) =>
{
    if ( Levels[ levelId ] === undefined )
    {
        throw Error( `Couldnt reset to the specified (${ levelId }) level` );
    }
    currentLevel = Levels[ levelId ];

    for ( const item of fallingItemsPool )
    {
        item.resetFallingPosition( currentLevel.itemsScreenBoundsX, currentLevel.itemsScreenBoundsY );
    }
    player.reset( currentLevel.floorHeight );

    floor.clear();
    floor.rect( 0, window.innerHeight - currentLevel.floorHeight, 4096, currentLevel.floorHeight );
    floor.fill( currentLevel.floorColor );

    UI.updateLevel( currentLevel.id );
    UI.updateHealth( player.health );
    UI.updateScore( player.score, currentLevel.winningScoreCount );
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
// description: This example demonstrates how to use a Container to group and manipulate multiple sprites
import { Texture } from 'pixi.js';
import { UI } from './UI';
import { Game } from './Game';

// Initialization
import { initTextures, type TextureAssets } from './initialization/initTextures';
import { initLevels } from './initialization/initLevels';

let textures: TextureAssets = {
    foods: {},
    hero: new Texture()
};

const main = async () =>
{
    // Initialization
    textures = await initTextures();
    const game = new Game( textures );
    const levels = initLevels( game );
    game.setLevels( levels );
    UI.init( () => game.start() );

    await game.initRenderer();
    game.start();
}
main();

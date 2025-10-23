import { Assets, Texture } from "pixi.js";

type TextureAssets = {
    foods: Record<string, Texture>,
    hero: Texture
};

const initTextures = async (): Promise<TextureAssets> =>
{
    const FOOD_TEXTURES_PATH: string = "./static/textures/food/";
    const FOOD_TEXTURES_EXT: string = ".png";

    const Textures: TextureAssets = {
        foods: {},
        hero: new Texture()
    };
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

    const HERO_PATH: string = "./static/textures/hero/";
    const HERO_EXT: string = ".png";
    Textures.hero = await Assets.load( HERO_PATH + `knight iso char_idle_0` + HERO_EXT );

    return Textures;
}

export { initTextures, type TextureAssets };
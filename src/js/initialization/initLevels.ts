import type { Game } from "../Game";
import { Level } from "../Level";

const initLevels = ( game: Game ): Level[] =>
{
    const levels = [];
    levels.push( new Level( game, {
        id: 0,
        itemsScreenBoundsX: 100,
        itemsScreenBoundsY: -600,
        floorHeight: 75,
        floorColor: 0x449238,
        floorFrictionFactor: 0.86,
        gravity: 2,
        activeItemsCount: 10,
        winningScoreCount: 20,
    }) );
    levels.push( new Level( game, {
        id: 1,
        itemsScreenBoundsX: 100,
        itemsScreenBoundsY: -600,
        floorHeight: 125,
        floorColor: 0x95EAFF,
        floorFrictionFactor: 0.92,
        gravity: 3,
        activeItemsCount: 20,
        winningScoreCount: 30,
    }) );
    levels.push( new Level( game, {
        id: 2,
        itemsScreenBoundsX: 100,
        itemsScreenBoundsY: -600,
        floorHeight: 400,
        floorColor: 0x6F6F6F,
        floorFrictionFactor: 0.88,
        gravity: 0,
        activeItemsCount: 80,
        winningScoreCount: 60,
    }) );
    return levels;
}

export { initLevels };
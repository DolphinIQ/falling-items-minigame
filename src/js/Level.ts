
type LevelOptions = {
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

class Level
{
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

    constructor( options: LevelOptions )
    {
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
    }

    static MAXIMUM_ITEMS_COUNT: number = 100;
}

export { Level };
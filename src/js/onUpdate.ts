import type { Ticker } from "pixi.js";

export interface OnUpdate
{
    onUpdate ( ticker: Ticker ): void;
}

import { Player } from "./entities/Player";

class UIClass
{
    endScreenDiv: Element;
    endScreenMessageDiv: Element
    tryAgainBtn: Element;
    healthInfo: Element;
    scoreInfo: Element;
    levelDiv: Element;

    constructor()
    {
        const endScreenDiv = document.querySelector( ".end-screen" );
        const endScreenMessageDiv = document.querySelector( ".message" );
        const tryAgainBtn = document.querySelector( ".try-again-btn" );
        const healthInfo = document.querySelector( ".health" );
        const scoreInfo = document.querySelector( ".score" );
        const levelDiv = document.querySelector( ".level" );

        if (
            endScreenMessageDiv === null ||
            endScreenDiv === null ||
            tryAgainBtn === null ||
            healthInfo === null ||
            levelDiv === null ||
            scoreInfo === null
        ) {
            throw console.error( "UI Elements are invalid!" );
        }

        this.endScreenDiv = endScreenDiv;
        this.endScreenMessageDiv = endScreenMessageDiv;
        this.tryAgainBtn = tryAgainBtn;
        this.healthInfo = healthInfo;
        this.scoreInfo = scoreInfo;
        this.levelDiv = levelDiv;
    }

    init( btnCb: Function ): void
    {
        this.setTryAgainBtnCallback( btnCb );
        this.endGameMenuHide();
        this.updateHealth( Player.MAX_HEALTH );
    }

    endGameMenuShow( titleScreen?: string ): void
    {
        this.endScreenDiv.classList.remove( "hidden" );
        if ( titleScreen )
        {
            this.endScreenMessageDiv.textContent = titleScreen;
        }
        else
        {
            this.endScreenMessageDiv.textContent = "Game Over";
        }
    }
    endGameMenuHide(): void
    {
        this.endScreenDiv.classList.add( "hidden" );
    }
    setTryAgainBtnCallback( cb: Function ): void
    {
        this.tryAgainBtn.addEventListener( "click", () => {
            cb();
        }, false );
    }
    updateHealth( value: number ): void
    {
        this.healthInfo.textContent = `Lives: ${ value }`;
    }
    updateScore( value: number, maximumScore: number ): void
    {
        this.scoreInfo.textContent = `Score: ${ value }/${ maximumScore }`;
    }
    updateLevel( levelId: number ): void
    {
        this.levelDiv.textContent = `Level ${ levelId + 1 }`;
    }
}

const UI: UIClass = new UIClass();
export { UI };
const endScreenDiv: HTMLElement | null = document.querySelector( ".end-screen" );
const endScreenMessageDiv: HTMLElement | null = document.querySelector( ".message" );
const tryAgainBtn: HTMLElement | null = document.querySelector( ".try-again-btn" );
const healthInfo: HTMLElement | null = document.querySelector( ".health" );
const scoreInfo: HTMLElement | null = document.querySelector( ".score" );
const levelDiv: HTMLElement | null = document.querySelector( ".level" );

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

const UI = {
    endGameMenuShow: ( titleScreen?: string ): void =>
    {
        endScreenDiv.classList.remove( "hidden" );
        if ( titleScreen )
        {
            endScreenMessageDiv.textContent = titleScreen;
        }
        else
        {
            endScreenMessageDiv.textContent = "Game Over";
        }
    },
    endGameMenuHide: (): void =>
    {
        endScreenDiv.classList.add( "hidden" );
    },
    setTryAgainBtnCallback: ( cb: Function ): void =>
    {
        tryAgainBtn.addEventListener( "click", () => {
            cb();
        }, false );
    },
    updateHealth: ( value: number ): void =>
    {
        healthInfo.textContent = `Lives: ${ value }`;
    },
    updateScore: ( value: number, maximumScore: number ): void =>
    {
        scoreInfo.textContent = `Score: ${ value }/${ maximumScore }`;
    },
    updateLevel: ( levelId: number ): void =>
    {
        levelDiv.textContent = `Level ${ levelId }`;
    }
};

export { UI };
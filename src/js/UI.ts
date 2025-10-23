const endScreenDiv: HTMLElement | null = document.querySelector( ".end-screen" );
const tryAgainBtn: HTMLElement | null = document.querySelector( ".try-again-btn" );
const healthInfo: HTMLElement | null = document.querySelector( ".health" );
const scoreInfo: HTMLElement | null = document.querySelector( ".score" );

if (
    endScreenDiv === null ||
    tryAgainBtn === null ||
    healthInfo === null ||
    scoreInfo === null
) {
    throw console.error( "UI Elements are invalid!" );
}

const UI = {
    endGameMenuShow: () =>
    {
        endScreenDiv.classList.remove( "hidden" );
    },
    endGameMenuHide: () =>
    {
        endScreenDiv.classList.add( "hidden" );
    },
    setTryAgainBtnCallback: ( cb: Function ) =>
    {
        tryAgainBtn.addEventListener( "click", () => {
            cb();
        }, false );
    },
    updateHealth: ( value: number ) =>
    {
        healthInfo.textContent = `Lives: ${ value }`;
    },
    updateScore: ( value: number ) =>
    {
        scoreInfo.textContent = `Score: ${ value }`;
    },
};

export { UI };
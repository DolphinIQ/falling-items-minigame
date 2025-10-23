
const AUDIO_PATH: string = "static/sounds/";
const Sounds = {
    click: new Audio( AUDIO_PATH + "click.ogg" ),
    eating: new Audio( AUDIO_PATH + "eating.ogg" ),
    lostHealth: new Audio( AUDIO_PATH + "lost_health.ogg" ),
};
Sounds.lostHealth.volume = 0.4;

const playSound = ( sound: HTMLAudioElement ) =>
{
    sound.currentTime = 0; // Resets the sound before playing, making multiple playbacks smoother
    // sound.play(); hgfghfgfhfghfghfghfgh
}

export { Sounds, playSound };
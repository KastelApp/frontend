const soundEffects = {
    mention: "mention.wav"
};

const playSound = (sound: keyof typeof soundEffects, volume = 1) => {
    const audio = new Audio(`/sounds/${soundEffects[sound]}`);
    
    audio.volume = volume;

    audio.play();
}

export default playSound;

export {
    playSound,
    soundEffects
}
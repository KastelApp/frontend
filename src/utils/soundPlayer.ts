const soundEffects = {
	mention: "/sounds/mention.wav",
};

const playSound = (sound: keyof typeof soundEffects, volume = 1) => {
	const audio = new Audio(soundEffects[sound]);

	audio.volume = volume;

	audio.play();
};

export default playSound;

export { playSound, soundEffects };

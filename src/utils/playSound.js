import msgIncomingSound from "../assets/audio/notify.wav";
export const playMessageIncomingSound = () => {
    const audio = new Audio(msgIncomingSound);
    audio.play();
}
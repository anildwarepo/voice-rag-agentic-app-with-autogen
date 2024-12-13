export class Player {
    private playbackNode: AudioWorkletNode | null = null;

    async init(sampleRate: number) {
        try 
        {
            const audioContext = new AudioContext({ sampleRate });
            await audioContext.audioWorklet.addModule("audio-playback-worklet.js");

            this.playbackNode = new AudioWorkletNode(audioContext, "audio-playback-worklet");
            this.playbackNode.connect(audioContext.destination);
        } catch (error) {
            console.error("Failed to initialize player", error);
        }
    }

    play(buffer: Int16Array) {
        if (this.playbackNode) {
            this.playbackNode.port.postMessage(buffer);
        }
    }

    stop() {
        if (this.playbackNode) {
            this.playbackNode.port.postMessage(null);
        }
    }
}

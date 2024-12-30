
const audioContext = new (window.AudioContext || window.webkitAudioContext)();


export function soundWindBlow() {
    const bufferSize = audioContext.sampleRate * 2; // 2 seconds buffer
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Fill the buffer with white noise
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000; // Adjust frequency to get the desired sloshing effect

    const lfo = audioContext.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.5; // Low frequency for modulation

    const lfoGain = audioContext.createGain();
    lfoGain.gain.value = 500; // Modulation depth

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(audioContext.destination);

    noise.start();
    lfo.start();
    noise.stop(audioContext.currentTime + 2); // Play for 2 seconds
    lfo.stop(audioContext.currentTime + 2); // Stop LFO after 2 seconds
}

export function soundWhirlpool() {
    const bufferSize = audioContext.sampleRate * 2; // 2 seconds buffer
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Fill the buffer with white noise
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 500; // Adjust frequency to get the desired whirlpool effect

    const lfo = audioContext.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 1; // Low frequency for modulation

    const lfoGain = audioContext.createGain();
    lfoGain.gain.value = 300; // Modulation depth

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(audioContext.destination);

    noise.start();
    lfo.start();
    noise.stop(audioContext.currentTime + 2); // Play for 2 seconds
    lfo.stop(audioContext.currentTime + 2); // Stop LFO after 2 seconds
}
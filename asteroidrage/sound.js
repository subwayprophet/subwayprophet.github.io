
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

 export function soundLaser() {
     const oscillator = audioContext.createOscillator();
     oscillator.type = 'sine'; // You can use other waveform types like 'sawtooth', 'square', 'triangle'

     const initialFrequency = 880; // Starting frequency in Hz (A4 note)
     const targetFrequency = 440; // Target frequency in Hz (A5 note)

     const slideDuration = 0.15; // Slide duration in seconds
     const startTime = audioContext.currentTime;

     oscillator.frequency.setValueAtTime(initialFrequency, startTime);

     oscillator.connect(audioContext.destination);
     oscillator.start();

// Apply sliding effect
     oscillator.frequency.linearRampToValueAtTime(targetFrequency, startTime + slideDuration);

// Stop the oscillator after the slide is complete
     oscillator.stop(startTime + slideDuration + 0.1); // Add a small additional time for a smooth stop
}

export function soundBling() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain(); // Create a gain node for volume control
    oscillator.type = 'square'; // You can use other waveform types like 'sawtooth', 'square', 'triangle'

    const initialFrequency = 80; // Starting frequency in Hz (A4 note)
    const targetFrequency = 120; // Target frequency in Hz (A5 note)

    const slideDuration = 0.5; // Slide duration in seconds
    const startTime = audioContext.currentTime;

    oscillator.frequency.setValueAtTime(initialFrequency, startTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.frequency.linearRampToValueAtTime(targetFrequency, startTime + slideDuration);

// Stop the oscillator after the slide is complete
    oscillator.stop(startTime + slideDuration + 0.1); // Add a small additional time for a smooth stop
}

export function soundExplosion(pitch=30) {
    const oscillator = audioContext.createOscillator();

// Configure the oscillator
    oscillator.type = 'sine'; // You can use other waveform types like 'sawtooth', 'square', 'triangle'
    oscillator.frequency.setValueAtTime(pitch, audioContext.currentTime); // Frequency in Hz (A4 note)
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.4); // Stop after 0.1 seconds
}

export function beep(hz,volume=0.5) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain(); // Create a gain node for volume control
    oscillator.type = 'sine'; // You can use other waveform types like 'sawtooth', 'square', 'triangle'

    oscillator.frequency.setValueAtTime(hz, audioContext.currentTime); // Frequency in Hz (A4 note)
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

    gainNode.connect(audioContext.destination);
    oscillator.connect(gainNode);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2); // Stop after 0.1 seconds
}
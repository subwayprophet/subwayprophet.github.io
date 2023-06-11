class Sound {
    play(trackName) {
        let conductor = new BandJS();
        let player = conductor.load(tracks[trackName])
        player.looping = true;
        player.play();
        return player;
    }
    playZ() {
        let conductor = new BandJS();
        conductor.setTimeSignature(4,4);
        conductor.setTempo(120);
        let piano = conductor.createInstrument();
        piano.note('quarter','G3');
        piano.note('quarter','G4');
        piano.note('quarter','F4');
        piano.note('quarter','F4');
        piano.note('quarter','G3');
        piano.note('quarter','F4');
        piano.note('quarter','E4');
        let player = conductor.finish();
        player.looping = true;
        player.play();
    }
}
let tracks = {
    track1: {
        timeSignature: [9, 8],
        tempo: 100,
        instruments: {
            melody: {
                name: 'square',
                pack: 'oscillators'
            },
            harmony: {
                name: 'sawtooth',
                pack: 'oscillators'
            }
        },
        notes: {
            // Shorthand notation
            melody: [
                //bar 1
                'eighth|C4,E3',
                'eighth|B3,E3',
                'eighth|A3,E3',
                'eighth|D4,E3',
                'eighth|C4,E3',
                'eighth|B3,E3',
                'eighth|E4,E3',
                'eighth|F4,E3',
                'eighth|E4,E3',
                //bar 2
                'eighth|F4',
                'eighth|G4',
                'eighth|E4',
                'eighth|F4',
                'eighth|G4',
                'eighth|E4',
                'eighth|F4',
                'eighth|D4',
                'eighth|B4',
                //bar 3
                'eighth|C6',
                'eighth|A5',
                'eighth|E5',
                'eighth|C6',
                'eighth|A5',
                'eighth|E5',
                'eighth|C6',
                'eighth|A5',
                'eighth|E5',
                //bar 4
                'eighth|B5',
                'eighth|G#5',
                'eighth|E5',
                'eighth|B5',
                'eighth|G#5',
                'eighth|E5',
                'eighth|B5',
                'eighth|G#5',
                'eighth|E5',
                //bar 5
                'sixteenth|E5',
                'sixteenth|F5',
                'eighth|E5',
                'eighth|E5',
                'sixteenth|E5',
                'sixteenth|F5',
                'eighth|E5',
                'eighth|E5',
                'sixteenth|E5',
                'sixteenth|F5',
                'eighth|E5',
                'eighth|E5',
                //bar 6
                'eighth|G#5',
                'eighth|G#5',
                'eighth|A5',
                'eighth|G#5',
                'eighth|G#5',
                'eighth|A5',
                'eighth|G#5',
                'eighth|G#5',
                'eighth|A5',
            ],
            // More verbose notation
            harmony: [
                //bar 1
                'eighth|A2',
                'eighth|A2',
                'eighth|C3',
                'eighth|A2',
                'eighth|C3',
                'eighth|D3',
                'eighth|E3',
                'eighth|G3',
                'eighth|G3',
                //bar 2
                'eighth|E2,B3',
                'eighth|E2,B3,F#3',
                'eighth|E2,B3,G#3',
                'eighth|E2,B3',
                'eighth|E2,B3,F#3',
                'eighth|E2,B3,G#3',
                'eighth|E2,B3',
                'eighth|E2,B3,F#3',
                'eighth|E2,B3,G#3',
                //bar 3
                'eighth|A2,E2',
                'eighth|A2,E2',
                'eighth|C3,E2',
                'eighth|A2,E2',
                'eighth|C3,E2',
                'eighth|D3,F3',
                'eighth|E3,G3',
                'eighth|G3,B3',
                'eighth|G3,B3',
                //bar 4 (repeat of bar 2)
                'eighth|E2,B3',
                'eighth|E2,B3,F#3',
                'eighth|E2,B3,G#3',
                'eighth|E2,B3',
                'eighth|E2,B3,F#3',
                'eighth|E2,B3,G#3',
                'eighth|E2,B3',
                'eighth|E2,B3,F#3',
                'eighth|E2,B3,G#3',
                //bar 5 (repeat of bar 3)
                'eighth|A2,E2',
                'eighth|A2,E2',
                'eighth|C3,E2',
                'eighth|A2,E2',
                'eighth|C3,E2',
                'eighth|D3,F3',
                'eighth|E3,G3',
                'eighth|G3,B3',
                'eighth|G3,B3',
                //bar 6 (repeat of bar 2)
                'eighth|E2,B3',
                'eighth|E2,B3,F#3',
                'eighth|E2,B3,G#3',
                'eighth|E2,B3',
                'eighth|E2,B3,F#3',
                'eighth|E2,B3,G#3',
                'eighth|E2,B3',
                'eighth|E2,B3,F#3',
                'eighth|E2,B3,G#3',

            ]
        }
    },
    track2: {
        timeSignature: [4, 4],
        tempo: 80,
        instruments: {
            melody: {
                name: 'square',
                pack: 'oscillators'
            },
            harmony: {
                name: 'sawtooth',
                pack: 'oscillators'
            }
        },
        notes: {
            // Shorthand notation
            melody: [
                //bar 1
                'quarter|E4',
                'quarter|D4',
                'quarter|C4',
                'quarter|G3',
                //bar 2
                'quarter|F4',
                'quarter|E4',
                'quarter|D4',
                'quarter|G3',
                //bar 3
                'quarter|G4',
                'eighth|A4',
                'eighth|G4',
                'eighth|F4',
                'eighth|E4',
                'sixteenth|D4',
                'sixteenth|E4',
                'eighth|C4',
                //bar 4
                'sixteenth|D4',
                'sixteenth|rest',
                'sixteenth|G3',
                'sixteenth|G3',
                'eighth|G3',
                'eighth|G3',
                'half|G3'
            ],
            harmony: [
                //bar 1
                'quarter|C3',
                'quarter|D3',
                'quarter|E3',
                'quarter|G3',
                //bar 2
                'quarter|G2',
                'quarter|A2',
                'eighth|B2',
                'eighth|G2',
                'eighth|A2',
                'eighth|B2',
                //bar 3
                'quarter|C3,E2',
                'quarter|D2,F2',
                'quarter|E2,G2',
                'quarter|C3,E2',
                //bar 4
                'sixteenth|G2',
                'sixteenth|F#2',
                'sixteenth|G2',
                'sixteenth|A2',
                'sixteenth|B2',
                'sixteenth|A2',
                'sixteenth|B2',
                'sixteenth|C2',
                'sixteenth|B2',
                'sixteenth|G2',
                'sixteenth|D2',
                'eighth|G2',
                'eighth|G2',
                'eighth|G2'
            ]
        }
    }
}

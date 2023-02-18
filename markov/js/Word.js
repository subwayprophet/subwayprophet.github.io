export function Word(wordString, nextWordHopMap) {
    this.stringVal = wordString;
    this.hopMap = nextWordHopMap;
    
    this.temperature;

    this.getNext = function() {
        let w = this;
        let nextWord;
        let nextWords = w.hopMap[w.stringVal];
        // console.log('nextWords for' + w.stringVal + ':', nextWords);

        // console.log('stringVal: ' + w.stringVal)
        if(!nextWords) return 'NO NEXT WORDS';

        let nextWordStrings = Object.keys(nextWords);
        let nextWordCounts = Object.values(nextWords);
        let nextWordCount = nextWordCounts.reduce((accumulator,currVal) => accumulator + currVal);
        let denominator = nextWordCount;

        /*
        //find most likely next word
        let nextWordsArray = [];
        for(let word in nextWords) { //optimization: sort this once for each word at end of training, duh
            nextWordsArray.push({ word: word, count: nextWords[word] });
        }
        nextWordsArray.sort((a,b) => { return b.count - a.count });

        //add a smattering of randomness
        let index = 0;
        let indexOptions = nextWordsArray.length-1;
        let temperature = 0.8;
        if(Math.random() > 0.5) index = Math.round(indexOptions * temperature);
        return nextWordsArray[index].word;
        */

        
        //randomly pick next word w/probability determined by frequency
        for(let i=0; i<nextWordCount; i++) {
            let candidate = nextWordStrings[i];
            denominator = nextWordCount - i; //reduce the denominator as we count down -- once a candidate is rejected, it should not be counted as an option
            if(use(candidate,w.temperature)) {
                nextWord = candidate;
                break;
            }
        }
        

        function use(candidate,temperature) {
            // console.log('candidate: ' + candidate)
            let candidateCount = nextWords[candidate];
            //console.log('candidateCount: ' + candidateCount);
            //console.log('nextWordCount: ' + nextWordCount);
            let candidateProbability = candidateCount/denominator;
            // console.log('candidateProbability: ' + candidateProbability);
            let random = Math.random() * temperature;
            //console.log('random: ' + random);
            return random < candidateProbability;
        }
        if(!nextWord) {
            console.log('no next word found for ' + w.stringVal)
            nextWord = nextWordStrings[0];
        }
        //if(!nextWord) nextWord = 'NONE';
        return nextWord;
    }
}
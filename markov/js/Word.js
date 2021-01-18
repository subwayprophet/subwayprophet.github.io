export function Word(wordString, nextWordHopMap) {
    this.stringVal = wordString;
    this.hopMap = nextWordHopMap;

    this.getNext = function() {
        let w = this;
        let nextWord;
        let nextWords = w.hopMap[w.stringVal];
        console.log('stringVal: ' + w.stringVal)
        if(!nextWords) return 'NO NEXT WORDS';

        let nextWordStrings = Object.keys(nextWords);
        let nextWordCounts = Object.values(nextWords);
        let nextWordCount = nextWordCounts.reduce((accumulator,currVal) => accumulator + currVal);
        let denominator = nextWordCount;
        for(let i=0; i<nextWordCount; i++) {
            let candidate = nextWordStrings[i];
            denominator = nextWordCount - i; //reduce the denominator as we count down -- once a candidate is rejected, it should not be counted as an option
            if(use(candidate)) {
                nextWord = candidate;
                break;
            }
        }

        function use(candidate) {
            //console.log('candidate: ' + candidate)
            let candidateCount = nextWords[candidate];
            //console.log('candidateCount: ' + candidateCount);
            //console.log('nextWordCount: ' + nextWordCount);
            let candidateProbability = candidateCount/denominator;
            //console.log('candidateProbability: ' + candidateProbability);
            let random = Math.random();
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
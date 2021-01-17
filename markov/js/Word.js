export function Word(wordString, nextWordHopMap) {
    this.stringVal = wordString;
    this.hopMap = nextWordHopMap;

    this.getNext = function() {
        let w = this;
        let nextWord;
        let nextWords = w.hopMap[w.stringVal];
        let nextWordStrings = Object.keys(nextWords);
        let nextWordCounts = Object.values(nextWords);
        let nextWordCount = nextWordCounts.reduce((accumulator,currVal) => accumulator + currVal);
        for(let i=0; i<nextWordCount; i++) {
            let candidate = nextWordStrings[i];
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
            let candidateProbability = candidateCount/nextWordCount;
            //console.log('candidateProbability: ' + candidateProbability);
            let random = Math.random();
            //console.log('random: ' + random);
            return random < candidateProbability;
        }
        if(!nextWord) nextWord = nextWordStrings[0];
        return nextWord;
    }
}
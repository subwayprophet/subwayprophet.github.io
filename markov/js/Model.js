import {Word} from './Word.js';
import {test} from './helpers.js';

var hopMapStatic = {
    chicken: {
        wing: 2,
        sandwich: 1
    },
    egg: {
        salad: 1,
        sandwich: 2,
        nog: 3
    }
}

function Model(trainingText) {
    this.trainingText = trainingText;
    this.hopMap = {};
    this.temperature = 0.2; //default
    let trainingWords = trainingText.split(' ');
    this.train = function() {
        let m = this;
        for(let i=0; i<trainingWords.length; i++) {
            let word = trainingWords[i];
            if(!m.hopMap[word]) m.hopMap[word] = {};
            let nextWord = trainingWords[i+1];
            if(!m.hopMap[word][nextWord]) m.hopMap[word][nextWord] = 0;
            m.hopMap[word][nextWord]++;
        }
    }
    this.output;
    this.generate = function() {
        let m = this;
        let output = '';
        let words = Object.keys(m.hopMap);
        words = shuffle(words);
        
        let done = false;
        let wordString = words[0];
        let count = 0;
        output += wordString.capitalizeFirstLetter() + ' ';
        while(!done) {
            let word = new Word(wordString, m.hopMap);
            word.temperature = m.temperature;
            let nextWordString = word.getNext();
            output += nextWordString + ' ';
            wordString = nextWordString;
            if((words.length - count) === 1) {
                done = true;
            } else {
                count++;
            }
        }
//        for(let i=0; i<words.length; i++) {
//            let wordString = words[i];
//            let showString = wordString;
//            //if(i===0) showString = showString.capitalizeFirstLetter();
//            output += showString + ' ';
//            let word = new Word(wordString,m.hopMap);
//            output += word.getNext() + ' ';
 //       }
        this.output = output;

        function shuffle() {
            let array = words;
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
              // Pick a remaining element...
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex -= 1;
              // And swap it with the current element.
              temporaryValue = array[currentIndex];
              array[currentIndex] = array[randomIndex];
              array[randomIndex] = temporaryValue;
            }
            return array;          
        }
    }
} 

export {Model, hopMapStatic}
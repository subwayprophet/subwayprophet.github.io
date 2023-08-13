const vowels = ['a', 'e', 'i', 'o', 'u']
const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l','m','n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];

export function generateName(length) {
    let currName = '';
    let currLength = 0;
    while(currLength < length) {
        let letter;
        let lastLetter = currName[currName.length - 1]?.toLowerCase();
        if(vowels.includes(lastLetter)) { {
            letter = pickRandomConsonant();}
        } else {
            letter = pickRandomVowel();
        }
        if(currLength === 0) {
            letter = letter.toUpperCase();
        }
        currName += letter;
        currLength++;
    }
    return currName;
}
function pickRandomVowel() {
    return vowels[Math.floor(Math.random() * vowels.length)];
}
function pickRandomConsonant() {
    return consonants[Math.floor(Math.random() * consonants.length)];
}
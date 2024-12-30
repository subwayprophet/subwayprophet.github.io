const greekNameParts = ['Arist','Apol','Achill','Ody','Ai','Athen','Herm','Hipp','Herc','Perseph','Zeus','Dionys','Hera','Hades','Hermes','Ares','Artemis','Aphro','Demet','Hephaest','Hest'];
const greekNameEndings = ['es','a','es','ys','a','a','es','es','ules','a'];

export function generateName() {
    let name = greekNameParts[Math.floor(Math.random() * greekNameParts.length)] + greekNameEndings[Math.floor(Math.random() * greekNameEndings.length)];
    return name;
}



const vowels = ['α', 'ε', 'η', 'ι', 'ο', 'υ', 'ω']
const consonants = ['β', 'γ', 'δ', 'ζ', 'θ', 'κ', 'λ', 'μ', 'ν', 'ξ', 'π', 'ρ', 'σ', 'τ', 'φ', 'χ', 'ψ'];

export function generateNameBORING(length) {
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
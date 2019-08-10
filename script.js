const getRndInteger = (min, max) => {   // to get a random number
  return Math.floor(Math.random() * (max - min + 1) ) + min;
};

const addKeys = () => {   // only to add keys to the keyboard
  let j = 65;
  for (let i = 1; i <= 26; i++) {
    let k = String.fromCharCode(j);
    document.querySelector('.keyboard').insertAdjacentHTML('beforeend', `<div class="key-${k}" onclick="check('${k}')">${k}</div>`);
    j++;
  }
};

let theWord = [], wrongCounter = 0, correctCounter = 0, keyUsed = [0], letters = getRndInteger(3, 5);
let mouthStyle = document.querySelector('.mouth').style;    // to change the mouth expression with each mistake
const eyeBallStyle = [document.querySelector('.eye-ball-1').style, document.querySelector('.eye-ball-2').style];  // to direct the eyeballs to the status of the hanger

const renderLoading = load => {   // to display or hide the loader when the data is being fetched
  if (load) {
    document.querySelector('.loading').style.display = 'block';
    document.querySelector('.hangman-itself').style.display = 'none';
    document.querySelector('.word-area').style.display = 'none';
    document.querySelector('.keyboard').style.display = 'none';
  }
  else {
    document.querySelector('.hangman-itself').style.display = 'block';
    document.querySelector('.word-area').style.display = 'flex';
    document.querySelector('.keyboard').style.display = 'flex';
    document.querySelector('.loading').style.display = 'none';
  } 
};

async function getWord() {
  renderLoading(true);

  const fullWordsList = await fetch('words.json')  // getting the data from locally stored file with all the words
  .then(res => res.json())
  .catch(err => console.log('Error: ' + err + '. Server load failed.'));

  renderLoading(false);

  for (let i = 0; i < fullWordsList.length; i++) {
    if (fullWordsList[i].length === letters) {  // storing all 3 to 5 letter words to another array. This number can be changed later if we want to have more options
      theWord[theWord.length] = fullWordsList[i];
    }
  }

  theWord = theWord[getRndInteger(0, theWord.length - 1)];    // choosing random element ("word")

  console.log('The Word is: ' + theWord);   // for the devs to test
  theWord = theWord.toUpperCase();    // because all the alphabets on user's keyboard are uppercase, we have to do this to compare them with the letters from the word
  theWord = theWord.split('');    // to convert the word into an array so that we can compare individual element of the array with the alphabet pressed

  // adding the dashes for the .word-area
  for (let i = 0; i < theWord.length; i++) document.querySelector('.word').insertAdjacentHTML('beforeend', `<span class="l-${i}">_ </span>`);
};

const gameOver = (winOrLose) => {   // this function is used to display after-game things like YOU WIN or YOU LOSE stuff
  if (winOrLose === 'win') {
    document.querySelector('.hangman-itself').style.display = 'none';
    document.querySelector('.word-area').style.display = 'none';
    document.querySelector('.keyboard').style.display = 'none';
    document.querySelector('.you-win').style.display = 'block';
    document.querySelector('.you-win .the-word').innerHTML = theWord.join('');
  } else {
    for (let i = 1; i <= 2; i++) {
      document.querySelector('.eyes:nth-child(' + i + ')').innerHTML = 'X';
      document.querySelector('.eyes:nth-child(' + i + ')').style.border = 'none';
    }
    mouthStyle.borderTop = '2px solid #e7e4e4';
    mouthStyle.borderBottom = 'none';
    mouthStyle.borderLeft = 'none';
    mouthStyle.borderRight = 'none';
    mouthStyle.width = '25px';
    document.querySelector('.man').style.transform = 'translateY(-70px)';
    document.querySelector('.word-area').style.display = 'none';
    document.querySelector('.keyboard').style.display = 'none';
    document.querySelector('.you-lose').style.display = 'block';
    document.querySelector('.you-lose .the-word').innerHTML = theWord.join('');
  }
};

const correct = (key, index) => {
  for (let i = 0; i < index.length; i++) {
    if (index[i] || index[i] === 0) {
      document.querySelector('.l-' + index[i]).innerHTML = key;   // replacing the _ with the letter pressed by changing the innerHTML of the span
      correctCounter++;
    }
  }
  if (correctCounter === letters) gameOver('win');   // length is the length of the word. If all letters are guessed, games is won
};

const wrong = () => {
  mouthStyle.width = '12px';
  mouthStyle.height = '15px';
  mouthStyle.bottom = '3px';
  mouthStyle.borderRadius = '5px';
  mouthStyle.border = '2px solid #e7e4e4';
  wrongCounter++;

  if (wrongCounter === 8) gameOver('lose');   // 8 mistakes are allowed. After that, you lose
  else if (wrongCounter === 1) {    // this and the following conditions are added to to change the position of eyeballs as mentioned above. Also, with each mistake new bar is added to the hanger
    eyeBallStyle[0].top = '11px';
    eyeBallStyle[0].left = '2px';
    document.querySelector('.hanger-stand').style.display = 'block';
    eyeBallStyle[1].top = '11px';
    eyeBallStyle[1].left = '2px';
  } else if (wrongCounter === 2) {
    eyeBallStyle[0].top = '8px';
    eyeBallStyle[0].left = '1px';
    document.querySelector('.hanger-bar:nth-child(2)').style.display = 'block';
    eyeBallStyle[1].top = '8px';
    eyeBallStyle[1].left = '1px';
  } else if (wrongCounter === 3) {
    eyeBallStyle[0].top = '5px';
    eyeBallStyle[0].left = '1px';
    document.querySelector('.hanger-bar:nth-child(3)').style.display = 'block';
    eyeBallStyle[1].top = '5px';
    eyeBallStyle[1].left = '1px';
  } else if (wrongCounter === 4) {
    eyeBallStyle[0].top = '2px';
    eyeBallStyle[0].left = '1px';
    document.querySelector('.hanger-bar:nth-child(4)').style.display = 'block';
    document.querySelector('.hanger-bar:nth-child(5)').style.display = 'block';
    eyeBallStyle[1].top = '2px';
    eyeBallStyle[1].left = '1px';
  } else if (wrongCounter === 5) {
    eyeBallStyle[0].top = '1px';
    eyeBallStyle[0].left = '2.5px';
    document.querySelector('.hanger-bar:nth-child(6)').style.display = 'block';
    eyeBallStyle[1].top = '1px';
    eyeBallStyle[1].left = '2.5px';
  } else if (wrongCounter === 6) {
    eyeBallStyle[0].top = '0px';
    eyeBallStyle[0].left = '4px';
    document.querySelector('.hanger-bar:nth-child(7)').style.display = 'block';
    eyeBallStyle[1].top = '0px';
    eyeBallStyle[1].left = '4px';
  } else if (wrongCounter === 7) {
    eyeBallStyle[0].top = '0px';
    eyeBallStyle[0].left = '4px';
    document.querySelector('.hanger-rope').style.display = 'block';
    document.querySelector('.hanger-knot').style.display = 'block';
    eyeBallStyle[1].top = '0px';
    eyeBallStyle[1].left = '4px';
  }
};

function check(key) {
  let correctAnswer = 0, index = [], goodToGo = true;
  key = key.toUpperCase();
  for (let i = 0; i < keyUsed.length; i++) {   // to see if the key hasnt already been pressed
    if (keyUsed[i] === key) goodToGo = false;   // this variable is used to tell if we can add the mistakes (8 total) and the letters (5 total for current setting) to the word or not
  }  
  if (goodToGo) {   // if its true, we do all the stuff. If not, nothing is done
    for (let i = 0; i < theWord.length; i++) {
      if (key === theWord[i]) {
        correctAnswer++;
        index[i] = i;   // index is used to tell where the letter is located
      } 
    }
    if (correctAnswer >= 1) correct(key, index);
    else wrong();
  }
  keyUsed[keyUsed.length] = key;    // now adding the key to the array so that the next time, we will know this 'key' has already been used
  document.querySelector('.key-' + key).style.color = '#000';     // changing the appearance of the pressed keys
  document.querySelector('.key-' + key).style.backgroundColor = '#e7e4e4';
};

console.log('The word list for this game is downloaded from: https://github.com/RazorSh4rk/random-word-api');

addKeys();
getWord();
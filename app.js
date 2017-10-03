//import dependencies
const BasicFlashcard = require('./basic.js');
const ClozeFlashcard = require('./cloze.js');
const inquirer = require('inquirer');
const fs = require('fs');

//prompt the user to select options
inquirer.prompt([{
  //allow user to select from list of choices to run two operations
  name: 'command',
  message: 'What would you like to do?',
  type: 'list',
  choices: [{
    name: 'add-flashcard'
  }, {
    name: 'show-all-cards'
  }, {
    name: 'delete-cards'
  }]
}]).then(function(answer) {
  //conditional for each command
  if (answer.command === 'add-flashcard') {
    // run function for adding a new flashcard
    addCard();
  } else if (answer.command === 'show-all-cards') {
    //run function for practicing cards
    showCards();
  }
  else if(answer.command === 'delete-cards'){
    fs.writeFile('log.txt', '', function(){console.log('All Flashcards Deleted')});
  }
});

//function for adding a new card
var addCard = function() {
  inquirer.prompt([{
    name: 'cardType',
    message: 'What type of flashcard would you like to create?',
    type: 'list',
    //allow users to select from two types of flashcards
    choices: [{
      name: 'basic-flashcard'
    }, {
      name: 'cloze-flashcard'
    }]
  }]).then(function(answer) {
    if (answer.cardType === 'basic-flashcard') {
      inquirer.prompt([{
        name: 'front',

        //take user input and check if possible for question portion
        message: 'What is the question?',
        validate: function(input) {
          if (input === '') {
            console.log("Please provide a question");
            return false;
          } else {
            return true
          }
        }
      }, {
        name: 'back',
        //take user input and check if possible for answer portion
        message: 'What is the answer?',
        validate: function(input) {
          if (input === '') {
            console.log("Please provide an answer");
            return false;
          } else {
            return true;
          }
        }
      }]).then(function(answer) {
        let newBasic = new BasicFlashcard(answer.front, answer.back);
        //use external basic-flashcard constructor to create a new instance of basic-flashcard
        newBasic.create();
        //run 'reset' function
        whatsNext();
      });
    } else if (answer.cardType === 'cloze-flashcard') {
      inquirer.prompt([{
          name: 'text',
          message: 'Please Provide the full text',
          validate: function(input) {
            if (input === '') {
              console.log('Please provide the full text');
              return false;
            } else {
              return true
            }
          }
        },
        {
          name: 'cloze',
          message: 'What is the cloze portion?',
          validate: function(input) {
            if (input === '') {
              console.log('Please provide the cloze portion.');
              return false;
            } else {
              return true;
            }
          }


        }
      ]).then(function(answer) {
        let text = answer.text;
        let cloze = answer.cloze;
        if (text.includes(cloze)) {
          //use external cloze constructor to create a new instance of cloze-flashcard
          let newCloze = new ClozeFlashcard(text, cloze);
          newCloze.create();
          // run 'reset function'
          whatsNext();
        } else {
          console.log('Please try again.');
          addCard();
        }
      });
    }
  });
};

var whatsNext = function() {
  // get user input
  inquirer.prompt([{
    name: 'nextAction',
    message: 'What would you like to do next?',
    type: 'list',
    choices: [{
      name: 'create-new-card'
    }, {
      name: 'show-all-cards'
    }, {
      name: 'nothing'
    }]
    // once user input is received
  }]).then(function(answer) {
    if (answer.nextAction === 'create-new-card') {
      addCard();
    } else if (answer.nextAction === 'show-all-cards') {
      showCards();
    } else if (answer.nextAction === 'nothing') {
      return;
    }
  });
};
// initialize function to show cards to user
function showCards() {
  // pass the log.txt file containing the flashcards written by the user
  fs.readFile('./log.txt', 'utf8', function(error, data) {
    //if there is an error, log it
    if (error) {
      console.log('Error occurred: ' + error);
    }
    else if(data === undefined){
      return console.log("error");
    }
    //after passing the log.txt file, use split to create an array of questions
    var questions = data.split(';');
    // create function to catch not blank values
    var notBlank = function(value) {
      return value;
    };
    //keep all full questions in questions array
    questions = questions.filter(notBlank);
    var count = 0;
    //call show question function, passing questions and count
    showQuestion(questions, count);
  });
};

//show question function, takes in an array and index of an array
function showQuestion(array, index) {
  // not sure what this does
  question = array[index];
  // creates parsed question, which is in json parsed format
  var parsedQuestion = JSON.parse(question);
  //creates conditional variables
  var questionText;
  var correctReponse;

  //checks question object to see if it contains Basic or Cloze data
  if (parsedQuestion.type === 'basic') {
    //if basic, set the question text equal to the string front, and correct response equal to the string back
    questionText = parsedQuestion.front;
    correctReponse = parsedQuestion.back;
  } else if (parsedQuestion.type === 'cloze') {
    //if clozed, set question text equal to the cloze deleted string, and correct response to the cloze portion of question
    questionText = parsedQuestion.clozeDeleted;
    correctReponse = parsedQuestion.cloze;
  }
  // prompt user to check if users input string is equal to the correct response string
  inquirer.prompt([{
    name: 'response',
    message: questionText
  }]).then(function(answer) {
    //if the string is equal, log to the user that their answer is correct
    if (answer.response === correctReponse) {
      console.log('Correct!');
      if (index < array.length - 1) {
        //continue questions until questions array is finished with show question function
        showQuestion(array, index + 1);
      }
    } else {
      console.log('Wrong!');
      if (index < array.length - 1) {
          //continue questions until questions array is finished with show question function
        showQuestion(array, index + 1);
      }
    }
  });
};

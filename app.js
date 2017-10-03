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

var showCards = function() {
  // read the log.txt file
  fs.readFile('./log.txt', 'utf8', function(error, data) {
    //if there is an error, log it
    if (error) {
      console.log('Error occurred: ' + error);
    }
    else if(data === undefined){
      return console.log("error");
    }
    var questions = data.split(';');
    var notBlank = function(value) {
      return value;
    };
    questions = questions.filter(notBlank);
    var count = 0;
    showQuestion(questions, count);
  });
};

var showQuestion = function(array, index) {
  question = array[index];
  var parsedQuestion = JSON.parse(question);
  var questionText;
  var correctReponse;
  if (parsedQuestion.type === 'basic') {
    questionText = parsedQuestion.front;
    correctReponse = parsedQuestion.back;
  } else if (parsedQuestion.type === 'cloze') {
    questionText = parsedQuestion.clozeDeleted;
    correctReponse = parsedQuestion.cloze;
  }
  inquirer.prompt([{
    name: 'response',
    message: questionText
  }]).then(function(answer) {
    if (answer.response === correctReponse) {
      console.log('Correct!');
      if (index < array.length - 1) {
        showQuestion(array, index + 1);
      }
    } else {
      console.log('Wrong!');
      if (index < array.length - 1) {
        showQuestion(array, index + 1);
      }
    }
  });
};

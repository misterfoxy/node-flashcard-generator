const BasicFlashcard = require('./basic.js');
const ClozeFlashcard = require('./cloze.js');
const inquirer = require('inquirer');
const fs = require('fs');

inquirer.prompt([{
  name: 'command',
  message: 'What would you like to do?',
  type: 'list',
  choices: [{
    name: 'add-flashcard'
  },{
    name: 'show-all-cards'
  }]
}]).then(function(answer){
  if(answer.command === 'add-flashcard'){
    addCard();
  }
  else if(answer.command === 'show-all-cards'){
    showCards();
  }
});

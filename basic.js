var fs = require('fs');

module.exports = BasicFlashcard;

// constructor for basic flashcard

function BasicFlashcard(front,back){
  this.front = front;
  this.back = back;
  this.create = function(){

    //flashcard file to append to file

    var data = {
      front: this.front,
      back: this.back,
      type: 'basic',
    };

    // add card to log file

    fs.appendFile('log.txt', JSON.stringify(data) +';', 'utf8', function(error){

      if(error){
        console.log(error);
      }
    });
  };
}

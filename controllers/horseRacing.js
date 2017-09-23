'use strict'

function horseRacing(req, res){
  const json = req.body;

  // question 1
  let jsonArr = json.data
  let winnerHorse = [],
  winnerTrainer = [],
  winnerJockey = []

  let secondHorse = [],
  secondTrainer = [],
  secondJockey = []

  let thirdHorse = [],
  thirdTrainer = [],
  thirdJockey = []

  let i = 0
  for(i; i < jsonArr.length; i++){
    if(jsonArr[i].Placing === "1"){
      winnerHorse.push(jsonArr[i].Horse)
      winnerTrainer.push(jsonArr[i].Trainer)
      winnerJockey.push(jsonArr[i].jockeycode)
    }
    if(jsonArr[i].Placing === "2"){
      secondHorse.push(jsonArr[i].Horse)
      secondTrainer.push(jsonArr[i].Trainer)
      secondJockey.push(jsonArr[i].jockeycode)
    }
    if(jsonArr[i].Placing === "3"){
      thirdHorse.push(jsonArr[i].Horse)
      thirdTrainer.push(jsonArr[i].Trainer)
      thirdJockey.push(jsonArr[i].jockeycode)
    }
  }

  let horseScore = [];
  for(let j=0; j < jsonArr.length; j++){
    if(!(jsonArr[j].Horse)){
      horseScore.push({jsonArr[j].Horse : 7})
    } else {
      
    }
  }

  // let j = 0;
  // for(j; j < jsonArr.length; j++){
  //   // calculate horse score
  //   for(let hor=0; hor < jsonArr.length; hor++){
  //     jsonArr[i].Horse
  //   }
  //
  //
  // }



  let result = {
      "q1" : {
        "horse" : mostOccuringElement(winnerHorse),
        "jockey" : mostOccuringElement(winnerJockey),
        "trainer" : mostOccuringElement(winnerTrainer)
      },
      "q2": {
        "horse": mostOccuringElement(thirdHorse),
        "jockey": 0,
        "trainer": 0
    },
    "q3": [
        {
            "jockeys": ["jockey1", "jockey2", "jockey3"],
            "races": ["2010-01-30:1", "2010-01-30:2", "2010-01-30:3"]
        },
        {
            "jockeys": ["jockey1", "jockey2", "jockey3"],
            "races": ["2010-01-30:1", "2010-01-30:2", "2010-01-30:3"]
        }
    ]
  }

  return res.type('application/json').status(200).json(result)



}

function mostOccuringElement(input){
  let mostFrequent = 1; //default maximum frequency
  let m = 0;  //counter
  let item;  //to store item with maximum frequency
  for (let i=0; i < input.length; i++)    //select element (current element)
  {
    for (let j=i; j < input.length; j++)   //loop through next elements in array to compare calculate frequency of current element
    {
            if (input[i] === input[j])    //see if element occurs again in the array
             m++;   //increment counter if it does
            if (mostFrequent < m)   //compare current items frequency with maximum frequency
            {
              mostFrequent = m;      //if m>mf store m in mf for upcoming elements
              item = input[i];   // store the current element.
            }
    }
    m = 0;   // make counter 0 for next element.
  }

  return item;
}

function mostPoint(input){
  let max=0;
  for(key in input){
    if(max < input[key]){
      max = input[key]
    }
  }
  return max;
}

module.exports = horseRacing

'use strict'
var moment = require('moment');
// moment().format();

function releaseSchedule(req, res){
  console.log(req.body)
  const inputArr = req.body
  const numTasks = inputArr[0].split(";")[0];
  const startIT = getTime(inputArr[0].split(";")[1]);
  const endIT = getTime(inputArr[0].split(";")[2]);


  let pairArr = [[startIT, startIT]]
  let i = 1;
  for(i; i <= numTasks; i++){
    let startTask = getTime(inputArr[i].split(";")[1])
    let endTask = getTime(inputArr[i].split(";")[2])
    pairArr.push([startTask, endTask])
  }

  pairArr.push([endIT,endIT])


  pairArr.sort((a, b) => (moment(a[0]).diff(b[0])))

  let subArr;
  if(moment(startIT).diff(moment(pairArr[0][0]), 'milliseconds') > 0){
    subArr = [[startIT, pairArr[0][1]]]
  } else {
    subArr = [[pairArr[0][0], pairArr[0][1]]]
  }


  let nextIdx = false;
  let subIdx = 0;
  let max = 0;
  for(let j=1; j < pairArr.length; j++){

    // when the searched interval's starting time is earlier than current sub array
    if( moment(pairArr[j][0]).diff(moment(subArr[subIdx][1]), 'milliseconds') > 0){
      subArr.push([pairArr[j][0], pairArr[j][1]])

      subIdx++;
      if(max < moment(subArr[subIdx][0]).diff(moment(subArr[subIdx-1][1]))){
        max = moment(subArr[subIdx][0]).diff(moment(subArr[subIdx-1][1]));
      }
    }

    if(moment(moment(pairArr[j][1])).diff(subArr[subIdx][1], 'milliseconds') > 0){
      subArr[subIdx][1] = pairArr[j][1]
    }

  }

  max /= 1000;

  return res.type('text/plain').status(200).send(max.toString())
  // return res.type('application/json').status(200).json(subArr)
}


function getTime(str){
  let dateArr = str.split(" ")[0].split("-") // 28, 05, 2017
  let time = str.split(" ")[1]
  let final = dateArr[2]+"-"+dateArr[1]+"-"+dateArr[0]+" "+time.substring(0, 12);
  let timeZone = time.substring(time.length-4, time.length-2)
  let londonTime = "";

  if(time.charAt(time.length-5) === '+'){
    londonTime = moment(final).subtract(timeZone, 'hour');
  } else if(time.charAt(time.length-5) === '-'){
    londonTime = moment(final).add(timeZone, 'hour');
  } else {
    londonTime = moment(final);
  }

  return londonTime
}

module.exports = releaseSchedule

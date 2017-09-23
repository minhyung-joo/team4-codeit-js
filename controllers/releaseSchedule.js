'use strict'
var moment = require('moment');
// moment().format();

function releaseSchedule(req, res){
  const inputArr = req.body
  const numTasks = inputArr[0].split(";")[0];
  const startIT = getTime(inputArr[0].split(";")[1]);
  const endIT = getTime(inputArr[0].split(";")[2]);

  // let day = moment('13:00:00').add(1, 'hour')
  // let result = getTime(inputArr[0].split(";")[1]);
  let startArr = [startIT]
  let endArr = [endIT]
  let i = 1;
  for(i; i <= numTasks; i++){
    let startTask = getTime(inputArr[i].split(";")[1])
    let endTask = getTime(inputArr[i].split(";")[2])
    startArr[i] = startTask
    endArr[i] = endTask;
  }

  startArr[i] = startIT
  endArr[i] = endIT

  let maxGap = 0;
  for(let j=0; j < startArr.length-1; j++){
    let lowerBound = moment(endArr[j]);
    let upperBound = moment(startArr[j+1]);
    let gap = upperBound.diff(lowerBound, "seconds")
    if(maxGap < gap){
      maxGap = gap
    }
  }

  // return res.type('text/plain').status(200).send(moment(result).add(1, 'day').format('LLLL'))
  return res.type('text/plain').status(200).send(maxGap.toString())
  // return res.type('application/json').status(200).json(startArr)
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function getTime(str){
  let dateArr = str.split(" ")[0].split("-") // 28, 05, 2017
  let time = str.split(" ")[1]
  let final = dateArr[2]+"-"+dateArr[1]+"-"+dateArr[0]+" "+time.substring(0, 8);
  let timeZone = time.substring(time.length-4, time.length-2)
  let londonTime = "";

  if(time.charAt(time.length-5) === '+'){
    londonTime = moment(final).subtract(timeZone, 'hour').format('LLLL');
  } else if(time.charAt(time.length-5) === '-'){
    londonTime = moment(final).add(timeZone, 'hour').format('LLLL');
  } else {
    londonTime = moment(final).format('LLLL');
  }

  return londonTime
}

module.exports = releaseSchedule

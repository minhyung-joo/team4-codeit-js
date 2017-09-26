'use strict'
var moment = require('moment');

function releaseSchedule(req, res){
  console.log(req.body)
  const inputArr = req.body
  const numTasks = inputArr[0].split(";")[0];
  const startIT = getTime(inputArr[0].split(";")[1]);
  const endIT = getTime(inputArr[0].split(";")[2]);

  if(numTasks === 0){
    return res.type('text/plain').status(200).send(endIT.diff(startIT, 'seconds'))
  }

  let pairArr = [[startIT, startIT]]
  let i = 1;
  for(i; i <= numTasks; i++){
    let startTask = getTime(inputArr[i].split(";")[1])
    let endTask = getTime(inputArr[i].split(";")[2])
    pairArr.push([startTask, endTask])
  }

  // pairArr.push([endIT,endIT])

  for(let k=0; k < pairArr.length; k++){
    if(moment(startIT).diff(moment(pairArr[k][1]), 'seconds') > 0.0){
      pairArr[k][0] = startIT
      pairArr[k][1] = startIT
    }
     if(moment(startIT).diff(moment(pairArr[k][0]), 'seconds') > 0.0) {
      pairArr[k][0] = startIT
    }


    // interval all above endIT
    if(moment(pairArr[k][1]).diff(moment(endIT), 'seconds') > 0.0){
      pairArr[k][1] = endIT
    }
     if(moment(pairArr[k][0]).diff(moment(endIT), 'seconds') > 0.0){
      pairArr[k][0] = endIT
      pairArr[k][1] = endIT
    }

  }

  pairArr.sort((a, b) => (moment(a[0]).diff(b[0])))



  let subArr = [[pairArr[0][0], pairArr[0][1]]]

  let nextIdx = false;
  let subIdx = 0;
  let max = 0.0;
  for(let j=1; j < pairArr.length; j++){

    // when the searched interval's starting time is earlier than current sub array
    if( moment(pairArr[j][0]).diff(moment(subArr[subIdx][1]), 'seconds') >= 0.0){
      subArr.push([pairArr[j][0], pairArr[j][1]])

      subIdx++;

    }

    // end point case
    if(moment(pairArr[j][1]).diff(subArr[subIdx][1], 'seconds') >= 0.0){
      subArr[subIdx][1] = pairArr[j][1]
    }


  }

  for(let z=0; z < subArr.length-1; z++){
    if(max < moment(subArr[z+1][0]).diff(moment(subArr[z][1]), 'seconds')){
      max = moment(subArr[z+1][0]).diff(moment(subArr[z][1]), 'seconds');
    }
  }


  return res.type('text/plain').status(200).send(max.toString())
}


function getTime(str){
  let time = str.split(" ")[1]
  let final = moment(str, "DD-MM-YYYY HH:mm:ss.SSS")
  let timeZone = time.substring(time.length-4, time.length-2)
  let londonTime;

  // let varFinal = moment(final);

  if(time.charAt(time.length-5) === '+'){
    londonTime = final.subtract(timeZone, 'hour');
  } else if(time.charAt(time.length-5) === '-'){
    londonTime = final.add(timeZone, 'hour');
  } else {
    londonTime = final;
  }

  return londonTime
}

module.exports = releaseSchedule

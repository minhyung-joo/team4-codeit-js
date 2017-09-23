'use strict'

function jewelleryHeist(req, res){
  const json = req.body;
  const maxWeight = json.maxWeight

  let unsortedArr = json.vault
  let i = 0, density = 0

  // first store the value density of each item in a new array
  for(i; i<unsortedArr.length; i++){
    density = unsortedArr[i].value / unsortedArr[i].weight
    unsortedArr[i].density = density
  }

  let finalArr = sortArray(unsortedArr)

  let result = finalCalc(finalArr, finalArr.length, maxWeight)


  return res.type('application/json').status(200).json({"heist": result})
  // return res.type('application/json').status(200).json(finalArr)
}

function sortArray (input) {
  input.sort((a, b) => b.density - a.density)
  return input
}

function finalCalc(input, numItems, maxWeight) {
  let totalWeight = 0, totalBenefit = 0, remain = 0, remainVal

  for(let i=0; i< numItems; i++){
    if(input[i].weight + totalWeight <= maxWeight){
      totalWeight += input[i].weight
      totalBenefit += input[i].value

    } else {
      remain = (maxWeight - totalWeight)
      remainVal = remain * (input[i].value / input[i].weight)

      totalWeight += remain
      totalBenefit += remainVal

      break;
    }
  }

  return totalBenefit
}

module.exports = jewelleryHeist;

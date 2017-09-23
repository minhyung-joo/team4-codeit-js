'use strict'

function calcEmptArea (req, res) {
  const data = req.body

  let container = defineContainer(data)
  let child = defineChild(data)

  let results = calcOverlap(container, child)

  console.log(results)
  return res.type('text/plain').status(200).send(results)
}

function defineContainer(json){

  let width = json.container.width
  let height = json.container.height
  let coX = json.container.coordinate.X
  let coY = json.container.coordinate.Y

  let container = {
    width_c: width,
    height_c: height,
    left: coX,
    right: coX + width,
    top: coY + height,
    bottom: coY
  }

  return container
}

function defineChild(json){

  let child

  if (json.rectangle) {
    let width = json.rectangle.width
    let height = json.rectangle.height
    let coX = json.rectangle.coordinate.X
    let coY = json.rectangle.coordinate.Y

    child = {
      left: coX,
      right: coX + width,
      top: coY + height,
      bottom: coY
    }

  }
  else if(json.square){
    let width = json.square.width
    let coX = json.square.coordinate.X
    let coY = json.square.coordinate.Y

    child = {
      left: coX,
      right: coX + width,
      top: coY + width,
      bottom: coY
    }

  } //else if(json.circle){


  return child
}

function calcOverlap(container, child){

    let x_overlap = Math.max(0, Math.min(container.right, child.right) - Math.max(container.left, child.left))
    let y_overlap = Math.max(0, Math.min(container.top, child.top) - Math.max(container.bottom, child.bottom))

    let overlapArea = x_overlap * y_overlap

    let containerArea = container.width_c * container.height_c

    let area_uncovered = containerArea - overlapArea

    return area_uncovered

}

module.exports = calcEmptArea

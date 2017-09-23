'use strict'

function calcEmptArea (req, res) {
  const data = req.body

  let container = defineContainer(data)
  let child = defineChild(data)

  let results = calcOverlap(container, child)

  console.log(results)
  return res.type('text/plain').status(200).send(results.toString())
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
      type: "rectangle",
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
      type: "square",
      left: coX,
      right: coX + width,
      top: coY + width,
      bottom: coY
    }

  } else if(json.circle){

    let centerX = json.circle.center.X
    let centerY = json.circle.center.Y
    let radius = json.circle.radius

    child = {
      type: "circle",
      coX: centerX,
      coY: centerY,
      rad: radius
    }

  }

  return child
}

function calcOverlap(container, child){

    let overlapArea = 0.0

    if (child.type === "square" || child.type === "rectangle") {
      let x_overlap = Math.max(0, Math.min(container.right, child.right) - Math.max(container.left, child.left))
      let y_overlap = Math.max(0, Math.min(container.top, child.top) - Math.max(container.bottom, child.bottom))

      overlapArea = x_overlap * y_overlap
    }

    if (child.type === "circle"){
      let increment = 0.0001

      let rightBound = Math.min(container.right, (child.coX + child.rad))
      let leftBound = Math.max(container.left, (child.coX - child.rad))

      for (var i = leftBound; i < rightBound; i+= increment){
        let circleY = Math.sqrt(Math.pow(child.rad,2) - Math.pow((i - child.coX),2))
        let topBound = Math.min(container.top, (child.coY + circleY))
        let lowBound = Math.max(container.bottom, (child.coY - circleY))

        let length = topBound - lowBound
        let incremental_area = length * increment
        overlapArea += incremental_area

        }

    }

    let containerArea = container.width_c * container.height_c

    let area_uncovered
    area_uncovered = round((containerArea - overlapArea), 2)



    return area_uncovered

}


function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}


module.exports = calcEmptArea

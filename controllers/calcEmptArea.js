'use strict'
const turf = require('turf')
const geojsonArea = require('geojson-area')

function calcEmptArea (req, res) {
  const data = req.body

  let container = defineContainer(data)
  let child = defineChild(data)

  let results = calcOverlap(container, child)

  return res.type('text/plain').status(200).send(results)
}


function defineContainer(json){
  let container = new Object()
  let width = json.container.width
  let height = json.container.height
  let coX = json.container.coordinate.X
  let coY = json.container.coordinate.Y

  container = {
    "shape": "rectangle",
    "coordinates": [
      [coX, coY],
      [coX + width, coY],
      [coX, coY + height],
      [coX + width, coY + height]
    ]
  }

  return container
}


function defineChild (json) {
  let child = new Object()

  if (json.rectangle) {
    let width = json.rectangle.width
    let height = json.rectangle.height
    let coX = json.rectangle.coordinate.X
    let coY = json.rectangle.coordinate.Y

    child = {
      "shape": "rectangle",
      "coordinates": [
        [coX, coY],
        [coX + width, coY],
        [coX, coY + height],
        [coX + width, coY + height]
      ]
    }

  } else if (json.square) {
    let width = json.square.width
    let coX = json.square.coordinate.X
    let coY = json.square.coordinate.Y
    child = {
      "shape": "square",
      "coordinates": [
        [coX, coY],
        [coX + width, coY],
        [coX, coY + width],
        [coX + width, coY + width]
      ]
    }
  } else {
    let centerX = json.circle.center.X
    let centerY = json.circle.center.Y
    let radius = json.circle.radius
    let steps = 1000
    for (let i = 0; i < steps; i++) {
    child.coordinates = [(centerX + radius * Math.cos(2 * Math.PI * i / steps)),
                            (centerY + radius * Math.sin(2 * Math.PI * i / steps))]
    }
    child.shape = "circle"
  } // what if a different shape type is given?

    return child

}


function calcOverlap(container, child){
  let intersection = turf.intersect(container, child)

  let area_intersection = geojsonArea.geometry(intersection.geometry)
  let area_container = geojsonArea.geometry(container)

  let area_uncovered = area_container - area_intersection
  return area_uncovered
}

module.exports = calcEmptArea

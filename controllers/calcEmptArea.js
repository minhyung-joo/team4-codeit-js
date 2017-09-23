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
    "type": "Feature",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [coX, coY],
        [coX + width, coY],
        [coX, coY + height],
        [coX + width, coY + height]
      ]]
    },
    "properties": {
      "name": "Container"
    }
  }

  console.log(container)

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
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [coX, coY],
          [coX + width, coY],
          [coX, coY + height],
          [coX + width, coY + height]
        ]]
      },
      "properties": {
        "name": "Child"
      }
    }

  } else if (json.square) {
    let width = json.square.width
    let coX = json.square.coordinate.X
    let coY = json.square.coordinate.Y
    child = {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [coX, coY],
          [coX + width, coY],
          [coX, coY + width],
          [coX + width, coY + width]
        ]]
      },
      "properties": {
        "name": "Child"
      }
    }

  } else {
    let centerX = json.circle.center.X
    let centerY = json.circle.center.Y
    let radius = json.circle.radius
    let steps = 1000
    let circle_coords = []
    for (let i = 0; i < steps; i++) {
    circle_coords.push([(centerX + radius * Math.cos(2 * Math.PI * i / steps)),
                            (centerY + radius * Math.sin(2 * Math.PI * i / steps))])
    }
    child = {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          circle_coords
        ]]
      },
      "properties": {
        "name": "Child"
      }
    }
  }

  console.log(child)

  return child

}


function calcOverlap(container, child){
  let intersection = turf.intersect(container, child)

  let area_intersection = geojsonArea.geometry(intersection.geometry)
  let area_container = geojsonArea.geometry(container.geometry)

  let area_uncovered = area_container - area_intersection
  return area_uncovered
}

module.exports = calcEmptArea

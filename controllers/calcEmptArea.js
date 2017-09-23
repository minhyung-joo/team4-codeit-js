'use strict'
const turf = require('turf')
const geojsonArea = require('geojson-area')

function calcEmptArea (req, res) {
  const data = req.body

  let container = defineContainer(data)
  let child = defineChild(data)

  let results = calcOverlap(data, container, child)

  console.log(results)
  return res.type('text/plain').status(200).send(results)
}


function defineContainer(json){

  let width = json.container.width
  let height = json.container.height
  let coX = json.container.coordinate.X
  let coY = json.container.coordinate.Y


  console.log(coX)
  console.log(coY)
  console.log(width)
  console.log(height)

  let container = turf.polygon([[
          [coX, coY],
          [coX, coY + height],
          [coX + width, coY + height],
          [coX + width, coY],
          [coX, coY]
        ]])

  console.log(container.geometry.coordinates[0])
  var area = width * height
  return container
}


function defineChild (json) {
  let child

  if (json.rectangle) {
    let width = json.rectangle.width
    let height = json.rectangle.height
    let coX = json.rectangle.coordinate.X
    let coY = json.rectangle.coordinate.Y


    console.log(coX)
    console.log(coY)
    console.log(width)
    console.log(height)

    child = turf.polygon([[
            [coX, coY],
            [coX, coY + height],
            [coX + width, coY + height],
            [coX + width, coY],
            [coX, coY]
          ]])

    console.log(child.geometry.coordinates[0])

  } else if (json.square) {
    let width = json.square.width
    let coX = json.square.coordinate.X
    let coY = json.square.coordinate.Y

    child = turf.polygon([[
            [coX, coY],
            [coX, coY + width],
            [coX + width, coY + width],
            [coX + width, coY],
            [coX, coY]
          ]])


  } else {
    let centerX = json.circle.center.X
    let centerY = json.circle.center.Y
    let radius = json.circle.radius
    let steps = 10000
    let circle_coords = []
    for (let i = 0; i < steps; i++) {
    circle_coords.push([(centerX + radius * Math.cos(2 * Math.PI * i / steps)),
                            (centerY + radius * Math.sin(2 * Math.PI * i / steps))])
    }
    circle_coords.push([(centerX + radius * Math.cos(0)),
                            (centerY + radius * Math.sin(0))])

    child = turf.polygon([circle_coords])

  }



  return child
}


function calcOverlap(json, container, child){

  let width = json.container.width
  let height = json.container.height

  let intersection = turf.intersect(container, child)

  let area_intersection = geojsonArea.geometry(intersection.geometry)
  console.log(area_intersection)
  let area_container = geojsonArea.geometry(container.geometry)
  console.log(area_container)

  let ratio = (area_container-area_intersection) / area_container

  let area_uncovered = width * height * ratio

  return area_uncovered
}

module.exports = calcEmptArea

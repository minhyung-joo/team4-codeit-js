'use strict'



function calcEmptArea(req, res){

  var turf = require('turf');
  var geojsonArea = require('geojson-area');

  const data = req.body.data
  var json = JSON.parse(data)

  var container = defineContainer(json)
  var child = defineChild(json)

  let results = calcOverlap(container, child)



  return res.type('text/plain').status(200).send(results)

  }
}


function defineContainer(json){

  var container = new Object();

  if (json.["container"].includes("height")){
    var width= json.["container"].["width"]
    var height = json.["container"].["height"]
    var coX = json.["container"].["coordinate"].["X"]
    var coY = json.["container"].["coordinate"].["Y"]

    container = {
      "shape": "rectangle"
      "coordinates": [
        [coX, coY],
        [coX + width, coY],
        [coX, coY + height],
        [coX + width, coY + height]
      ]
    }
  } else if (json.["container"].includes("radius")){
    var centerX = json.["container"].["center"].["X"]
    var centerY = json.["container"].["center"].["Y"]
    var radius = json.["container"].["radius"]
    var steps = 1000
    for (var i = 0; i < steps; i++) {
    container.coordinates = [(centerX + radius * Math.cos(2 * Math.PI * i / steps)),
                            (centerY + radius * Math.sin(2 * Math.PI * i / steps))]
    }
    container.shape = "circle"


  } else { // when container is square
    var width = json.["container"].["width"]
    var coX = json.["container"].["coordinate"].["X"]
    var coY = json.["container"].["coordinate"].["Y"]
    container = {
      "shape": "square"
      "coordinates": [
        [coX, coY],
        [coX + width, coY],
        [coX, coY + width],
        [coX + width, coY + width]
      ]
    }
  }

  return container
}


function defineChild(json){

  var child = new Object();

  if (json.includes("rectangle"){
    var width= json.["rectangle"].["width"]
    var height = json.["rectangle"].["height"]
    var coX = json.["rectangle"].["coordinate"].["X"]
    var coY = json.["rectangle"].["coordinate"].["Y"]

    child = {
      "shape": "rectangle"
      "coordinates": [
        [coX, coY],
        [coX + width, coY],
        [coX, coY + height],
        [coX + width, coY + height]
      ]
    }

  } else if (json.includes("square")){
    var width = json.["square"].["width"]
    var coX = json.["square"].["coordinate"].["X"]
    var coY = json.["square"].["coordinate"].["Y"]
    child = {
      "shape": "square"
      "coordinates": [
        [coX, coY],
        [coX + width, coY],
        [coX, coY + width],
        [coX + width, coY + width]
      ]
    }
  } else {
    var centerX = json.["container"].["center"].["X"]
    var centerY = json.["container"].["center"].["Y"]
    var radius = json.["container"].["radius"]
    var steps = 1000
    for (var i = 0; i < steps; i++) {
    container.coordinates = [(centerX + radius * Math.cos(2 * Math.PI * i / steps)),
                            (centerY + radius * Math.sin(2 * Math.PI * i / steps))]
    }
    container.shape = "circle"
  } // what if a different shape type is given?

    return child

}


function calcOverlap(container, child){

var intersection = turf.intersect(container, child);

var area_intersection = geojsonArea.geometry(intersection.geometry);
var area_container = geojsonArea.geometry(container);

var area_uncovered = area_container - area_intersection;


}

module.exports = calcEmptArea;

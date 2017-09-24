function trainRoute (req, res) {
  let destinationName = req.body.destination
  let stations = req.body.stations

  let index = 0
  const vertexTable = {}
  stations.forEach(station => {
    station.index = index
    vertexTable[station.name] = index
    index++
  })
  const visited = new Array(index)
  const pred = new Array(index)
  const dist = new Array(index)

  for (let i = 0; i < index; i++) {
    visited[i] = false
    pred[i] = -1
    dist[i] = Number.MAX_VALUE
  }

  const queue = []
  visited[vertexTable[destinationName]] = true
  dist[vertexTable[destinationName]] = 0
  queue.push(destinationName)

  while (queue.length > 0) {
    let name = queue.shift()
    let station = findStation(stations, name)
    let v = vertexTable[name]
    station.connections.forEach(conn => {
      let w = vertexTable[conn.station]
      if (!visited[w]) {
        visited[w] = true
        pred[w] = v
        dist[w] = dist[v] + 1
        queue.push(conn.station)
      }
    })
  }

  for (let i = 0; i < dist.length; i++) {
    stations[i].distance = dist[i]
  }

  while (breakable(stations)) {
    stations.sort((a, b) => a.connections.length - b.connections.length)
    for (let station of stations) {
      if (shouldBreak(station)) {
        let minConnection
        let minDist = Number.MAX_VALUE
        station.connections.forEach(conn => {
          let connection = findStation(stations, conn.station)
          if (connection.distance < minDist) {
            minDist = connection.distance
            minConnection = connection.name
          }
        })
        station.connections.forEach(conn => {
          let connection = findStation(stations, conn.station)
          if (minConnection === conn.station) {
            connection.passengers += station.passengers
          }
          connection.connections = connection.connections.filter(c => c.station !== station.name)
        })
        stations = stations.filter(s => s.name !== station.name)
      }
    }
  }

  const destination = findStation(stations, destinationName)
  let maxPassengers = 0
  let maxLine
  let maxStation
  destination.connections.forEach(conn => {
    let connection = findStation(stations, conn.station)
    if (connection.passengers > maxPassengers) {
      maxPassengers = connection.passengers
      maxLine = conn.line
      maxStation = conn.station
    }
  })

  return res.status(200).json({
    line: maxLine,
    totalNumOfPassengers: maxPassengers,
    reachingVia: maxStation
  })
}

function breakable (stations) {
  for (let station of stations) {
    if (station.distance > 1) {
      return true
    }
  }

  return false
}

function shouldBreak (station) {
  if (station.distance <= 1) {
    return false
  }

  return true
}

function findStation (stations, name) {
  return stations.filter(station => station.name === name)[0]
}

module.exports = trainRoute

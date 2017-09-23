const axios = require('axios')
const _ = require('lodash')

let currentRunId
let messageQueue = []
let orders = []
let history = []
let closePrice = {}
let ended = false

function miniExchange (req, res) {
  messageQueue.push(req.body)
  if (checkTransaction(messageQueue)) {
    for (let message of messageQueue) {
      processMessage(message)
    }
  }

  if (ended) {
    return res.status(200).json(history)
  }
  return res.status(200).end()
}

function checkTransaction (queue) {
  queue.sort((a, b) => a.messageId - b.messageId)
  const first = queue[0]
  const last = queue[queue.length - 1]
  if (
    first.messageType === 'SOD' &&
    last.messageType === 'EOD' &&
    (last.messageId - first.messageId + 1 === queue.length)
  ) {
    return true
  }
  return false
}

function processMessage (message) {
  switch (message.messageType) {
    case 'SOD':
      processStartMessage(message)
      break
    case 'NEW':
      processNewMessage(message)
      break
    case 'QUANTITY':
      processQuantityMessage(message)
      break
    case 'PRICE':
      processPriceMessage(message)
      break
    case 'CANCEL':
      processCancelMessage(message)
      break
    case 'EOD':
      processEndMessage(message)
      ended = true
      break
    default:
      break
  }
}

function processStartMessage (message) {
  ended = false
  closePrice = message.closePrice
}

function processNewMessage (message) {
  if (!closePrice[message.symbol] || message.quantity <= 0) {
    return
  }

  message.state = 'LIVE'
  message.openQuantity = message.quantity
  tryMatching(message)
  orders.push(message)
}

function processQuantityMessage (message) {
  const search = orders.filter(order => (order.orderId === message.orderId))
  if (search.length > 0 && search[0].openQuantity + message.quantity >= 0) {
    const order = search[0]
    order.messageId = message.messageId
    order.openQuantity += message.quantity
    if (order.openQuantity > order.quantity) {
      order.quantity = order.openQuantity
    }
    if (order.openQuantity === 0) {
      order.state = 'FILLED'
    } else {
      order.state = 'LIVE'
      tryMatching(order)
    }
  }
}

function processPriceMessage (message) {
  const search = orders.filter(order => (order.orderId === message.orderId && order.state === 'LIVE'))
  if (search.length > 0) {
    const order = search[0]
    order.messageId = message.messageId
    order.price = message.price
    tryMatching(order)
  }
}

function processCancelMessage (message) {
  const search = orders.filter(order => (order.orderId === message.orderId && order.state === 'LIVE'))
  if (search.length > 0) {
    const order = search[0]
    order.state = 'CANCELLED'
    order.openQuantity = 0
  }
}

function processEndMessage (message) {
  orders.forEach(order => {
    delete order.messageId
    delete order.messageType
    delete order.orderType
  })
  history = _.cloneDeep(orders)
  closePrice = {}
  orders = []
  messageQueue = []

  axios({
    method: 'post',
    url: 'https://cis2017-mini-exchange.herokuapp.com/evaluate/result',
    data: {
      runId: currentRunId,
      result: history
    }
  })
  console.log('POSTED', history)
}

function tryMatching (message) {
  let standingOrders = orders
    .filter(order => (
      order.side !== message.side &&
      order.state === 'LIVE' &&
      order.symbol === message.symbol
    ))
    .sort((a, b) => {
      if (message.side === 'B') {
        return a.price - b.price
      } else {
        return b.price - a.price
      }
    })

  while (standingOrders.length > 0 && message.state === 'LIVE') {
    const bestPrice = standingOrders[0].price
    const bestOrder = standingOrders
      .filter(order => order.price === bestPrice)
      .sort((a, b) => a.messageId - b.messageId)[0]

    if (message.orderType === 'LMT') {
      if (
        (message.side === 'B' && message.price < bestPrice) ||
        (message.side === 'S' && message.price > bestPrice)
      ) {
        break
      }
    }
    const tradeQuantity = Math.min(message.openQuantity, bestOrder.openQuantity)
    message.openQuantity -= tradeQuantity
    bestOrder.openQuantity -= tradeQuantity
    if (message.openQuantity === 0) {
      message.state = 'FILLED'
    }
    if (bestOrder.openQuantity === 0) {
      bestOrder.state = 'FILLED'
    }
    if (!bestOrder.fills) {
      bestOrder.fills = []
    }
    if (!message.fills) {
      message.fills = []
    }
    bestOrder.fills.push({
      orderId: message.orderId,
      price: bestPrice,
      quantity: tradeQuantity
    })
    message.fills.push({
      orderId: bestOrder.orderId,
      price: bestPrice,
      quantity: tradeQuantity
    })

    closePrice[message.symbol] = bestPrice
    if (message.orderType === 'MKT') {
      message.orderType = 'LMT'
      message.price = closePrice[message.symbol]
    }
    standingOrders = orders
      .filter(order => (order.side !== message.side && order.state === 'LIVE'))
      .sort((a, b) => {
        if (message.side === 'B') {
          return a.price - b.price
        } else {
          return b.price - a.price
        }
      })
  }
}

function startChallenge (req, res) {
  axios({
    method: 'post',
    url: 'https://cis2017-coordinator.herokuapp.com/api/evaluate',
    data: {
      team: 'ZzamVibe',
      challenge: 'Mini Exchange'
    }
  }).then(response => {
    currentRunId = response.data.runId
    console.log(currentRunId)
  })

  res.status(200).end()
}

module.exports.miniExchange = miniExchange
module.exports.startChallenge = startChallenge

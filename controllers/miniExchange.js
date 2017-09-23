let prevMessageId = -1
const messageQueue = []

function miniExchange(req, res) {
  const messageId = req.body.messageId
  if (prevMessageId + 1 === messageId) {

  } else {
    messageQueue.push(req.body)
  }
}

function processMessage(message) {
  switch (message.messageType) {
    case 'SOD':

      break;
    case 'NEW':
    
    default:

  }
}

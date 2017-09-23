const axios = require('axios')
const stdin = process.stdin

axios({
  method: 'post',
  url: 'https://cis2017-warehouse-keeper.herokuapp.com/reset?run_id=f14124c4-b46b-4128-a75a-69a2b8e46ecd'
}).then(response => {
  console.log(response.data.map)
  stdin.setRawMode(true)
  stdin.resume()
  stdin.setEncoding('utf8')

  stdin.on('data', (key) => {
    // ctrl-c ( end of text )
    if (key === '\u0003') {
      process.exit()
    }

    switch (key) {
      case 'w':
        axios({
          method: 'post',
          url: 'https://cis2017-warehouse-keeper.herokuapp.com/move/up?run_id=f14124c4-b46b-4128-a75a-69a2b8e46ecd'
        }).then(response => {
          console.log(response.data.map)
        })
        break
      case 's':
        axios({
          method: 'post',
          url: 'https://cis2017-warehouse-keeper.herokuapp.com/move/down?run_id=f14124c4-b46b-4128-a75a-69a2b8e46ecd'
        }).then(response => {
          console.log(response.data.map)
        })
        break
      case 'a':
        axios({
          method: 'post',
          url: 'https://cis2017-warehouse-keeper.herokuapp.com/move/left?run_id=f14124c4-b46b-4128-a75a-69a2b8e46ecd'
        }).then(response => {
          console.log(response.data.map)
        })
        break
      case 'd':
        axios({
          method: 'post',
          url: 'https://cis2017-warehouse-keeper.herokuapp.com/move/right?run_id=f14124c4-b46b-4128-a75a-69a2b8e46ecd'
        }).then(response => {
          console.log(response.data.map)
        })
        break
      default:
        break
    }
  })
})

function warehouseKeeper (req, res) {
  console.log(req.body.map)
  console.log(req.body.run_id)

  return res.status(200).end()
}
module.exports = warehouseKeeper

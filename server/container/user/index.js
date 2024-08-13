
let { RespServerErr} = require('../../model/error')
const { RespError, RespData } = require('../../model/resp')

function List(req, res) {
  const { id } = req.user
  const sql = 'select * from user where id !=?'
  db.query(sql, [id], async (err, results) => {
    if (err) return RespError(res, RespServerErr)
    let friendList = []
    if (results.length != 0) friendList = results
    return RespData(res, friendList)
  })
}
module.exports = {
  List
}
const jwt = require('jsonwebtoken')
const secretKey = 'xWbiNA3FqnK77MnVCj5CAcfA-VlXj7xoQLd1QaAme6l_t0Yp1TdHbSw'
let rooms = {}
let { RespUserOrPassErr, RespParamErr, RespServerErr, RespUserExitErr, RespUpdateErr, RespUserNotExitErr } = require('../../model/error')
const { RespData, RespSuccess ,RespError} = require('../../model/resp')
const { Query } = require('../../db/query')
const crypto = require('crypto')

async function Login(req, res) {
  const { username, password } = req.body
  if (!(username && password)) return RespError(res, RespParamErr)
  const sql = 'select * from user where username=?'
  const { err, results } = await Query(sql, [username])
  if (err) return RespError(res, RespServerErr)
  if (results.length != 0) {
    const payload = {
      id: results[0].id,
      avatar: results[0].avatar,
      username: results[0].username,
      password: results[0].password,
      name: results[0].name,
      phone: results[0].phone,
      salt: results[0].salt
    }
    //加盐
    let M = payload.salt.slice(0, 3) + password + payload.salt.slice(3)
    // 将M进行MD5哈希，得到哈希值
    let hash = crypto.createHash('md5').update(M).digest('hex')
    if (hash != payload.password) return RespError(res, RespServerErr)
    const token = jwt.sign(payload, secretKey)
    let data = {
      token: token,
      info: {
        id: results[0].id,
        avatar: results[0].avatar,
        username: results[0].username,
        name: results[0].name,
        phone: results[0].phone,
        created_at: new Date(results[0].created_at).toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        signature: results[0].signature,
        type: results[0].type
      }
    }
    const sqlStr = 'update user set online_status=? where username=?'
    db.query(sqlStr, ['online', username], (err, result) => {
      // 执行 SQL 语句失败了
      if (err) return RespError(res, RespServerErr)
      if (result.affectedRows === 1) {
        return RespData(res, data)
      }
      return RespError(res, RespUpdateErr)
    })
  } else {
    return RespError(res, RespUserOrPassErr)
  }
}

async function Register(req, res){
  const { username, password } = req.body
  if (!(username && password)) return RespError(res, RespParamErr)
  //3个字节的字节码转化成16进制字符串，生成一个6位的salt
  const salt = crypto.randomBytes(3).toString('hex')
  const sql = 'select username, password from user where username=?'
  //判断用户名是否已注册
  let { err, results } = await Query(sql, [username])
  // 查询数据失败
  if (err) return RespError(res, RespServerErr)
  if (results.length != 0) return RespError(res, RespUserExitErr)
  //加盐
  let M = salt.slice(0, 3) + password + salt.slice(3);
  // 将M进行MD5哈希，得到哈希值
  let hash = crypto.createHash('md5').update(M).digest('hex');
  let user = {
    avatar: "",
    username: username,
    password: hash,
    name: username,
    phone: "",
    room: '',
    salt: salt,
    remark: '',
    type: 1
  }
  const sqlStr = 'insert into user set ?'
  let res2 = await Query(sqlStr, user)
  err = res2.err
  if (err) return RespError(res, RespServerErr)
  return RespSuccess(res)
}

function SetRoom(ws, req) {
  let url = req.url.split("?")[1]
  let params = new URLSearchParams(url)
  let userId = params.get("id")
  rooms[userId] = ws
  ws.on('message', (res_data) => {
    const { roomId, invite } = JSON.parse(res_data)
    const roomInfo = JSON.stringify({roomId, inviteId:invite})
    for (const key in rooms) {
      rooms[key].send(roomInfo)
    }
  })
  ws.on('close', () => {
    // const sqlStr = 'update user set online_status=? where username=?'
    // db.query(sqlStr, ['offline', username], (err, result) => {
    //   if (err) return RespError(res, RespServerErr)
    //   if (result.affectedRows !== 1) return RespError(res, RespUpdateErr)
    // })
  })
}

module.exports = {
  Login,
  Register,
  SetRoom
}
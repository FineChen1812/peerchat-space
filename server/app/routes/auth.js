const express = require('express')
const router = express.Router()
const auth = require('../../container/auth/index')
const multer = require('multer')
const upload = multer({ dest: 'uploads/avatar' })
const jwt = require('jsonwebtoken')
const secretKey = 'xWbiNA3FqnK77MnVCj5CAcfA-VlXj7xoQLd1QaAme6l_t0Yp1TdHbSw'
const { RespTokenErr } = require('../../model/error')

function authenticateToken(req, res, next) {
  const token = req.headers.authorization
  if(!token) return RespError(res, RespTokenErr)
  jwt.verify(token, secretKey, (err, decoded) => {
    if(err) {
      return RespError(res, RespTokenErr)
    } else {
      req.user = decoded
      next()
    }
  })
}

module.exports = function () {
  router.post('/login', auth.Login)
  router.post('/register', auth.Register)
  router.ws('/setRoom', auth.SetRoom)
  return router
}
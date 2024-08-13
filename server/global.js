
function initGlobal() {
  /**
   * 初始化数据库
   */
  const db = require("./db/db.js")
  const { Query } = require("./db/query.js")
  global.db = db
  global.Query = Query
  /** 
   * 初始化状态码并设置为全局变量 
   */
  const resp = require("./model/resp.js")
  global.RespSuccess = resp.RespSuccess
  global.RespError = resp.RespError
  global.RespData = resp.RespData
  /**
   * 定义全局登录用户房间
   */
  global.LoginRooms = {}
  /**
   * 定义全局用户发送通知方法
   */
  const { NotificationUser } = require("./utils/notification.js")
  global.NotificationUser = NotificationUser
  /**
   * 音视频房间
   */
  global.rooms={}
  global.group_rooms={}

}

module.exports = initGlobal
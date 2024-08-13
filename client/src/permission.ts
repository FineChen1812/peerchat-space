
import router from './router'
import { getToken } from '~/utils/cookie'

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      return next({ path: '/' })
    } else {
      return next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      return next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

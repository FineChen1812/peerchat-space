const TOKEN_KEY:string = 'Authorization'
const NAME_KEY = 'user'

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token:string) => {
  return localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = () => {
  return localStorage.removeItem(TOKEN_KEY)
}
export const getUser = () => {
  if (localStorage.getItem(NAME_KEY)) {
    return JSON.parse(localStorage.getItem(NAME_KEY) || '')
  }
  return ""
}

export const setUser = (user:any) => {
  return localStorage.setItem(NAME_KEY, JSON.stringify(user))
}

export const removeUser = () => {
  return localStorage.removeItem(NAME_KEY)
}
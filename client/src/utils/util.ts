export const getImageUrl = (file: ArrayBuffer | undefined) => {
  if(!file) return ''
  const blob = new Blob([file], { type: 'image/*' })
  const url = URL.createObjectURL(blob)
  return url
}

export const getCurTime = () => {
  const now = new Date()
  const curHour = now.getHours()
  const curMinute = now.getMinutes()
  const curTime = `${curHour.toString().padStart(2, '0')}:${curMinute.toString().padStart(2, '0')}`
  return curTime
}

export const mergeArrayBuffers = (arrays:ArrayBuffer[]) => {
  let totalLen = 0
  for(let arr of arrays) {
    totalLen += arr.byteLength
  }
  let res = new Uint8Array(totalLen)
  let offset = 0
  for(let arr of arrays) {
    let unit8Arr = new Uint8Array(arr)
    res.set(unit8Arr, offset)
    offset += unit8Arr.byteLength
  }
  return res.buffer
}
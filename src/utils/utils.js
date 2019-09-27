export function getMillisecond(time) {
  let newMin = 0
  let newHour = 0
  if (time.indexOf('小时') === -1) {
    newMin = parseInt(time)
  } else if (time.indexOf('分钟') === -1) {
    newHour = parseInt(time.substring(0, time.indexOf('小时')))
  } else {
    newHour = parseInt(time.substring(0, time.indexOf('小时')))
    newMin = parseInt(time.substring(time.indexOf('小时') + 2, time.indexOf('分钟')))
  }
  return (newHour * 60 + newMin) * 60 * 1000
}
export function getDistanceKm(distance) {
  let newDistance = 0
  if (distance.indexOf('米') === -1) {
    newDistance = parseFloat(distance)
  } else {
    newDistance = parseFloat(distance) / 1000
  }
  return newDistance
}

export function formatDate(date, format) {
  if (!format) format = 'yyyy-MM-dd HH:mm:ss'

  date = new Date(parseInt(date))

  const dict = {

    'yyyy': date.getFullYear(),

    'M': date.getMonth() + 1,

    'd': date.getDate(),

    'H': date.getHours(),

    'm': date.getMinutes(),

    's': date.getSeconds(),

    'S': ('' + (date.getMilliseconds() + 1000)).substr(1),

    'MM': ('' + (date.getMonth() + 101)).substr(1),

    'dd': ('' + (date.getDate() + 100)).substr(1),

    'HH': ('' + (date.getHours() + 100)).substr(1),

    'mm': ('' + (date.getMinutes() + 100)).substr(1),

    'ss': ('' + (date.getSeconds() + 100)).substr(1)

  }

  return format.replace(/(y+|M+|d+|H+|s+|m+|S)/g,
    function(a) {
      return dict[a]
    })
}

// 日期格式化
export function dateformarter(value, rowData, rowIndex) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  const year = date.getFullYear().toString()

  let month = (date.getMonth() + 1)

  let day = date.getDate().toString()

  let hour = date.getHours().toString()

  let minutes = date.getMinutes().toString()

  let seconds = date.getSeconds().toString()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }

  if (hour < 10) {
    hour = '0' + hour
  }

  if (minutes < 10) {
    minutes = '0' + minutes
  }

  if (seconds < 10) {
    seconds = '0' + seconds
  }

  if (year === 'NaN' || month === 'NaN') {
    return ''
  }

  return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
}
export function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10)
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    default:
      return 0
  }
}
export function randomNumDuble(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return Math.random() * minNum + 1
    case 2:
      return Math.random() * (maxNum - minNum) + minNum
    default:
      return 0
  }
}
export function uuid(len, radix) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid = []
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

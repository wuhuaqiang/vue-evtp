export function Queue() {
  this.dataStore = []
  // 入队，就是在数组的末尾添加一个元素
  this.enqueue = (element) => {
    this.dataStore.push(element)
  }
  // 出队，就是删除数组的第一个元素
  this.dequeue = () => {
    return this.dataStore.shift()
  }
  // 取出数组的第一个元素
  this.front = () => {
    return this.dataStore[0]
  }
  // 取出数组的最后一个元素
  this.back = () => {
    return this.dataStore[this.dataStore.length - 1]
  }
  this.toString = () => {
    var retStr = ''
    for (var i = 0; i < this.dataStore.length; ++i) {
      retStr += this.dataStore[i] + '&nbsp'
    }
    return retStr
  }
  // 判断数组是否为空
  this.empty = () => {
    if (this.dataStore.length === 0) {
      return true
    } else {
      return false
    }
  }
  // 检查队列中是否有该元素
  this.check = (element) => {
    let flag = true
    for (let i = 0; i < this.dataStore.length; i++) {
      if (this.dataStore[i] === element) {
        flag = false
      }
    }
    return flag
  }
  // 返回数组中元素的个数
  this.count = () => {
    return this.dataStore.length
  }
}

// Array.prototype.indexOf = (val) => {
//   for (var i = 0; i < this.length; i++) {
//     if (this[i] === val) return i
//   }
//   return -1
// }
// Array.prototype.remove = (val) => {
//   const index = this.indexOf(val)
//   if (index > -1) {
//     this.splice(index, 1)
//   }
// }

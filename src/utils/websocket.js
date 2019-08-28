// socket功能
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

export function connectionSocket() {
  // 建立连接对象
  const socket = new SockJS('http://10.168.1.130:8088/ws/queueServer')
  // 获取STOMP子协议的客户端对象
  this.stompClient = Stomp.over(socket)
  // 定义客户端的认证信息,按需求配置
  const headers = {
    Authorization: ''
  }
  // 向服务器发起websocket连接
  this.stompClient.connect(headers, () => {
    this.stompClient.subscribe('/ws/queue', (msg) => { // 订阅服务端提供的某个topic
      console.log('广播成功')
      console.log(msg) // msg.body存放的是服务端发送给我们的信息
    }, headers)
  }, (err) => {
    // 连接发生错误时的处理函数
    console.log('失败')
    console.log(err)
  })
}

export function disconnectSocket() {
  if (this.stompClient) {
    this.stompClient.disconnect()
  }
}

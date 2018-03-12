//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  onReady: function (e) {
    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('firstCanvas')
    
    context.setStrokeStyle("#00ff00")
    context.setLineWidth(5)
    context.rect(0, 0, 200, 200)
    context.stroke()

    var img = String(wx.getStorageSync('logs'))
    console.log(img)
    context.drawImage(img, 0, 0, 200, 200)

    // context.setStrokeStyle("#ff0000")
    // context.setLineWidth(2)
    // context.moveTo(160, 100)
    // context.arc(100, 100, 60, 0, 2 * Math.PI, true)
    // context.stroke()
    context.draw()
  }
})

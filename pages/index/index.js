//index.js

//获取应用实例
const app = getApp()
var viewWidth, viewHeight
var k = 1 ,pointNum=0,fontSize;
var pointX = new Array();
var pointY = new Array();
Page({
  data: {
    tips: '欢迎使用',
    tipbody: '点击选择按钮，从相机或相册添加一张照片，点击图片任意位置进行标记，再次点击可以调整大小',
    canvasHeight:'100%',
    canvasWidth:'100%',
    userInfo: {},
    hasUserInfo: false,
    wxCanvas: null //    需要创建一个对象来接受wxDraw对象
  },
  bindtouchstart: function (e) {
    //得到触摸点的坐标
    var startX = e.changedTouches[0].clientX
    var startY = e.changedTouches[0].clientY
    //设置画布数据
    var context = wx.createCanvasContext()
    context.setLineWidth(1.5 / k)
    context.setLineCap('round')
    context.setStrokeStyle("#fff")
    fontSize=30/k
    //根据以往位置，判断对应操作
    for (var i = 0; i < pointNum;i++)
    {
      if (startX/k > (pointX[i] - 20/k) && startX/k < (pointX[i] + 20/k)){
        if (startY/k > (pointY[i] - 20/k) && startY/k < (pointY[i] + 20/k)){
          fontSize = fontSize==(30/k)?(50/k) :
                     fontSize==(50/k)?(80/k):(30/k)
        }
      }
    }

    //让画笔移到鼠标按下的位置
    // context.arc((startX - 3) / k, (startY - 3) / k, 3 / k, 0, 2 * Math.PI, true)
    // context.fill()
    // context.moveTo(startX / k, startY / k)
    // context.lineTo((startX + 30) / k, (startY + 30) / k)
    // context.stroke()
    // context.setFontSize(20 / k)
    // context.fillText('(看这儿)', (startX + 40) / k, (startY + 40) / k)
    context.setFontSize(fontSize)
    context.fillText('👆', startX / k-fontSize/2, startY / k)
    pointNum = pointX.push(startX / k);
    pointY.push(startY / k);
    wx.drawCanvas({
      canvasId: 'firstCanvas',
      reserve: true,
      actions: context.getActions() // 获取绘图动作数组
    })
  },
  bindtouchmove: function (e) {
    //console.log("检测手指点击 之后的移动事件");
    // this.wxCanvas.touchmoveDetect(e);
  },
  bindtouchend: function () {
    //检测手指点击 移出事件
    // this.wxCanvas.touchendDetect();
  },
  //事件处理函数
  onLoad: function(){
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // 用户已经同意功能，后续调用 接口不会弹窗询问
              wx.saveImageToPhotosAlbum
            },
            fail(){
              wx.showModal({
                title: '警告',
                content: '您拒绝了授权,将无法保存编辑后的图片,点击确定重新获取授权。',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        if (res.authSetting["scope.writePhotosAlbum"]) {////如果用户重新同意了授权登录
                        }
                      }, fail: function (res) {
                      }
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  chooseImage: function() {
    var that = this;
    wx.chooseImage({
      count: 1, 
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          tips: ''
        })
        //获取图片尺寸
        wx.getImageInfo({
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          src: res.tempFilePaths[0],
          success: function (resImageInfo) {
            // 使用 wx.createContext 获取绘图上下文 context
            var ctx = wx.createCanvasContext()
            //创建和图片一样大小的画布
            // console.log(resImageInfo.width)
            that.setData({
              canvasHeight: resImageInfo.height,
              canvasWidth: resImageInfo.width
            })
            //获取屏幕尺寸
            wx.getSystemInfo({
              success: function (resSystemInfo) {
                //按比例缩放
                var canvasRatio = resImageInfo.width / resImageInfo.height
                viewWidth = resSystemInfo.screenWidth * 0.96
                viewHeight = resSystemInfo.screenHeight * 0.76
                
                if (canvasRatio > viewWidth / viewHeight){
                  k = viewWidth / resImageInfo.width
                  
                }else{
                  k = viewHeight / resImageInfo.height
                  
                }
                // console.log(k)
                ctx.scale(k,k)
                //action画图
                ctx.drawImage(res.tempFilePaths[0], 0, 0, resImageInfo.width, resImageInfo.height)
              }
            })
            wx.drawCanvas({
              canvasId: 'firstCanvas',
              reserve: true,
              actions: ctx.getActions() // 获取绘图动作数组
            })
          }
        })
      }
    })
  },
  saveImage: function (e) {
    var that = this
    wx.canvasToTempFilePath({
      x: 0,
      y:0,
      width: that.data.canvasWidth*k,
      height: that.data.canvasHeight*k,
      destWidth: that.data.canvasWidth,
      destHeight: that.data.canvasHeight,
      canvasId: 'firstCanvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.navigateTo({
              url: '../logs/logs'
            })
          }
        })
      }
    })
  }
})

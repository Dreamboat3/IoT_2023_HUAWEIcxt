var util = require('../../utils/util.js');
Page({
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
    },
  
    
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
    },
  
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
  
    },
  
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
  
    },
  
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
  
    },
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
  
    },

/**
     * 页面的初始数据
     */
    data: {
        result:'等待进行操作',id:'64ba9642b84c13\n34befb9589_060807',ax:'0',ay:'0',az:'0',st:'0',la:'"0"',lo:'"0"',temp:'0',lat:0,lon:0,
        time:'NA',timer:'',
        markers: [ //标志点的位置
            //位置0
            {
              id: 0,
              iconPath: "/images/selected_index.png",
              latitude: "0",
              longitude: "0",
              width: 28,
              height: 32
            }]
        
    },

gettoken:function()
{
    console.log("开始获取。。。");//打印完整消息
    var that=this;
    wx.request({
        url:'https://iam.cn-north-4.myhuaweicloud.com/v3/auth/tokens',
        data:'{"auth": {"identity": {"methods": ["password"],"password": {"user": {"name": "test","password": "test123456","domain": {"name": "hw038474682"}}}},"scope": {"project": {"name": "cn-north-4"}}}}',
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {'content-type': 'application/json'}, // 设置请求的 header 
        success: function(res){// success
            // success
            console.log("获取token成功");//打印完整消息
            console.log(res);//打印完整消息
            var token='';
            token=JSON.stringify(res.header['X-Subject-Token']);//解析消息头token
            token=token.replaceAll("\"", "");
            wx.setStorageSync('token',token);//把token写到缓存中,以便可以随时随地调用
        },
        fail:function(){
            // fail
            console.log("获取token失败");//打印完整消息
            that.setData({result:'刷新参数和数据失败'});
        },
        complete: function() {
            // complete
            console.log("获取token完成");//打印完整消息
        } 
    });
},

getshadow:function(){
    console.log("开始获取影子");//打印完整消息
    var that=this;
    var token=wx.getStorageSync('token');//读缓存中保存的token
    wx.request({
        url: 'https://ad6c403b9e.st1.iotda-app.cn-north-4.myhuaweicloud.com:443/v5/iot/acc46a22c95b4b698483139e6f85df6f/devices/64ba9642b84c1334befb9589_060807/shadow',
        data:'',
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {'content-type': 'application/json','X-Auth-Token':token }, //请求的header 
        success: function(res){// success
          // success
            console.log(res);//打印完整消息
            var shadow=JSON.stringify(res.data.shadow[0].reported.properties);//提取设备影子
            console.log('设备影子数据：'+shadow);
            var Accel_x=JSON.stringify(res.data.shadow[0].reported.properties.Accel_x);//提取各项数据
            var Accel_y=JSON.stringify(res.data.shadow[0].reported.properties.Accel_y);
            var Accel_z=JSON.stringify(res.data.shadow[0].reported.properties.Accel_z);
            var Cable_Status=JSON.stringify(res.data.shadow[0].reported.properties.Cable_Status);
            var Latitude=JSON.stringify(res.data.shadow[0].reported.properties.Latitude);
            var Longitude=JSON.stringify(res.data.shadow[0].reported.properties.Longitude);
            var Temperature=JSON.stringify(res.data.shadow[0].reported.properties.Temperature);
            console.log('加速度X='+Accel_x);
            console.log('加速度Y='+Accel_y);
            console.log('加速度Z='+Accel_z);
            console.log('电缆状态='+Cable_Status);
            console.log('纬度='+Latitude+'°');
            console.log('经度='+Longitude+'°');
            console.log('温度='+Temperature+'℃');
            that.setData({markers:[]})//清除标记点
            var lat = parseFloat(Latitude.slice(1,-2));
            var lon = parseFloat(Longitude.slice(1,-2));//规格化经纬度数据
            that.setData({ax:Accel_x,ay:Accel_y,az:Accel_z,st:Cable_Status,la:lat,lo:lon,temp:Temperature});//更新各项数据
            that.setData({markers:[{id: 0,iconPath: "/images/selected_index.png",latitude: lat,longitude: lon,width: 28,height: 32}]});//更新标记点
            that.setData({result:'刷新参数和数据成功'});
        },
        fail:function(){
            // fail
            console.log("获取影子失败");//打印完整消息
            that.setData({result:'刷新参数和数据失败'});
        },
        complete: function() {
            // complete
            console.log("获取影子完成");//打印完整消息
        } 
    });
},

renew:function(){//刷新按钮回调函数
    this.gettoken();
    this.getshadow();
    this.formatTime();
    console.log("刷新完成");
},

settime:function(){//自动刷新
    var tim = setInterval(()=>{
        this.gettoken();
        this.getshadow();
        this.formatTime();
        console.log("自动刷新完成");
    },5000)  //delayTime是延迟时间，以毫秒为单位，1000ms=1s
    this.setData({timer:tim});
},

clotime:function(){//关闭自动刷新
    var that = this;
    clearInterval(that.data.timer);
},

switchchange1:function(e){//自动刷新切换开关
    //拿到状态
    var status=e.detail.value
    if(status==true){
        this.settime();
        console.log("自动刷新开启");
        this.setData({result:'自动刷新开启'});
    }else{
        this.clotime();
        console.log("自动刷新关闭");
        this.setData({result:'自动刷新关闭'});
    }
},

reset:function(){//重置电缆
    console.log("开始下发命令。。。");//打印完整消息
    var that=this;
    var token=wx.getStorageSync('token');//读缓存中保存的token
    wx.request({
        url: 'https://ad6c403b9e.st1.iotda-app.cn-north-4.myhuaweicloud.com:443/v5/iot/acc46a22c95b4b698483139e6f85df6f/devices/64ba9642b84c1334befb9589_060807/commands',
        data:'{"service_id": "Cable_anti-stealing","command_name": "reset","paras": {"cable_status": "SAFE"}}',
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {'content-type': 'application/json','X-Auth-Token':token }, //请求的header 
        success: function(res){// success
            // success
            console.log("下发命令成功");//打印完整消息
            console.log(res);//打印完整消息
        },
        fail:function(){
            // fail
            console.log("命令下发失败");//打印完整消息
            console.log("请先获取token");//打印完整消息
        },
        complete: function() {
            // complete
            console.log("命令下发完成");//打印完整消息
            that.setData({result:'设备命令下发完成'});
        } 
    });
},

start:function(){//开始布控
    console.log("开始下发命令。。。");//打印完整消息
    var that=this;
    var token=wx.getStorageSync('token');//读缓存中保存的token
    wx.request({
        url: 'https://ad6c403b9e.st1.iotda-app.cn-north-4.myhuaweicloud.com:443/v5/iot/acc46a22c95b4b698483139e6f85df6f/devices/64ba9642b84c1334befb9589_060807/commands',
        data:'{"service_id": "Cable_anti-stealing","command_name": "autoControl","paras": {"alarm": "ON"}}',
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {'content-type': 'application/json','X-Auth-Token':token }, //请求的header 
        success: function(res){// success
            // success
            console.log("下发命令成功");//打印完整消息
            console.log(res);//打印完整消息
        },
        fail:function(){
            // fail
            console.log("命令下发失败");//打印完整消息
            console.log("请先获取token");//打印完整消息
        },
        complete: function() {
            // complete
            console.log("命令下发完成");//打印完整消息
            that.setData({result:'设备命令下发完成'});
        } 
    });
},

stop:function(){//停止布控
    console.log("开始下发命令。。。");//打印完整消息
    var that=this;
    var token=wx.getStorageSync('token');//读缓存中保存的token
    wx.request({
        url: 'https://ad6c403b9e.st1.iotda-app.cn-north-4.myhuaweicloud.com:443/v5/iot/acc46a22c95b4b698483139e6f85df6f/devices/64ba9642b84c1334befb9589_060807/commands',
        data:'{"service_id": "Cable_anti-stealing","command_name": "autoControl","paras": {"alarm": "OFF"}}',
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {'content-type': 'application/json','X-Auth-Token':token }, //请求的header 
        success: function(res){// success
            // success
            console.log("下发命令成功");//打印完整消息
            console.log(res);//打印完整消息
        },
        fail:function(){
            // fail
            console.log("命令下发失败");//打印完整消息
            console.log("请先获取token");//打印完整消息
        },
        complete: function() {
            // complete
            console.log("命令下发完成");//打印完整消息
            that.setData({result:'设备命令下发完成'});
        } 
    });
},

switchchange:function(e){//自动布控开关
    //拿到状态
    var status=e.detail.value
    if(status==true){
        this.start();
        console.log("正在下发布控命令...");
    }else{
        this.stop();
        console.log("正在下发停止布控命令...");
    }
},

formatTime:function () {//获取时间戳
    var that = this;
    var date = new Date()
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    that.setData({time: year + "年" + month + "月" + day + "日" + hour + "时" + minute + "分" + second + "秒"});
}

})




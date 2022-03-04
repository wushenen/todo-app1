// pages/personal/personal.js
import request from '../../utils/request'
let startY = 0;//手指起始坐标
let moveY = 0;//手指移动坐标
let moveDistance = 0;//手指移动距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: '',
    userInfo: {},
    recentPlayList: [],//播放记录
    isLogin: false //控制退出登录显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取用户基本信息
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      //更新用户信息
      this.setData({
        userInfo: JSON.parse(userInfo),
        isLogin: true
      })
      //播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId)
    }
  },

  //获取用户播放记录
  async getUserRecentPlayList(userId){
    let recentPlayListData = await request('/user/record',{uid: userId,type: 0});
    let index = 0;
    let recentPlayList = recentPlayListData.allData.splice(0,10).map(item=>{
      item.id = index++;
      return item;
    })
    this.setData({
      recentPlayList: recentPlayList
    })
  },

  handleTouchStart(event){
    this.setData({
      coverTransition: ''
    })
    //起始手指坐标
    startY = event.touches[0].clientY;
  },
  handleTouchMove(event){
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;

    if(moveDistance <= 0){
      return;
    }
    if(moveDistance >= 80){
      moveDistance = 80;
    }

    //动态更新coverTransform
    this.setData({
      coverTransform: 'translateY('+moveDistance+'rpx)'
    })
  },
  handleTouchEnd(){
        //重置coverTransform
        this.setData({
          coverTransform: 'translateY(0)',
          coverTransition: 'transform 1s linear'
        })
  },
  //登录跳转
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  //退出登录
  logout(){
    //服务端退出登录状态
    let status = request('/logout');
    console.log(status)
    //删除客户端信息
    wx.removeStorageSync('userInfo')
    this.setData({
      userInfo: {},
      isLogin: false
    })
    wx.navigateTo({
      url: '/pages/login/login',
    })
    wx.showToast({
      title: '退出登录',
      icon: 'success'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
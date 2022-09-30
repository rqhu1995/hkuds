Page({
    data: {
        showTogether: false,     //控制弹出层是否弹出的值
        showMealChoice: false,     //控制弹出层是否弹出的值
        showLocationChoice: false,    //控制弹出层是否弹出的值
        yesOrNo: ['Yes', 'No'],   //选择器中的值
        meal_choices: ['叙利亚', '大快活', '湘聚小厨', 'SU', '太古', '美心', '香江病逝', '大奥病逝', '其他'],
        location_choices: ['RSC', '家', '任白楼', '其他'],
        together: '',        //选择性别之后的值进行页面显示
        meal_choice: '',
        location_choice: '',
        usrname:''
    },
    onLoad: function(options) {
      // Do some initialize when page load.
      wx.cloud.init()
      const testDB = wx.cloud.database({
        env: 'hkueatdb-7gjd9bwrb8c0dcf5'
      })
    },
    onChange(event) {
        // event.detail 为当前输入的值
        console.log(event.detail);
    },
    meal_choosing: function () {
        var that = this;
        wx.navigateTo({
            url: '../eat_choice/eat_choice',
            events: {
                getData: function (data) {
                    that.setData({ meal_choice: data });
                }
            }
        })
    },
    where: function () {
        var that = this;
        wx.navigateTo({
            url: '../whereami/whereami',
            events: {
                getData: function (data) {
                    that.setData({ location_choice: data });
                }
            }
        })
    },
    showPopupTogether(e) {      //点击选择性别，打开弹出层（选择器）
        this.setData({ showTogether: true })
    },
    onCloseTogether() {     //点击空白处开闭弹出层（选择器）及选择器左上角的取消
        this.setData({ showTogether: false });
    },
    onConfirmTogether(e) {    //选择器右上角的确定，点击确定获取值
        this.setData({
            together: e.detail.value,
            showTogether: false
        })
    },
    setUserName(e){
      this.setData({usrname: e.detail.value})
    },

    getOtherMealChoice(e){
      this.setData({meal_choice: e.detail.value})
    },

    showPopupMealChoice(e) {      //点击选择性别，打开弹出层（选择器）
        this.setData({ showMealChoice: true })
    },
    onCloseMealChoice() {     //点击空白处开闭弹出层（选择器）及选择器左上角的取消
        this.setData({ showMealChoice: false });
    },
    onConfirmMealChoice(e) {    //选择器右上角的确定，点击确定获取值
        this.setData({
            meal_choice: e.detail.value,
            showMealChoice: false
        })
    },
    showPopupLocationChoice(e) {      //点击选择性别，打开弹出层（选择器）
        this.setData({ showLocationChoice: true })
    },
    onCloseLocationChoice() {     //点击空白处开闭弹出层（选择器）及选择器左上角的取消
        this.setData({ showLocationChoice: false });
    },
    onConfirmLocationChoice(e) {    //选择器右上角的确定，点击确定获取值
        this.setData({
            location_choice: e.detail.value,
            showLocationChoice: false
        })
    },
    // 小程序使用Promise同步发送get请求
    addData: function (db) {
        var that = this;
        var tg = null;
        if(that.data.together === "Yes"){
          tg = true;
        }else{
          tg = false;
        }
        db.collection('eating').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            "name": that.data.usrname,
            "together":tg,
            "location":that.data.location_choice,
            "preference":that.data.meal_choice
          }
        })
        .then(res => {
          console.log(res);
        })
    },
    // 调用getData发送http请求并返回结果
    submit(){
        var that = this;
        if(that.data.usrname.length < 1){
          wx.showModal({
            title: '提示',
            content: '名字没写啊...',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          this.onLoad();
        }else{
        wx.cloud.init()
        const testDB = wx.cloud.database({
          env: 'hkueatdb-7gjd9bwrb8c0dcf5'
        })
        testDB.collection('eating').where({
          name: that.data.usrname
      }).get().then(res => {
        console.log(res.data)
        if(res.data.length > 0){
          wx.showModal({
            title: '提示',
            content: that.data.usrname + "已经提交过啦",
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          that.addData(testDB);
          wx.showModal({
            title: '提示',
            content: that.data.usrname + "提交成功",
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '../display_result/display_result',
              })
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.navigateTo({
                  url: '../display_result/display_result',
              })
              }
            }
          })
        }
      })
      }
    },
    goToResult(){
        wx.navigateTo({
            url: '../display_result/display_result',
        })
    }
   })

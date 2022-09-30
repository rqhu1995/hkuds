
var wxCharts = require('./wxcharts.js');
Page({
    data: {
        listData: [],
        listNotTogether: [],
        category: [],
        data_count: []
    },
    onLoad: function () {
        var that = this;
        wx.cloud.init()
        const testDB = wx.cloud.database({
            env: 'hkueatdb-7gjd9bwrb8c0dcf5'
        })
        testDB.collection('eating').where({
            together: true
        }).get().then(res => {
            that.setData({ listData: res.data })
            testDB.collection('eating').where({
                together: false
            }).get().then(res => {
                that.setData({ listNotTogether: res.data })
                var category2 = [];
                testDB.collection('eating')
                    .aggregate()
                    .sortByCount('$preference')
                    .end().then(res => {
                        for (let i = 0; i < res.list.length; i++) {
                            if (res.list[i]._id.length >= 1) {
                                category2.push(res.list[i]._id);
                                that.data.data_count.push(res.list[i].count);
                            }
                        }
                        that.setData({ category: category2 });
                        console.log("setting category OK...")
                        console.log(that.data.listData)
                        console.log(that.data.category)
                        console.log(that.data.data_count)
                        // plot using wxCharts, catch error if any
                        try {
                            if(that.data.listData.length > 0){
                            new wxCharts({
                                canvasId: 'columnCanvas',
                                type: 'column',
                                categories: that.data.category,
                                series: [{
                                    name: '意向',
                                    data: that.data.data_count
                                }],
                                yAxis: {
                                    format: function (val) {
                                        return val;
                                    }
                                },
                                width: 320,
                                height: 150
                            });
                        }
                    }
                        catch (e) {
                            console.log(e);
                        }
                        console.log("plot ok...");
                    })
            })
        })
    },
    removeOneData: function (e) {
        var id = e.currentTarget.dataset.id;
        var that = this;
        wx.cloud.init()
        const testDB = wx.cloud.database({
            env: 'hkueatdb-7gjd9bwrb8c0dcf5'
        })
        testDB.collection('eating').doc(id).remove().then(res => {
            wx.showModal({
                title: '提示',
                content: '记录删除成功，即将返回重填',
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        wx.navigateTo({
                            url: '../home/home',
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        })
    }
})
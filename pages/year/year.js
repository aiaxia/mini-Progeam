let env = getApp().environment;
Page({
  data: {
    yearList: [ ]
  },
  onLoad: function (options) {
    let t = this;
    wx.setNavigationBarTitle({
      title: '选择年款'
    });
    
    // 全部年款
    wx.request({
      url: 'http://vehicle-model-dev.cdd.group/app/vehicle/genreation/year/model/byBrandIdAndSeriesId?seriesId='+env.seriesId+'&brandId='+env.brandId, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        t.setData({
          yearList: res.data.data.content
        })
      }
    })
  },
  onClickyear(e){
    console.log(e.currentTarget.dataset)
    console.log(env)
  }
})
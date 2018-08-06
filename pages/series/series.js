let env = getApp().environment;
Page({
  data: {
    styles:[],
    series: [],
    suppleNum: undefined
  },
  onLoad: function () {
    let t = this;
    wx.setNavigationBarTitle({
      title: env.brandName
    });
    // 车型
    wx.request({
      url: 'http://vehicle-model-dev.cdd.group/app/vehicle/brand/selectVlByBrandId/'+env.brandId,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        t.setData({
          styles: res.data.data
        },function(){
          let stylesLen = t.data.styles.length;
          t.setData({
            suppleNum: 3-(stylesLen-(Math.floor(stylesLen/3)*3))
          })
        });
        
        // 车系
        wx.request({
          url: 'http://vehicle-model-dev.cdd.group/app/vehicle/series/byBrandIdAndLevel?brandId='+env.brandId+'&vehicleLevel='+res.data.data[0],
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            console.log(res.data.data.content)
            t.setData({
              series: res.data.data.content
            })
          }
        });
      }
    });
  },
  // 点击车系
  onClickseries(e){
    env.seriesId = e.currentTarget.dataset.id;
    env.seriesName = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../year/year'
    })
  },
  onChoicestyle(e){
    let t = this;
    // 车系
    wx.request({
      url: 'http://vehicle-model-dev.cdd.group/app/vehicle/series/byBrandIdAndLevel?brandId='+env.brandId+'&vehicleLevel='+e.currentTarget.dataset.style,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        t.setData({
          series: res.data.data.content
        })
      }
    });
  }
})
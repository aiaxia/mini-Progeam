let env = getApp().environment;
Page({
  data: {
    // 当前选择的导航字母
    selected: 0,
    // 选择字母视图滚动的位置id
    scrollIntoView: 'A',
    // 导航字母
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
      'U', 'V', 'W', 'X', 'Y', 'Z'
    ],
    groups: [{
        groupName: 'A',
        users: []
      },
      {
        groupName: 'B',
        users: []
      },
      {
        groupName: 'C',
        users: []
      },
      {
        groupName: 'D',
        users: []
      },
      {
        groupName: 'E',
        users: []
      },
      {
        groupName: 'F',
        users: []
      },
      {
        groupName: 'G',
        users: []
      },
      {
        groupName: 'H',
        users: []
      },
      {
        groupName: 'I',
        users: []
      },
      {
        groupName: 'J',
        users: []
      },
      {
        groupName: 'K',
        users: []
      },
      {
        groupName: 'L',
        users: []
      },
      {
        groupName: 'M',
        users: []
      },
      {
        groupName: 'N',
        users: []
      },
      {
        groupName: 'O',
        users: []
      },
      {
        groupName: 'P',
        users: []
      },
      {
        groupName: 'Q',
        users: []
      },
      {
        groupName: 'R',
        users: []
      },
      {
        groupName: 'S',
        users: []
      },
      {
        groupName: 'T',
        users: [ ]
      },
      {
        groupName: 'U',
        users: []
      },
      {
        groupName: 'V',
        users: []
      },
      {
        groupName: 'W',
        users: []
      },
      {
        groupName: 'X',
        users: [ ]
      },
      {
        groupName: 'Y',
        users: []
      },
      {
        groupName: 'Z',
        users: []
      }
    ]
  },
  onLoad: function (options) {
    let t = this;
    const res = wx.getSystemInfoSync(),
          letters = this.data.letters;

    // 全部品牌接口
    wx.request({
      url: 'http://vehicle-model-dev.cdd.group/app/vehicle/brand', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        let arr = t.data.groups;
        arr.map((el)=>{
          el.users = res.data.data.filter(v=> v.beginWith==el.groupName);
        });
        arr.map((el,i)=>{
          if(!el.users.length){
            delete arr[i]
          }
        })

        t.setData({ groups: arr });
      }
    })
    // 设备信息
    this.setData({
      windowHeight: res.windowHeight,
      windowWidth: res.windowWidth,
      pixelRatio: res.pixelRatio
    });
    // 第一个字母距离顶部高度，css中定义nav高度为94%，所以 *0.94
    const navHeight = this.data.windowHeight * 0.94, // 
      eachLetterHeight = navHeight / 26,
      comTop = (this.data.windowHeight - navHeight) / 2,
      temp = [];

    this.setData({
      eachLetterHeight: eachLetterHeight
    });

    // 求各字母距离设备左上角所处位置

    for (let i = 0, len = letters.length; i < len; i++) {
      const x = this.data.windowWidth - (10 + 50) / this.data.pixelRatio,
        y = comTop + (i * eachLetterHeight);
      temp.push([x, y]);
    }
    this.setData({
      lettersPosition: temp
    })

    wx.setNavigationBarTitle({
      title: '选择品牌'
    });
  },
  tabLetter(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selected: index,
      scrollIntoView: index
    })

    this.cleanAcitvedStatus();
  },
  // 清除字母选中状态
  cleanAcitvedStatus() {
    setTimeout(() => {
      this.setData({
        selected: 0
      })
    }, 500);
  },
  //点击品牌
  onChoicebrand(e){
    env.brandId = e.currentTarget.dataset.id;
    env.brandName = e.currentTarget.dataset.name;
    console.log(e)
    wx.navigateTo({
      url: '../series/series'
    })
  },
  touchmove(e) {
    const x = e.touches[0].clientX,
      y = e.touches[0].clientY,
      lettersPosition = this.data.lettersPosition,
      eachLetterHeight = this.data.eachLetterHeight,
      letters = this.data.letters;
    // 判断触摸点是否在字母导航栏上
    if (x >= lettersPosition[0][0]) {
      for (let i = 0, len = lettersPosition.length; i < len; i++) {
        // 判断落在哪个字母区域，取出对应字母所在数组的索引，根据索引更新selected及scroll-into-view的值
        const _y = lettersPosition[i][1], // 单个字母所处高度
          __y = _y + eachLetterHeight; // 单个字母最大高度取值范围
        if (y >= _y && y <= __y) {
          this.setData({
            selected: letters[i],
            scrollIntoView: letters[i]
          });
          break;
        }
      }
    }
  },
  touchend(e) {
    this.cleanAcitvedStatus();
  }
})
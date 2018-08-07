
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
let env = getApp().environment;

Page({
    data: {
        img: {
            src: '',
            mode: 'aspectFill',
        },
        car:{},
        rank: '',
        minEstimate: '',
        maxEstimate: '',
        apply_id: '',
        originalPrice:'',
        curIndex: '2',
        minPrice: '',
        maxPrice: '',
    },

    onLoad: function() {
        console.log('env',env)
        this.setData({car:env})
        this.rankComponent = this.selectComponent('#rank-mychart-dom-line');
        this.futureComponent = this.selectComponent('#future-mychart-dom-line');
        this.init_rankbar();
        this.init_futurebar();
        const car = this.data.car;

        // 获取车辆原始价格
        let t = this;
        wx.request({
            // url: 'http://vehicle-model-dev.cdd.group/vehicle/spec/brief?levelId=CSC0815M0117&page=0&size=10',
            url: 'http://vehicle-model-dev.cdd.group/vehicle/spec/brief?levelId='+car.levelId+'&page=0&size=10',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                t.setData({originalPrice:'10'},function(){
                    t.init_futurebar();
                    t.getPriceData();
                });
            }
        })
    },

    init_rankbar: function (){
        this.rankComponent.init((canvas, width, height) => {
            const barChart = echarts.init(canvas, null, {
                width: width,
                height: height
            });
            barChart.setOption(this.getRankOption());
            return barChart;
        });
    },

    init_futurebar: function (){
        this.futureComponent.init((canvas, width, height) => {
            const barChart = echarts.init(canvas, null, {
                width: width,
                height: height
            });
          barChart.setOption(this.getFutureOption());
          return barChart;
        });
    },

    getRankOption: function() {
          let option = {
            tooltip: {},
            xAxis: {
                type: 'category',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(153,153,153,1)',
                    }
                }
            },
            yAxis: {
                type: 'value',
                show: false,
                max: 50
            },
            grid: {
                // width: '200px',
                show: false,
            },
            series: [{
                name: '价格',
                type: 'bar',
                barWidth: '40px',
                data: [this.data.rank],
                color:'rgba(189,8,28,0.1)',
                label: {
                    normal: {
                        position: 'top',
                        show: true,
                        color: '#BD081C'
                    }
                },
            }]
            };
        return option;
    },

    getFutureOption: function() {
        let date = new Date();
        let currentYear = date.getFullYear();
        const originalPrice = this.data.originalPrice;
        const data = [(originalPrice*0.8).toFixed(2), (originalPrice*Math.pow(0.8,2)).toFixed(2), (originalPrice*Math.pow(0.8,3)).toFixed(2), (originalPrice*Math.pow(0.8,4)).toFixed(2), (originalPrice*Math.pow(0.8,5)).toFixed(2)] 
        let option = {
            tooltip: {},
            xAxis: {
                type: 'category',
                data: [ `${currentYear}年`, `${currentYear+1}年`, `${currentYear+2}年`, `${currentYear+3}年`, `${currentYear+4}年` ],
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(153,153,153,1)',
                    }
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                show: false,
                // max: 10
    
            },
            grid: {
                show: false,
            },
            series: [{
                name: '销量',
                type: 'bar',
                data: data,
                label: {
                    normal: {
                        position: 'top',
                        show: true,
                        color: '#BD081C'
                    }
                },
                color:'rgba(189,8,28,0.1)',
            }]
        };
        return option;
    },

    // 获取车辆排行，最低和最高价
    getPriceData: function() {
        let t = this;
        let car = t.data.car;
        car.brandId = car.brandId.toString();
        car.seriesId = car.seriesId.toString();
        car.phone = car.phone.replace(/\s/ig,'');
        car.licenseCity = car.licenseCity.replace('市','');
        car.licenseCity = car.licenseCity.replace('省','');
        car.originalPrice = t.data.originalPrice;
        delete car.userPhone;
        delete car.multiIndex;

        wx.request({
            url: 'http://192.168.1.67:8081/apply/send',
            data: car,
            method:'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res.data);
                const minEstimate = parseFloat(res.data.minEstimate);
                const maxEstimate = parseFloat(res.data.maxEstimate);
                t.setData({
                    rank: res.data.rank,
                    minEstimate: minEstimate,
                    maxEstimate: maxEstimate,
                    minPrice: t.handlePrice(minEstimate),
                    maxPrice: t.handlePrice(maxEstimate),
                    apply_id: res.data.apply_id,
                },function(){
                    t.init_rankbar();
                });
            }
        })
    },

    // 参考价格车商状况
    toggleTab: function (e) {
        let dataId = e.currentTarget.id;
        this.setData({
            curIndex: dataId
        })
        let minPrice,maxPrice;
        let {minEstimate, maxEstimate} = this.data;
        if(this.data.curIndex == '1') {
            minPrice = this.handlePrice( minEstimate*0.8 );
            maxPrice = this.handlePrice( maxEstimate*0.95 );
        } 
        else if(this.data.curIndex == '2') {
            minPrice = this.handlePrice( minEstimate );
            maxPrice = this.handlePrice( maxEstimate );
        }
        else if(this.data.curIndex == '3') {
            minPrice = this.handlePrice( minEstimate*1.1 );
            maxPrice = this.handlePrice( maxEstimate*1.5 );
        }
        this.setData({
            minPrice: minPrice,
            maxPrice: maxPrice
        })
    },
    
    // 查看精准报价
    submit: function(){
        const data = {"applyId": this.data.apply_id, "name":"", "mobile":"env.userPhone"}
        wx.request({
            url: 'http://192.168.1.170:8081/query/intoRedis',
            data: data,
            method:'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                if (res.status == "1") {
                    notification['success']({
                        message: '提交成功，稍后会有客服人员联系',
                        description: '',
                    });
                } else if (res.status == "0"){
                    notification['error']({
                        message: res.Msg,
                        description: '',
                    });
                }
            }
        })
    },

    // 处理价格 四舍五入保留一位小数
    handlePrice: function (a) {
        a = a * Math.pow(10, 1);
	    return (Math.round(a)) / (Math.pow(10, 1));
    }
  })
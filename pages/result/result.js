
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();


Page({
    data: {
        img: {
            src: '',
            mode: 'aspectFill',
        },

        rank: '',
        minEstimate: '',
        maxEstimate: '',
        apply_id: '',
        originalPrice:'',
        
    },

    onLoad: function() {
        this.rankComponent = this.selectComponent('#rank-mychart-dom-line');
        this.fetrueComponent = this.selectComponent('#futrue-mychart-dom-line');
        this.init_rankbar();
        this.init_fetruebar();

        let t = this;
        wx.request({
            url: 'http://vehicle-model-dev.cdd.group/vehicle/spec/brief?levelId=CSC0815M0117&page=0&size=10',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
              console.log(res.data);
              t.setData({originalPrice:'10'},function(){
                t.init_fetruebar();
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

    init_fetruebar: function (){
        this.fetrueComponent.init((canvas, width, height) => {
        const barChart = echarts.init(canvas, null, {
            width: width,
            height: height
          });
          barChart.setOption(this.getFetrueOption());
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

    getFetrueOption: function() {
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

    getPriceData: function() {
        let t = this;
        wx.request({
            url: 'http://192.168.1.67:8081/apply/send',
            data:{
                "brandId":"2",
                "brandName":"GMC",
                "seriesId":"150",
                "seriesName":"4343",
                "levelId":"fad",
                "timeModel":"2017",
                "timeModelName":"123",
                "firstLicenseTime":"2016年7月",
                "licenseCity":"北京 北京",
                "mileage":"15",
                "phone":"13165657878",
                "originalPrice":"10",
            },
            method:'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
              console.log(res.data);
              t.setData({
                rank: res.data.rank,
                minEstimate: res.data.minEstimate,
                maxEstimate: res.data.maxEstimate,
                apply_id: res.data.apply_id,
                },function(){
                    t.init_rankbar();
                });
            }
        })
    }
    
  })
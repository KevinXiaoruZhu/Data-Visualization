/**
 * Created by xiaoru_zhu on 2018/5/9.
 */
// 基于准备好的dom，初始化echarts实例
var dom0 = document.getElementById("graph0");
var myChart0 = echarts.init(dom0, 'vintage');
var dom1 = document.getElementById("graph1");
var myChart1 = echarts.init(dom1, 'macarons');
var dom2 = document.getElementById("graph2");
var myChart2 = echarts.init(dom2, 'vintage');
var dom3 = document.getElementById("graph3");
var myChart3 = echarts.init(dom3, 'macarons');
var dom4 = document.getElementById("graph4");
var myChart4 = echarts.init(dom4, 'vintage');

/*
var dom = document.getElementById("graph");
var myChart = echarts.init(dom);
var dom = document.getElementById("graph");
var myChart = echarts.init(dom);
var dom = document.getElementById("graph");
var myChart = echarts.init(dom);
var dom = document.getElementById("graph");
var myChart = echarts.init(dom);
*/

option0 = null;
option1 = null;
option2 = null;
option3 = null;
option4 = null;
console.log('a');

// 定义变量
var attrs0 = [];
var data0 = [];
var attrs1 = [];
var data1 = [];
var attrs2 = [];
var data2 = [];
var attrs3 = [];
var data3 = [];
var attrs4 = [];
var data4 = [];

function getObjectKeys(object)
{
    var keys = [];
    for (var property in object)
      keys.push(property);
    return keys;
}

function getObjectValues(object)
{
    var values = [];
    for (var property in object)
      values.push(object[property]);
    return values;
}

function getOptionConfig(title, tooltip, legendData, xAxis, seriesName, seriesType, seriesData) {
    return {
        title: {
            text: title,
            textStyle: {
                fontWeight: 'bold',
                fontStyle: 'italic',
                fontSize: 21,
                fontFamily: 'monospace'
            },
            x: 'left'
        },
        tooltip: tooltip,
        dataZoom: [
            {
                type: 'slider',
                xAxisIndex: 0,
                start: 0,
                end: 40
            },
            // {
            //     type: 'inside', // 缩放类型
            //     xAxisIndex: 0,
            //     start: 10,
            //     end: 60
            // },
            {
                type: 'slider',
                yAxisIndex: 0,
                start: 0,
                end: 100
            }
            // {
            //     type: 'inside', //缩放类型
            //     yAxisIndex: 0,
            //     start: 30,
            //     end: 80
            // }
        ],
        legend: {
            data: legendData
        },
        xAxis: {
            data: xAxis
        },
        yAxis: {},
        series: [{
            name: seriesName,
            type: seriesType,
            data: seriesData
        }]
    };
}

$("#total").html("Annual Sales: 22243 times");

$.get('/getData').done(function(g_data) {
    g_data = $.parseJSON(g_data);

    //g_data = g_data[0];
    attrs0 = getObjectKeys(g_data[0]);
    data0 = getObjectValues(g_data[0]);
    option0 = getOptionConfig('Division: Neighbor -- unit:times', {},['volume'], attrs0, 'volume', 'bar', data0);

    //g_data = g_data[1];
    attrs1 = getObjectKeys(g_data[1]);
    data1 = getObjectValues(g_data[1]);
    console.log(attrs1);
    option1 = getOptionConfig('Division: Building Class -- unit:times', {},['volume'], attrs1, 'volume', 'bar', data1);

    attrs2 = getObjectKeys(g_data[2]);
    data2 = getObjectValues(g_data[2]);
    option2 = getOptionConfig('Division: Unit Number -- unit:times', {/*formatter:'{c}次'*/},['volume'], attrs2, 'volume', 'bar', data2);

    attrs3 = getObjectKeys(g_data[3]);
    data3 = getObjectValues(g_data[3]);
    for(var i = 0; i < attrs3.length; ++i){
        attrs3[i] = String(attrs3[i]) + '月';
    }
    option3 = getOptionConfig('Division: sale_month -- unit:times', {},['volume'], attrs3, 'volume', 'line', data3);

    attrs4 = getObjectKeys(g_data[4]);
    data4 = getObjectValues(g_data[4]);
    option4 = getOptionConfig('Division: Built year -- unit:times', {},['volume'], attrs4, 'volume', 'bar', data4);
    // 指定图表的配置项和数据
    /*
    option0 = {
        title: {
            text: '示例'
        },
        tooltip: {},
        legend: {
            data:['销量']
        },
        xAxis: {
            data: attrs
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: data
        }]
    };
    */
    myChart0.setOption(option0);
    myChart1.setOption(option1);
    myChart2.setOption(option2);
    myChart3.setOption(option3);
    myChart4.setOption(option4);
});

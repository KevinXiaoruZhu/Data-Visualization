/**
 * Created by xiaoru_zhu on 2018/5/11.
 */

// 基于准备好的dom，初始化echarts实例
var dom5 = document.getElementById("graph5");
var myChart5 = echarts.init(dom5, 'vintage');
var dom6 = document.getElementById("graph6");
var myChart6 = echarts.init(dom6, 'macarons');
var dom7 = document.getElementById("graph7");
var myChart7 = echarts.init(dom7, 'vintage');

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

option5 = null;
option6 = null;
option7 = null;

console.log('a');

// 定义变量
var attrs5 = [];
var data5 = [];
var attrs6 = [];
var data6 = [];
var attrs7 = [];
var data7 = [];

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
            {
                type: 'slider',
                yAxisIndex: 0,
                start: 0,
                end: 100
            }
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

$.get('/getData').done(function(g_data) {
    g_data = $.parseJSON(g_data);

    //g_data = g_data[0];
    attrs5 = getObjectKeys(g_data[5]);
    data5 = getObjectValues(g_data[5]);
    option5 = getOptionConfig('划分:Neighbor--单位:Dollars/feet^2', {},['价格'], attrs5, '价格', 'bar', data5);

    //g_data = g_data[1];
    attrs6 = getObjectKeys(g_data[6]);
    data6 = getObjectValues(g_data[6]);
    option6 = getOptionConfig('划分:Building Class--单位:Dollars/feet^2', {},['价格'], attrs6, '价格', 'bar', data6);

    attrs7 = getObjectKeys(g_data[7]);
    data7 = getObjectValues(g_data[7]);
    option7 = getOptionConfig('划分:Built year--单位:Dollars/feet^2', {},['价格'], attrs7, '价格', 'bar', data7);

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
    myChart5.setOption(option5);
    myChart6.setOption(option6);
    myChart7.setOption(option7);
});

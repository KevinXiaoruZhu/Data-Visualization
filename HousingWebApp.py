#! /anaconda3/bin/python
# coding=utf-8
from scapy.all import *
from flask import Flask, request, render_template, redirect, make_response, flash, session, g, url_for
import json
import time
import predict_module
from pyspark import SparkContext, SparkConf, StorageLevel

app = Flask(__name__)

conf = SparkConf().setMaster('local').setAppName('Housing Price Prediction App')
sc = SparkContext(conf=conf)

def load_json_to_dict(path):
    with open(str(path), 'r') as load_f:
        d = json.load(load_f)
    return d

json_list = []
#test_data_dict = {'bay':2345, 'washington':5622, 'eastal':4973, 'santa':8761, 'walnut':7639}
# statistic
neighbor_st_dict = load_json_to_dict('/Users/xiaoru_zhu/PycharmProjects/HousingPriceDA/HousingAnalysis/Results/neighbor_st.json')
building_class_st_dict = load_json_to_dict('/Users/xiaoru_zhu/PycharmProjects/HousingPriceDA/HousingAnalysis/Results/building_class_st.json')
unit_num_st_dict = load_json_to_dict('/Users/xiaoru_zhu/PycharmProjects/HousingPriceDA/HousingAnalysis/Results/unit_num_st.json')
sale_month_st_dict = load_json_to_dict('/Users/xiaoru_zhu/PycharmProjects/HousingPriceDA/HousingAnalysis/Results/sale_month_st.json')
year_build_st_dict = load_json_to_dict('/Users/xiaoru_zhu/PycharmProjects/HousingPriceDA/HousingAnalysis/Results/year_build_st.json')
# average price (dollar/feet^2)
neighbor_avg_price_dict = load_json_to_dict('/Users/xiaoru_zhu/PycharmProjects/HousingPriceDA/HousingAnalysis/Results/neighbor_avg_price.json')
class_avg_price_dict = load_json_to_dict('/Users/xiaoru_zhu/PycharmProjects/HousingPriceDA/HousingAnalysis/Results/class_avg_price.json')
year_avg_price_dict = load_json_to_dict('/Users/xiaoru_zhu/PycharmProjects/HousingPriceDA/HousingAnalysis/Results/year_avg_price.json')

json_list.append(neighbor_st_dict)
json_list.append(building_class_st_dict)
json_list.append(unit_num_st_dict)
json_list.append(sale_month_st_dict)
json_list.append(year_build_st_dict)
json_list.append(neighbor_avg_price_dict)
json_list.append(class_avg_price_dict)
json_list.append(year_avg_price_dict)

feature_list = []

@app.route('/', methods=['GET'])
def main_page():
    # print 1
    return render_template('index.html')

@app.route('/index', methods=['GET'])
def index():
    # print 1
    return render_template('index.html')


@app.route('/saleCount', methods=['GET'])
def sale_count():
    return render_template('sale-num.html')


@app.route('/saleAvg', methods=['GET'])
def sale_avg():
    return render_template('sale-avg.html')


@app.route('/pricePredict', methods=['GET'])
def prc_prdct():
    return render_template('price-prediction.html')


@app.route('/getData', methods=['GET'])
def get_data():
    tmp_data = json.dumps(json_list)
    return tmp_data


@app.route('/exePredict', methods=['POST'])
def execute_predict():
    if request.method == 'POST':
        neighbor_area = request.form['neighbor_area']
        class_category = request.form['class_category']
        class_as_present = request.form['class_as_present']
        r_units = request.form['r_units']
        c_units = request.form['c_units']
        t_units = request.form['t_units']
        land_squre = request.form['land_squre']
        year_built = request.form['year_built']
        sale_month = request.form['sale_month']
        values = [neighbor_area, class_category, class_as_present, r_units, c_units, t_units, land_squre, year_built, sale_month]
        print('Data From Front End: ' + str(values))

        json_data = json.dumps(predict_module.run_saved_model(values, sc))
        #print(type(json_data))
        return json_data
    else:
        return '<h1>404 NOT FOUND</h1>'


if __name__ == "__main__":
    app.run(debug=True, port=8088)

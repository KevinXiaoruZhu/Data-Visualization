from pyspark import SparkContext, SparkConf, StorageLevel
import csv
import numpy as np
from pyspark.mllib.regression import LabeledPoint
from pyspark.mllib.regression import LinearRegressionWithSGD, LinearRegressionModel
import matplotlib.pyplot as plt

def run_prdct(pr_values, sc):
    values = list(pr_values)

    # Configure
    train_path = '/Users/xiaoru_zhu/PycharmProjects/HousingPriceDA/Dataset/train.csv'

    # Initialize RDD
    rdd_lines = sc.textFile(train_path)
    head = rdd_lines.first()
    rdd_lines = rdd_lines.filter(lambda ln: ln != head) \
                         .mapPartitions(lambda x: csv.reader(x)) \
                         .persist(StorageLevel(True, True, False, False, 1))  # MEMORY_AND_DISK
    # data_num = rdd_lines.count()

    # Prepare for normalization
    sub = []
    minimum = []
    for index in range(5, 8):
        max_ = float(rdd_lines.map(lambda attr: attr[index]).max(key=float))
        min_ = float(rdd_lines.map(lambda attr: attr[index]).min(key=float))
        subtract = max_ - min_
        minimum.append(min_)
        sub.append(subtract)

    # Normalization(gui yi): (val - min)/(max - min), to let number feature values in [0, 1] and narrow down the error
    def normalization(line):
        line[5] = (float(line[5]) - minimum[0]) / sub[0]
        line[6] = (float(line[6]) - minimum[1]) / sub[1]
        line[7] = (float(line[7]) - minimum[2]) / sub[2]
        return line

    rdd_lines = rdd_lines.map(lambda attr: normalization(attr))
    values = normalization(values)

    # print(rdd_lines.first())  # test after normalization


    # extract features from every category column and generate dict
    def be_mapped(rdd_arg, column):
        return rdd_arg.map(lambda attr: attr[column]) \
                      .distinct() \
                      .zipWithIndex() \
                      .collectAsMap()  # result : {'BATH BEACH': 0, 'BAY RIDGE': 1, 'BEDFORD STUYVESANT': 2, ...}

    mappings = [be_mapped(rdd_lines, i) for i in [0, 1, 2, 8]]  # collect dicts into a list
    print('category feature mapping dict:', mappings)
    cat_len = sum(map(len, [i for i in mappings]))  # category feature numbers using sum + map function
    num_len = len(rdd_lines.first()[5:8])  # number feature numbers,index = 5,6,7
    total_len = num_len + cat_len  # total feature numbers
    ''' >>> TEST
    print('category feature number： %d' % cat_len)
    print('number feature number： %d' % num_len)
    print('total feature number:：%d' % total_len)
    '''

    # Create eigenvectors(feature vectors) for linear regression
    def extract_features(line):
        cat_vec = np.zeros(cat_len)  # new array for category features, init 0 for all elements
        step = 0
        for i, raw_feature in enumerate([line[0], line[1], line[2], line[8]]):  # [(0,line[0]), (1,line[1], ...) ]
            dict_cate = mappings[i]  # category feature mapping dict {'BATH BEACH': 0, 'BAY RIDGE': 1, 'xxx': 2, ...}
            idx = dict_cate[raw_feature]  # get value from dict
            cat_vec[idx + step] = 1  # set 1 for index in array
            step = step + len(dict_cate)  # jump to the next attribute area
        num_vec = np.array([float(raw_feature) for raw_feature in line[5:8]])
        return np.concatenate((cat_vec, num_vec))  # splice category and number vectors

    def extract_label(line):
        return float(line[-1])


    # Error analysis
    def squared_error(actual, prdct):  # Mean Squared Error 均方误差
        return (prdct - actual) ** 2

    def abs_error(actual, prdct):  # Mean Absolute Error 平均绝对误差
        return np.abs(prdct - actual)

    def squared_log_error(prdct, actual):  # Root Mean Squared Log Error 均方根对数误差
        return (np.log(prdct + 1) - np.log(actual + 1)) ** 2

    # Adjust argument # there is no TEST dataset, using train data as test data!
    def evaluate(train_set, iterations, step, reg_param, reg_type, intercept):
        # create linear model using Stochastic gradient descent(随机梯度下降)
        model = LinearRegressionWithSGD.train(train_set, iterations, step, regParam=reg_param, regType=reg_type,
                                              intercept=intercept)
        # use test data -> rdd: [(actual_value, prdict_value), (...), (...), ......]
        tlabel_tprediction = train_set.map(lambda point: (point.label, model.predict(point.features)))
        # calculate Root Mean Squared Log Error
        rmsle = np.sqrt(tlabel_tprediction.map(lambda tp: squared_log_error(tp[0], tp[1])).mean())
        return rmsle

    # Generate the final feature vectors by 'map' and 'extract' function
    data = rdd_lines.map(lambda line: LabeledPoint(extract_label(line), extract_features(line)))
    #first_point = data.first()

    values_vec = extract_features(values)

    # create linear model and test
    linear_model = LinearRegressionWithSGD.train(data, iterations=200, step=0.05, intercept=False)
    true_vs_predicted = data.map(lambda point: (point.label, linear_model.predict(point.features)))
    print('The first five prediction values: ' + str(true_vs_predicted.take(5)))  # test

    rst = linear_model.predict(values_vec)

    # error analysis
    m_s_e = true_vs_predicted.map(lambda tp: squared_error(tp[0], tp[1])).mean()
    m_a_e = true_vs_predicted.map(lambda tp: abs_error(tp[0], tp[1])).mean()
    r_m_s_l_e = np.sqrt(true_vs_predicted.map(lambda tp: squared_log_error(tp[0], tp[1])).mean())
    # print('Linear Model - Mean Squared Error: %2.4f' % m_s_e)
    print('Linear Model - Mean Absolute Error: %2.4f' % m_a_e)
    print('Linear Model - Root Mean Squared Log Error: %2.4f' % r_m_s_l_e)

    '''
    # adjust 'iterations' argument
    args_it = [1, 5, 10, 20, 50, 100, 200]
    error_it = [evaluate(data, arg, 0.01, 0.0, 'l2', False) for arg in args_it]
    for i in range(len(args_it)):
        print('the r_m_s_l_e:%f when iteration = %f' % (error_it[i], args_it[i]))

    # adjust 'step' argument
    args_stp = [0.01, 0.025, 0.05, 0.1, 0.3, 0.5, 1.0]
    error_stp = [evaluate(data, 10, arg, 0.0, 'l2', False) for arg in args_stp]

    for i in range(len(args_stp)):
        print('the r_m_s_l_e:%f when step = %f' % (error_stp[i], args_stp[i]))
    '''
    rst = round(rst, 2)
    r_m_s_l_e = round(r_m_s_l_e, 2)
    m_a_e = round(m_a_e, 2)
    rst_lst = [rst, r_m_s_l_e, m_a_e]
    print(rst_lst)
    return rst_lst


def run_saved_model(pr_values, sc):
    values = list(pr_values)
    predict_model = LinearRegressionModel.load(sc, '/Users/xiaoru_zhu/PycharmProjects/HousingPriceDA/PricePrediction/model/LR.model')

    # Configure
    train_path = '/Users/xiaoru_zhu/PycharmProjects/HousingPriceDA/Dataset/train.csv'
    # Initialize RDD
    rdd_lines = sc.textFile(train_path)
    head = rdd_lines.first()
    rdd_lines = rdd_lines.filter(lambda ln: ln != head) \
                         .mapPartitions(lambda x: csv.reader(x)) \
                         .persist(StorageLevel(True, True, False, False, 1))  # MEMORY_AND_DISK
    # Prepare for normalization
    sub = []
    minimum = []
    for index in range(5, 8):
        max_ = float(rdd_lines.map(lambda attr: attr[index]).max(key=float))
        min_ = float(rdd_lines.map(lambda attr: attr[index]).min(key=float))
        subtract = max_ - min_
        minimum.append(min_)
        sub.append(subtract)

    # Normalization(gui yi): (val - min)/(max - min), to let number feature values in [0, 1] and narrow down the error
    def normalization(line):
        line[5] = (float(line[5]) - minimum[0]) / sub[0]
        line[6] = (float(line[6]) - minimum[1]) / sub[1]
        line[7] = (float(line[7]) - minimum[2]) / sub[2]
        return line

    values = normalization(values)


    # extract features from every category column and generate dict
    def be_mapped(rdd_arg, column):
        return rdd_arg.map(lambda attr: attr[column]) \
                      .distinct() \
                      .zipWithIndex() \
                      .collectAsMap()  # result : {'BATH BEACH': 0, 'BAY RIDGE': 1, 'BEDFORD STUYVESANT': 2, ...}

    mappings = [be_mapped(rdd_lines, i) for i in [0, 1, 2, 8]]  # collect dicts into a list
    print('category feature mapping dict:', mappings)
    cat_len = sum(map(len, [i for i in mappings]))  # category feature numbers using sum + map function
    num_len = len(rdd_lines.first()[5:8])  # number feature numbers,index = 5,6,7
    total_len = num_len + cat_len  # total feature numbers

    rdd_lines = rdd_lines.map(lambda attr: normalization(attr))


    # extract features from every category column and generate dict
    def be_mapped(rdd_arg, column):
        return rdd_arg.map(lambda attr: attr[column]) \
            .distinct() \
            .zipWithIndex() \
            .collectAsMap()  # result : {'BATH BEACH': 0, 'BAY RIDGE': 1, 'BEDFORD STUYVESANT': 2, ...}

    mappings = [be_mapped(rdd_lines, i) for i in [0, 1, 2, 8]]  # collect dicts into a list
    print('category feature mapping dict:', mappings)
    cat_len = sum(map(len, [i for i in mappings]))  # category feature numbers using sum + map function
    # num_len = len(rdd_lines.first()[5:8])  # number feature numbers,index = 5,6,7

    # Create eigenvectors(feature vectors) for linear regression
    def extract_features(line):
        cat_vec = np.zeros(cat_len)  # new array for category features, init 0 for all elements
        step = 0
        for i, raw_feature in enumerate([line[0], line[1], line[2], line[8]]):  # [(0,line[0]), (1,line[1]), ...) ]
            dict_cate = mappings[i]  # category feature mapping dict {'BATH BEACH': 0, 'BAY RIDGE': 1, 'xxx': 2, ...}
            idx = dict_cate[raw_feature]  # get value from dict
            cat_vec[idx + step] = 1  # set 1 for index in array
            step = step + len(dict_cate)  # jump to the next attribute area
        num_vec = np.array([float(raw_feature) for raw_feature in line[5:8]])
        return np.concatenate((cat_vec, num_vec))  # splice category and number vectors

    values_vec = extract_features(values)

    rst = predict_model.predict(values_vec)

    rst = round(rst, 2)
    r_m_s_l_e = round(1.4002, 2)
    m_a_e = round(2516004.8850, 2)
    rst_lst = [rst, r_m_s_l_e, m_a_e]
    print(rst_lst)
    return rst_lst

if __name__ == '__main__':
    conf = SparkConf().setMaster('local').setAppName('Housing Price Prediction App')
    sc = SparkContext(conf=conf)
    print(run_prdct(['BATH BEACH','01 ONE FAMILY DWELLINGS','A5',1,0,1,1547,1930,'3'], sc=sc))

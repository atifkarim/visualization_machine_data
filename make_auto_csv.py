import csv
import os
import json
from random import seed
from random import gauss
from random import random
from datetime import datetime
import pandas as pd

def file_path_info():
	dir_path = os.getcwd()
	dir_path = dir_path+"/templates/static/json_files/"
	filename_json = dir_path+"json_column_2.json"
	filename_csv = dir_path+"csv_column_2.csv"

	return dir_path, filename_json, filename_csv


def create_data_point():
	# seed random number generator
	seed(datetime.now())
	# list to store data
	key_point = []
	my_list_1 = []
	my_list_2 = []

	max_range = 100
	# generate some Gaussian values
	for _ in range(max_range):
		value = gauss(0,1)
		my_list_1.append(value)
		key_point.append(_)


	for _ in range(max_range):
		value = random()
		my_list_2.append(value)
	
	return max_range, my_list_1, my_list_2, key_point

# following function in future will be used maybe
def check_if_string_in_file(file_name, string_to_search):
	""" Check if any line in the file contains given string """
	# Open the file in read only mode
	with open(file_name, 'r') as read_obj:
		# Read all lines in the file one by one
		for line in read_obj:
			# For each line, check if line contains the string
			if string_to_search in line:
				return True
	return False

def make_file(filename):
	with open(filename,'a', newline='') as file:
		print("file_creation function is called")
	file.close()

def make_row(filename):
	# row_list = [["unit", "value1", "value2"]]
	row_list = [["x", "y", "z"]]
	with open(filename,'a', newline='') as file:
		writer = csv.writer(file)
		writer.writerows(row_list)
	file.close()

def fill_data(filename):
	max_range, my_list_1, my_list_2, key_point = create_data_point()
	i = 0
	while(max_range>i):
		row_list = [[i, my_list_1[i], my_list_2[i]]]
		with open(filename, 'a', newline='') as file:
			writer = csv.writer(file)
			writer.writerows(row_list)
		i = i+1
	file.close()


def do_process():
	dir_path = os.getcwd()
	dir_path = dir_path+"/templates/static/json_files/"
	filename = dir_path+"csv_column_2.csv"
	# check file is already here or ot. If yes then firstly removed and created a blank file
	if not os.path.isfile(filename):
		print("file is not here")
		make_file(filename)
		make_row(filename)
		fill_data(filename)
	else:
		print("file already exists")
		os.remove(filename)
		print("file removed")
		make_file(filename)
		make_row(filename)
		fill_data(filename)

def create_json():
	dir_path_json = os.getcwd()
	dir_path_json = dir_path_json+"/templates/static/json_files/"
	filename_json = dir_path_json+"json_column_2.json"
	max_range, list_1, list_2, key_point = create_data_point()
	key_point = [element * 2 for element in key_point]
	key_point_1 = [int(element + 2) for element in key_point]
	# print(key_point)
	
	# lists = ['key_point','list_1', 'list_2']
	
	# a new list is made from the former two to create JSON file
	# new_list = [{'x': x, 'y1': y1, 'y2': y2} for x, y1, y2 in zip(key_point, list_1, list_2)]
	new_list = [{'x1': x1, 'x2': x2, 'y1': y1, 'y2': y2} for x1, x2, y1, y2 in zip(key_point, key_point_1, list_1, list_2)]
	if not os.path.isfile(filename_json):
		print("---------- hey json ------------- ")
		with open(filename_json, 'w') as outfile:
			json.dump(new_list, outfile, indent=4)
	else:
		os.remove(filename_json)
		print("-------- json removed----------")
		with open(filename_json, 'w') as outfile:
			json.dump(new_list, outfile, indent=4)
	
	return new_list

def load_json_1():
	json_var = create_json()
	return json_var

def load_json():
	dir_path_json = os.getcwd()
	dir_path_json = dir_path_json+"/templates/static/json_files/"
	filename_json = dir_path_json+"json_column_2.json"
	f = open(filename_json)
	data = json.load(f)
	return data

# goal of the following function is to convert csv data to json. but it changes the data type
def load_csv():
	dir_path, filename_json, filename_csv = file_path_info()
	dir_path_json = dir_path+"new_json.json"
	df = pd.read_csv(filename_csv)
	df.to_json(dir_path_json)
	# dir_path_new_json = dir_path+"new_json.json"
	# json_data = [json.dumps(d) for d in csv.DictReader(open(filename_csv))]
	# return json_data
	
	f = open(dir_path_json)
	data = json.load(f)
	# print(data)
	return data

# if check_if_string_in_file(filename, 'unit'):
#     print("file already here")
#     fill_data()
# else:
#     print("1st time here")
#     make_row()
#     fill_data()
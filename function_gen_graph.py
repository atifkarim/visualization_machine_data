import numpy as np
import matplotlib.pyplot as plt
import sys
import json
import os

def create_json():
	list_1 = []
	list_2 = []
	
	for i in range (0,5):
		list_1.append(i*2)
	
	for j in range(0,5):
		if j%2==0:
			list_2.append(-(j*3))
		else:
			list_2.append(-8)
	print(list_1)
	print(list_2)
	
	lists = ['list_1', 'list_2']
	
	# a new list is made from the former two to create JSON file
	new_list = [{'x_axis': x_axis, 'y_axis': y_axis} for x_axis, y_axis in zip(list_1, list_2)]
	json_filename = "plot_info.json"
	with open(json_filename, 'w') as outfile:
	    json.dump(new_list, outfile, indent=4)
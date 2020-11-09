import numpy as np
import matplotlib.pyplot as plt
import sys
import json
import os
import time
current_directory = os.getcwd()
print('current_directory is: ',current_directory)
# print(sys.version)


# print("hello py world")

# arr = np.array([1, 2, 3, 4, 5])
# arr1 = np.array([-1, 2, -3, 4, -5])

list_1 = []
list_2 = []
# arr_1 = np.array(list_1)

for i in range (0,5):
	# print(i)
	list_1.append(i*2)

for j in range(0,5):
	print("kkk   : ",j," : ", j%2)
	if j%2==0:
		list_2.append(-(j*3))
	else:
		list_2.append(-8)
print(list_2)
# arr_1 = np.array(list_1)

lists = ['list_1', 'list_2']

data = {listname: globals()[listname] for listname in lists}
with open('plot_info.json', 'w') as outfile:
    json.dump(data, outfile, indent=4)

plt.plot(list_1, list_2)
plt.show()
# plt.pause(3)
# plt.close('all')
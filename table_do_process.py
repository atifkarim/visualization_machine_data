from table_const_var import *
from random import seed
from random import gauss
from random import random, randint
from datetime import datetime

from device_x import *

class Get_data(Set_data):
    device_1 = {} # final dictionary of the device device_1
    device_1_key = [] # final key name for the dictionary(here device_1)

    device_2 = {} # final dictionary of the device device_2
    device_2_key = [] # final key name for the dictionary(here device_2)

    device_3 = {} # final dictionary of the device device_3
    device_3_key = [] # final key name for the dictionary(here device_3)

    def __init__(self):
        self.device_x_func = get_data_x()

    def do_process(self):
        seed(datetime.now())
        value = random()

        # following list consists of all child dictionary
        vals_demod = self.make_row_dict(7, "demodulator")

        # checking the final dictionary is empty or not. if empty create the key
        if bool(Get_data.device_1)==False:
            self.create_device_dict_key(vals_demod, given_key_container = Get_data.device_1_key)
        else:
            pass

        # populate the final dictionary with key and value
        for index,value in enumerate(Get_data.device_1_key):
            Get_data.device_1[value] = vals_demod[index]


        vals_mod = self.make_row_dict(9, "modulator")
        # checking the final dictionary is empty or not. if empty create the key
        if bool(Get_data.device_2)==False:
            self.create_device_dict_key(vals_mod, given_key_container = Get_data.device_2_key)
        else:
            pass

        # populate the final dictionary with key and value
        for index,value in enumerate(Get_data.device_2_key):
            Get_data.device_2[value] = vals_mod[index]

        vals_device_3 = self.make_row_dict(5, "decoder")
        # checking the final dictionary is empty or not. if empty create the key
        if bool(Get_data.device_3)==False:
            self.create_device_dict_key(vals_device_3, given_key_container = Get_data.device_3_key)
        else:
            pass

        # populate the final dictionary with key and value
        for index,value in enumerate(Get_data.device_3_key):
            Get_data.device_3[value] = vals_device_3[index]

        '''
        calling device_x
        '''

        vals_x = self.device_x_func.create_data_dev_x()
        print("vals_x: ",vals_x)

        # checking the final dictionary is empty or not. if empty create the key
        if bool(self.device_x_func.device_x)==False:
            self.create_device_dict_key(vals_x, given_key_container = self.device_x_func.device_x_key)
        else:
            pass

        # populate the final dictionary with key and value
        for index,value in enumerate(self.device_x_func.device_x_key):
            self.device_x_func.device_x[value] = vals_x[index]
        
        overall_status = {"Board_1": Get_data.device_1, "Board_2": Get_data.device_2,
                        "Board_3":Get_data.device_3, "Board_4":self.device_x_func.device_x}

        return overall_status

    def create_device_dict_key(self, list_of_dict, count = 0, given_key_container = None):
        # print("create_new_key func called")
        for i in list_of_dict:
            if count < 10:
                content = "value_0"+str(count)
                given_key_container.append(content)
                count+=1
            else:
                content = "value_"+str(count)
                given_key_container.append(content)
                count+=1

    def make_row_dict(self, row_num, static_device_name):
        vals = []
        for i in range (row_num):
            child_key = {
                "00_row": "row_"+static_device_name+"_"+str(i),
                "01_add": randint(5,9) + randint(3,7),
                "02_sub": randint(1,5)
            }
            vals.append(child_key)
        return vals

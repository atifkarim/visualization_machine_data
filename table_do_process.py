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

        # checking the final dictionary is empty or not. if empty create the key
        if bool(self.device_x_func.device_x)==False:
            self.create_device_dict_key(vals_x, given_key_container = self.device_x_func.device_x_key)
        else:
            pass

        # populate the final dictionary with key and value
        for index,value in enumerate(self.device_x_func.device_x_key):
            self.device_x_func.device_x[value] = vals_x[index]
        
        overall_status = {
            "0001_Summer": Get_data.device_1,
            "0002_Winter": Get_data.device_2,
            "0003_Spring":Get_data.device_3,
            "0004_Autumn":self.device_x_func.device_x
            }
        
        if Set_data.do_making_final_json == "DO":
            print("I CAME HERE")
            self.create_json_for_db(overall_status)
        if Set_data.do_making_final_json == "DO":
            print(Set_data.storage_div_val_row)
        Set_data.do_making_final_json = "DONT"

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

    # purpose of the following function is to parse device_name, value_nn keyword and info of first key of the
    # most inner dict(here 00_row OR name)
    def create_json_for_db(self, final_status):
        for key, value in final_status.items():
            # print("value len: ", len(value)) # how many value_nn in every season(eg: summer)
            storage_value_temp = []
            storage_00_row_temp = []
            storage_div_val_row_temp = []
            for key_1, value_1 in value.items():
                # print("value_1 len: ", len(value_1)) # how many value_nn in each value_nn (here 3(name, value, unit))
                for key_2 , value_2 in value_1.items():
                    if key_2 == "00_row" or key_2 == "name":
                        # print("key: ", key, " , key_1: ", key_1, " , 00_row_val: ",final_status[key][key_1][key_2])
                        storage_value_temp.append(key_1)
                        storage_00_row_temp.append(final_status[key][key_1][key_2])
            storage_value_temp.append("All")
            storage_00_row_temp.append("All")
            Set_data.storage_value.append(storage_value_temp)
            # storage_value_temp = []
            Set_data.storage_00_row.append(storage_00_row_temp)
            # storage_00_row_temp = []
            Set_data.storage_device.append(key)

            storage_div_val_row_temp.append(key)
            storage_div_val_row_temp.append(storage_value_temp)
            storage_div_val_row_temp.append(storage_00_row_temp)
            Set_data.storage_div_val_row.append(storage_div_val_row_temp)

        Set_data.json_for_db = {
            "key_1": Set_data.storage_device,
            "key_2": Set_data.storage_value,
            "key_3": Set_data.storage_00_row
        }

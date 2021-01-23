from table_const_var import *
from random import seed
from random import gauss
from random import random, randint
from datetime import datetime

class Get_data(Set_data):
    demodulator = {} # final dictionary of the device demodulator
    demodulator_key = [] # final key name for the dictionary(here demodulator)

    def do_process(self):
        seed(datetime.now())
        value = random()
        value_00_dmod = {
            "00_data":Set_data.data["a"],
            "01_add":Set_data.data["a"]+ value*2,
            "02_sub":Set_data.data["a"] - value*2
        }

        value_01_dmod = {
            "00_data":Set_data.data["b"],
            "01_add":Set_data.data["b"] + value*3,
            "02_sub":Set_data.data["b"] - value*3
        }

        # following list consists of all child dictionary
        # vals = [value_00_dmod, value_01_dmod]
        vals = self.make_row_dict()

        # demodulator = {
        #     "value_00": value_00_dmod,
        #     "value_01": value_01_dmod
        # }

        # checking the final dictionary is empty or not. if empty create the key
        if bool(Get_data.demodulator)==False:
            self.create_demodulator_key(vals)
        else:
            pass

        # populate the final dictionary with key and value
        for index,value in enumerate(Get_data.demodulator_key):
            Get_data.demodulator[value] = vals[index]


        value_00_mod = {
            "00_data":Set_data.data["a"],
            "01_add":Set_data.data["a"] + Set_data.data["b"],
            "02_sub":Set_data.data["a"] - Set_data.data["c"]
        }

        value_01_mod = {
            "00_data":Set_data.data["b"],
            "01_add":Set_data.data["b"] + Set_data.data["b"],
            "02_sub":Set_data.data["b"] - Set_data.data["c"]
        }

        modulator = {
            "value_00": value_00_mod,
            "value_01": value_01_mod
        }

        value_00_dec = {
            "00_data":Set_data.data["a"],
            "01_add":Set_data.data["a"] + Set_data.data["b"],
            "02_sub":Set_data.data["a"] - Set_data.data["c"]
        }

        value_01_dec = {
            "00_data":Set_data.data["b"],
            "01_add":Set_data.data["b"] + Set_data.data["b"],
            "02_sub":Set_data.data["b"] - Set_data.data["c"]
        }

        decoder = {
            "value_00": value_00_dec,
            "value_01": value_01_dec
        }

        overall_status = {"00_Demodulator": Get_data.demodulator, "01_Modulator": modulator, "02_Decoder":decoder}

        return overall_status

    def create_demodulator_key(self, list_of_dict, count = 0):
        # print("create_new_key func called")
        for i in list_of_dict:
            if count < 10:
                content = "value_0"+str(count)
                Get_data.demodulator_key.append(content)
                count+=1
            else:
                content = "value_"+str(count)
                Get_data.demodulator_key.append(content)
                count+=1

    def make_row_dict(self):
        vals = []
        for i in range (40):
            child_key = {
                "00_data": Set_data.data["a"],
                "01_add": randint(25,35) + randint(45,65),
                "02_sub": randint(58, 98)
            }
            vals.append(child_key)
        return vals

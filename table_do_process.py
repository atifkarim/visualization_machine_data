from table_const_var import *
from random import seed
from random import gauss
from random import random
from datetime import datetime

class Get_data(Set_data):
    # following function deprecated
    def write_data(self, my_dict):
        Set_data.make_mem_var(my_dict)

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

        # demodulator = {
        #     "value_00": value_00_dmod,
        #     "value_01": value_01_dmod
        # }

        demodulator = {}
        keys = ["value_00","value_01"]
        vals = [value_00_dmod, value_01_dmod]

        for index,value in enumerate(keys):
            demodulator[value] = vals[index]


        value_00_mod = {
            "00_data1":Set_data.data["a"],
            "01_add1":Set_data.data["a"] + Set_data.data["b"],
            "02_sub1":Set_data.data["a"] - Set_data.data["c"]
        }

        value_01_mod = {
            "00_data1":Set_data.data["b"],
            "01_add1":Set_data.data["b"] + Set_data.data["b"],
            "02_sub1":Set_data.data["b"] - Set_data.data["c"]
        }

        modulator = {
            "value_00": value_00_mod,
            "value_01": value_01_mod
        }

        value_00_dec = {
            "00_data1":Set_data.data["a"],
            "01_add1":Set_data.data["a"] + Set_data.data["b"],
            "02_sub1":Set_data.data["a"] - Set_data.data["c"]
        }

        value_01_dec = {
            "00_data1":Set_data.data["b"],
            "01_add1":Set_data.data["b"] + Set_data.data["b"],
            "02_sub1":Set_data.data["b"] - Set_data.data["c"]
        }

        decoder = {
            "value_00": value_00_dec,
            "value_01": value_01_dec
        }

        overall_status = {"Demodulator": demodulator, "Modulator": modulator, "Decoder":decoder}

        return overall_status
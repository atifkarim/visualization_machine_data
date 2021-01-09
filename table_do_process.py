from table_const_var import *

class Get_data(Set_data):
    # following function deprecated
    def write_data(self, my_dict):
        Set_data.make_mem_var(my_dict)

    def do_process(self):
        value_00_dmod = {
            "00_data_1":Set_data.data["a"],
            "01_add":Set_data.data["a"]+ Set_data.data["b"],
            "02_sub":Set_data.data["a"] - Set_data.data["c"]
        }

        value_01_dmod = {
            "00_data":Set_data.data["b"],
            "01_add":Set_data.data["b"] + Set_data.data["b"],
            "02_sub":Set_data.data["b"] - Set_data.data["c"]
        }

        demodulator = {
            "value_00": value_00_dmod,
            "value_01": value_01_dmod
        }


        value_00_mod = {
            "00_data_1":Set_data.data["a"],
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

        overall_status = {"Demodulator": demodulator, "Modulator": modulator}

        return overall_status
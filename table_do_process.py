from table_const_var import *

class Get_data(Set_data):
    def do_process(self, f = Set_data.a):
        value_00_dmod = {
            "00_data_1":Set_data.a,
            "01_add":Set_data.a + Set_data.b,
            "02_sub":Set_data.a - Set_data.c
        }

        value_01_dmod = {
            "00_data":Set_data.b,
            "01_add":Set_data.b + Set_data.b,
            "02_sub":Set_data.b - Set_data.c
        }

        demodulator = {
            "value_00": value_00_dmod,
            "value_01": value_01_dmod
        }


        value_00_mod = {
            "00_data_1":Set_data.a,
            "01_add":Set_data.a + Set_data.b,
            "02_sub":Set_data.a - Set_data.c
        }

        value_01_mod = {
            "00_data":Set_data.b+3*f,
            "01_add":Set_data.b + Set_data.b,
            "02_sub":Set_data.b - Set_data.c
        }

        modulator = {
            "value_00": value_00_mod,
            "value_01": value_01_mod
        }

        overall_status = {"Demodulator": demodulator, "Modulator": modulator}

        return overall_status
from table_const_var import *
from random import seed
from random import gauss
from random import random, randint
from datetime import datetime

class get_data_x(Set_data):
    
    device_x = {}
    device_x_key = []

    def create_data_dev_x(self):
        value_00 = {"name": "dev_x_0",
                    "value": Set_data.config_val["0001_Summer"]["c"],
                    "unit": Set_data.config_val["0001_Summer"]["a"]
                    }
        value_01 = {"name": "dev_x_1",
                    "value": Set_data.config_val["0002_Winter"]["y"],
                    "unit": Set_data.config_val["0002_Winter"]["x"]
                    }
        value_02 = {"name": "dev_x_2",
                    "value": Set_data.config_val["0003_Spring"]["r"],
                    "unit": Set_data.config_val["0003_Spring"]["p"]
                    }
        value_03 = {"name": "dev_x_3",
                    "value": Set_data.config_val["0004_Autumn"]["u"]+Set_data.config_val["0004_Autumn"]["s"],
                    "unit": Set_data.config_val["0004_Autumn"]["t"]
                    }

        vals_x = [value_00, value_01,value_02, value_03]

        return vals_x
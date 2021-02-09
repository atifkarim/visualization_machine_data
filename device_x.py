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
                    "value": Set_data.data["a"],
                    "unit": ""
                    }
        value_01 = {"name": "dev_x_1",
                    "value": Set_data.data["a"]*5,
                    "unit": ""
                    }

        vals_x = [value_00, value_01]

        return vals_x
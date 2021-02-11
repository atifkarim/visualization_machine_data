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
                    "value": Set_data.multi_data["Board_1"]["c"],
                    "unit": Set_data.multi_data["Board_1"]["a"]
                    }
        value_01 = {"name": "dev_x_1",
                    "value": Set_data.multi_data["Board_2"]["y"],
                    "unit": Set_data.multi_data["Board_2"]["x"]
                    }
        value_02 = {"name": "dev_x_2",
                    "value": Set_data.multi_data["Board_3"]["r"],
                    "unit": Set_data.multi_data["Board_3"]["p"]
                    }
        value_03 = {"name": "dev_x_3",
                    "value": Set_data.multi_data["Board_4"]["u"]+Set_data.multi_data["Board_4"]["s"],
                    "unit": Set_data.multi_data["Board_4"]["t"]
                    }

        vals_x = [value_00, value_01,value_02, value_03]

        return vals_x
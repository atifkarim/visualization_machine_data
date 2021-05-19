import ast

class Set_data(object):

    # following dictionary will set initial value for corresponding table
    # with respect to it's key
    config_val = {
        "0001_Summer":{"a":12, "b":16, "c":1},
        "0002_Winter":{"x":13, "y":17, "z":2},
        "0003_Spring":{"p":14, "q":18, "r":3},
        "0004_Autumn":{"s":15, "t":19, "u":-5}
    }

    data = {
        "a":2,
        "b":3,
        "c":-4,
        "x":87
    }

    set_table = {
        "chosen_table":"0001_Summer"
    }

    chose_val_list = []
    all_table = ["0001_Summer","0002_Winter", "0003_Spring", "0004_Autumn"]
    check_string = "check"

    # purpose of the following json and list is to make sqlitedb OR making dynamic form for client END
    # still not sure how it will work
    do_making_final_json = "DO"
    storage_device = [] # to store 0001_summer etc
    storage_value = [] # to store value_00, value_01, ... , value_nn
    storage_00_row = [] # to store the value of first key of the last dict(here 00_row OR name)
    json_for_db = {}
    storage_div_val_row = [] # device, value_nn, row_nn

    # another approach for saving json for form data
    json_for_db_1 = {}
    '''
    {
        "device_name_00":{
            "value":["val_00", "val_01", ...., "val_nn", "all"],
            "param": ["param_00", "param_01", .... , "param_nn"]
        },
        "device_name_01":{
            "value":["val_00", "val_01", ...., "val_nn", "all"],
            "param": ["param_00", "param_01", .... , "param_nn"]
        }
    }

    '''
    json_for_db_converted = {}
    print("running 1")

    @staticmethod
    def make_mem_var(var_dict):
        for key, val in var_dict.items():
            Set_data.data[key] = int(val)

    @staticmethod
    def updateval(name, val):
        Set_data.data[name] = val

    @staticmethod
    def ret_dict():
        return Set_data.data

    # following function will pass the initial config_val data to JS
    # for first time while process start to create dropdown menu for each table
    @staticmethod
    def pass_config_val():
        return Set_data.config_val

    # following function will get the JSON data from JS through Flask
    # endpoint and then update the config_val. After updating pass_config_val()
    # function again pass the updated value to update dropdown menu and change
    # corresponding table data's calculation
    @staticmethod
    def update_config_val(var_dict):
        for key in var_dict.keys():
            for sub_key, sub_val in ast.literal_eval(var_dict[key]).items():
                # print("got key: ",key," ,sub_key: ",sub_key, " ,sub_val: ",sub_val)
                Set_data.config_val[key][sub_key] = int(sub_val)
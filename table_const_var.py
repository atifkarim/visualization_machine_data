import ast

class Set_data(object):

    # following dictionary will set initial value for corresponding table
    # with respect to it's key
    config_val = {
        "Board_1":{"a":12, "b":16, "c":1},
        "Board_2":{"x":13, "y":17, "z":2},
        "Board_3":{"p":14, "q":18, "r":3},
        "Board_4":{"s":15, "t":19, "u":-5}
    }

    data = {
        "a":2,
        "b":3,
        "c":-4,
        "x":87
    }
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
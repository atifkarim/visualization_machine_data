class Set_data(object):

    multi_data = {
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

    @staticmethod
    def ret_multi_dict():
        return Set_data.multi_data

    @staticmethod
    def make_mem_var_1(var_dict):
        var_dict = dict(var_dict)
        print("var_dict: ", var_dict.items())
        # for key, val in var_dict.items():
        #     for key_1, val_1 in val.items():
        #         Set_data.multi_data[key][key_1] = int(val_1)



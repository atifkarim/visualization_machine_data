class Set_data(object):

    multi_data = {
        "Board_1":{"a":12, "b":13, "c":14},
        "Board_2":{"x":12, "y":13, "z":14},
        "Board_3":{"p":12, "q":13, "r":14},
        "Board_4":{"s":12, "t":13, "u":14}
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



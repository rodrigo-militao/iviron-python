import json
import csv

configPath = 'general_config.json'

class Utils:
    @staticmethod
    def getConfigData():
        with open(configPath, 'r') as f:
            data = json.load(f)
            return data
    @staticmethod
    def changeConfigFile(key, value):
        a_file = open(configPath, "r")
        json_object = json.load(a_file)
        a_file.close()

        json_object[key] = value
        a_file = open(configPath, "w")
        json.dump(json_object, a_file)
        a_file.close()
    
    @staticmethod
    def readCSV(path):
        with open(path, 'r') as f:
            data = list(csv.DictReader(f))
            return json.dumps(data)



import json
import csv

configPath = 'general_config.json'

USERS_FILE = 'users.csv'

#create class User
class User:
    def __init__(self, user):
        self.id = user['id']
        self.username = user['username']
        self.password = user['password']
   
    def is_active(self):
        return True
    def is_authenticated(self):
        return True
    def get_id(self):
        return self.id

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
    
    @staticmethod
    def getUserById(id):
        with open(USERS_FILE, 'r') as f:
            data = list(csv.DictReader(f))
            for user in data:
                if user['id'] == id:
                    return User(user)
            return None
    
    @staticmethod
    def getUser(username, password):
        with open(USERS_FILE, 'r') as f:
            data = list(csv.DictReader(f))
            for user in data:
                if user['username'] == username and user['password'] == password:
                    # set user['is_active'] as a method that returns true
                    return User(user)
            return None




#!/usr/bin/env python

"""
 * @file dbFill.py
 * Used in CS498RK MP4 to populate database with randomly generated users and tasks.
 *
 * @author Aswin Sivaraman
 * @date Created: Spring 2015
 * @date Modified: Spring 2015
 * @date Modified: Spring 2019
"""

import sys
import getopt
import http.client
import urllib
import json
from random import randint
from random import choice
from datetime import date
from time import mktime

def usage():
    print('dbFill.py -u <baseurl> -p <port> -n <numUsers>')

def getUsers(conn):
    # Retrieve the list of users
    conn.request("GET","""/api/users?filter={"_id":1}""")
    response = conn.getresponse()
    data = response.read()
    d = json.loads(data)

    # Array of user IDs
    users = [str(d['data'][x]['_id']) for x in range(len(d['data']))]

    return users

def main(argv):

    # Server Base URL and port
    baseurl = "localhost"
    port = 4000

    # Number of POSTs that will be made to the server
    userCount = 50

    try:
        opts, args = getopt.getopt(argv,"hu:p:n",["url=","port=","users="])
    except getopt.GetoptError:
        usage()
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
             usage()
             sys.exit()
        elif opt in ("-u", "--url"):
             baseurl = str(arg)
        elif opt in ("-p", "--port"):
             port = int(arg)
        elif opt in ("-n", "--users"):
             userCount = int(arg)

    # Python array containing common first names and last names
    firstNames = ["james","john","robert","michael","william","david","richard","charles","joseph","thomas","christopher","daniel","paul","mark","donald","george","kenneth","steven","edward","brian","ronald","anthony","kevin","jason","matthew","gary","timothy","jose","larry","jeffrey","frank","scott","eric","stephen","andrew","raymond","gregory","joshua","jerry","dennis","walter","patrick","peter","harold","douglas","henry","carl","arthur","ryan","roger","joe","juan","jack","albert","jonathan","justin","terry","gerald","keith","samuel","willie","ralph","lawrence","nicholas","roy","benjamin","bruce","brandon","adam","harry","fred","wayne","billy","steve","louis","jeremy","aaron","randy","howard","eugene","carlos","russell","bobby","victor","martin","ernest","phillip","todd","jesse","craig","alan","shawn","clarence","sean","philip","chris","johnny","earl","jimmy","antonio","danny","bryan","tony","luis","mike","stanley","leonard","nathan","dale","manuel","rodney","curtis","norman","allen","marvin","vincent","glenn","jeffery","travis","jeff","chad","jacob","lee","melvin","alfred","kyle","francis","bradley","jesus","herbert","frederick","ray","joel","edwin","don","eddie","ricky","troy","randall","barry","alexander","bernard","mario","leroy","francisco","marcus","micheal","theodore","clifford","miguel","oscar","jay","jim","tom","calvin","alex","jon","ronnie","bill","lloyd","tommy","leon","derek","warren","darrell","jerome","floyd","leo","alvin","tim","wesley","gordon","dean","greg","jorge","dustin","pedro","derrick","dan","lewis","zachary","corey","herman","maurice","vernon","roberto","clyde","glen","hector","shane","ricardo","sam","rick","lester","brent","ramon","charlie","tyler","gilbert","gene"]
    lastNames = ["smith","johnson","williams","jones","brown","davis","miller","wilson","moore","taylor","anderson","thomas","jackson","white","harris","martin","thompson","garcia","martinez","robinson","clark","rodriguez","lewis","lee","walker","hall","allen","young","hernandez","king","wright","lopez","hill","scott","green","adams","baker","gonzalez","nelson","carter","mitchell","perez","roberts","turner","phillips","campbell","parker","evans","edwards","collins","stewart","sanchez","morris","rogers","reed","cook","morgan","bell","murphy","bailey","rivera","cooper","richardson","cox","howard","ward","torres","peterson","gray","ramirez","james","watson","brooks","kelly","sanders","price","bennett","wood","barnes","ross","henderson","coleman","jenkins","perry","powell","long","patterson","hughes","flores","washington","butler","simmons","foster","gonzales","bryant","alexander","russell","griffin","diaz","hayes"]

    # Server to connect to (1: url, 2: port number)
    conn = http.client.HTTPConnection(baseurl, port)

    # HTTP Headers
    headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain"}

    # Array of user IDs
    userIDs = []
    userNames = []
    userEmails = []
    userTokens = []

    # Loop 'userCount' number of times
    for i in range(userCount):

        # Pick a random first name and last name
        x = randint(0,99)
        y = randint(0,99)
        params = urllib.parse.urlencode({'username': firstNames[x] + " " + lastNames[y], 'email': firstNames[x] + "@" + lastNames[y] + ".com", 'password': firstNames[x] + " " + lastNames[y]})

        # POST the user
        conn.request("POST", "/users", params, headers)
        response = conn.getresponse()
        data = response.read()
        d = json.loads(data)
        print(d)

        # Store the users id
        userIDs.append(str(d['user']['_id']))
        userNames.append(str(d['user']['username']))
        userEmails.append(str(d['user']['email']))
        userTokens.append(str(d['token']))

    for i in range(userCount):
        headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain","Authorization": "Bearer "+userTokens[i]}
        def gen_personal_params():
            return [
                urllib.parse.urlencode({'question': 'major', 'answer': choice(['Statistics', 'Computer Science'])}),
                urllib.parse.urlencode({'question': 'gender', 'answer': choice(['male','female'])}),
                urllib.parse.urlencode({'question': 'smoke', 'answer': choice(['true','false'])}),
                urllib.parse.urlencode({'question': 'sleeping_schedule', 'answer': '{:0>2d}:{:0>2d}-{}:{:0>2d}'.format(choice([randint(21, 23), randint(0,7)]), randint(0,59), randint(5,15), randint(0, 59))}),
                urllib.parse.urlencode({'question': 'cook', 'answer': choice(['true','false'])}),
                urllib.parse.urlencode({'question': 'introverted', 'answer': str(randint(0, 5))}),
                urllib.parse.urlencode({'question': 'pets', 'answer': str(randint(0, 5))}),
                urllib.parse.urlencode({'question': 'clean', 'answer': str(randint(0, 5))}),
                urllib.parse.urlencode({'question': 'loud_sounds', 'answer': choice(['true','false'])}),
                urllib.parse.urlencode({'question': 'year', 'answer': str(randint(2022, 2026))}),
                urllib.parse.urlencode({'question': 'degree', 'answer': choice(['Bachelor\'s' ,'Master\'s', 'PhD'])}),
                urllib.parse.urlencode({'question': 'college', 'answer': choice(['UIUC', 'Purdue'])})
            ]
        def gen_matching_params():
            return [
                urllib.parse.urlencode({'question': 'major', 'answer': choice(['Statistics', 'Computer Science', 'false'])}),
                urllib.parse.urlencode({'question': 'gender', 'answer': choice(['male','female','false'])}),
                urllib.parse.urlencode({'question': 'smoke', 'answer': str(randint(0, 5))}),
                urllib.parse.urlencode({'question': 'sleeping_schedule', 'answer': str(randint(0, 5))}),
                urllib.parse.urlencode({'question': 'cook', 'answer': str(randint(0, 5))}),
                urllib.parse.urlencode({'question': 'introverted', 'answer': choice(['true','false'])}),
                urllib.parse.urlencode({'question': 'pets', 'answer': str(randint(0, 5))}),
                urllib.parse.urlencode({'question': 'clean', 'answer': str(randint(0, 5))}),
                urllib.parse.urlencode({'question': 'loud_sounds', 'answer': choice(['true','false'])}),
            ]
        personal_params = gen_personal_params()
        data = None
        for personal_param in personal_params:
            conn.request("PUT", "/p-info/me?id={}".format(userIDs[i]), personal_param, headers)
            response = conn.getresponse()
            data = response.read()
        print(data)
        matching_params = gen_matching_params()
        for matching_param in matching_params:
            conn.request("PUT", "/m-info/me?id={}".format(userIDs[i]), matching_param, headers)
            response = conn.getresponse()
            data = response.read()

    for i in range(userCount):
        headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain","Authorization": "Bearer "+userTokens[i]}
        conn.request("GET", "/matching-result/me?id={}".format(userIDs[i]), None, headers)
        response = conn.getresponse()
        data = response.read()
        d = json.loads(data)
        print("High:", d['data'][-1]['score'], "Low:", d['data'][0]['score'])




    # Exit gracefully
    conn.close()
    print(str(userCount)+" users added at "+baseurl+":"+str(port))


if __name__ == "__main__":
     main(sys.argv[1:])

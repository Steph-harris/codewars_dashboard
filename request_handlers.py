import requests
import tornado.web
import json
import pprint
import path_settings

CODEWARS_BASE_URL = path_settings.CODEWARS_URL
CODEWARS_KEY = path_settings.CODEWARS_KEY
HEADERS = {'Authorization': CODEWARS_KEY}
KATA_ERR = "Codewars request failed with error: "


class MainHandler(tornado.web.RequestHandler):

    def get(self):
        self.render('index.html')


class UserHandler(tornado.web.RequestHandler):

    def get(self, user=None):
        CODEWARS_USER = user if user else path_settings.CODEWARS_USER
        CODEWARS_URL = CODEWARS_BASE_URL + "users/" + CODEWARS_USER
        usr_dt = {}

        try:
            r = requests.get(CODEWARS_URL, headers=HEADERS)
        except requests.exceptions.RequestException as e:
            print(KATA_ERR + e)
            sys.exit(1)

        if r.status_code == 200:
            usr_dt['general'] = json.loads(r.text)
            self.write(usr_dt)
            self.finish()
        else:
            print(f"User status: {r.status_code};")


class KataHandler(tornado.web.RequestHandler):

    def get(self, CODEWARS_USER=None):
        CODEWARS_USER = CODEWARS_USER if CODEWARS_USER else path_settings.CODEWARS_USER
        CODEWARS_URL = CODEWARS_BASE_URL + "users/" + CODEWARS_USER + \
            "/code-challenges/completed?page={}"
        usr_dt = {}
        curr_page = 1

        try:
            rc = requests.get(CODEWARS_URL.format(str(curr_page - 1)),
                              headers=HEADERS)
        except requests.exceptions.RequestException as e:
            print(KATA_ERR + e)
            sys.exit(1)

        total = json.loads(rc.text)['totalPages']
        json_response = json.loads(rc.text)['data']

        while curr_page < total:
            curr_page += 1

            try:
                rc = requests.get(CODEWARS_URL.format(str(curr_page - 1)),
                                  headers=HEADERS)
            except requests.exceptions.RequestException as e:
                print(KATA_ERR + e)
                sys.exit(1)

            json_response = json_response + json.loads(rc.text)['data']

        print("Total Challenges Received: " + str(len(json_response)))

        if rc.status_code == 200:
            usr_dt['challenge_info'] = json_response
            self.write(usr_dt)
            self.finish()
        else:
            print(f"Challenge status: {rc.status_code}")

    def post(self, kata_id):
        challenge_url = CODEWARS_BASE_URL + \
            "code-challenges/" + kata_id
        results = {}

        try:
            r = requests.get(challenge_url, headers=HEADERS)
        except requests.exceptions.RequestException as e:
            print(KATA_ERR + e)
            sys.exit(1)

        if r.status_code == 200:
            results['challenge'] = json.loads(r.text)
            self.write(results)
            self.finish()
        else:
            print(f"Challenge status: {rc.status_code}")

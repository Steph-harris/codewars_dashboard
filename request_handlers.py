import requests
import tornado.web
import json
import pprint
import path_settings


class MainHandler(tornado.web.RequestHandler):

    def get(self):
        self.render('index.html')


class UserHandler(tornado.web.RequestHandler):

    def get(self, user=None):
        cw_user = user if user else path_settings.CODEWARS_USER
        codewars_url = path_settings.CODEWARS_URL + "users/" + cw_user
        codewars_key = path_settings.CODEWARS_KEY

        headers = {'Authorization': codewars_key}
        kata_err = "Codewars request failed with error: "
        usr_dt = {}

        try:
            r = requests.get(codewars_url, headers=headers)
        except requests.exceptions.RequestException as e:
            print(kata_err + e)
            sys.exit(1)

        if r.status_code is 200:
            usr_dt['general'] = json.loads(r.text)
            self.write(usr_dt)
            self.finish()
        else:
            print(f"User status: {r.status_code};")


class KataHandler(tornado.web.RequestHandler):

    def get(self, cw_user=None):
        cw_user = cw_user if cw_user else path_settings.CODEWARS_USER
        codewars_url = path_settings.CODEWARS_URL + "users/" + cw_user + \
            "/code-challenges/completed?page={}"
        codewars_key = path_settings.CODEWARS_KEY
        headers = {'Authorization': codewars_key}
        kata_err = "Codewars request failed with error: "
        usr_dt = {}
        curr_page = 1

        try:
            rc = requests.get(codewars_url.format(str(curr_page - 1)),
                              headers=headers)
        except requests.exceptions.RequestException as e:
            print(kata_err + e)
            sys.exit(1)

        total = json.loads(rc.text)['totalPages']
        json_response = json.loads(rc.text)['data']

        while curr_page < total:
            curr_page += 1

            try:
                rc = requests.get(codewars_url.format(str(curr_page - 1)),
                                  headers=headers)
            except requests.exceptions.RequestException as e:
                print(kata_err + e)
                sys.exit(1)

            json_response = json_response + json.loads(rc.text)['data']

        print("Total Challenges Received: " + str(len(json_response)))

        if rc.status_code is 200:
            usr_dt['challenge_info'] = json_response
            self.write(usr_dt)
            self.finish()
        else:
            print(f"Challenge status: {rc.status_code}")

    def post(self, kata_id):
        challenge_url = path_settings.CODEWARS_URL + \
            "code-challenges/" + kata_id
        codewars_key = path_settings.CODEWARS_KEY
        headers = {'Authorization': codewars_key}
        results = {}

        try:
            r = requests.get(challenge_url, headers=headers)
        except requests.exceptions.RequestException as e:
            print(kata_err + e)
            sys.exit(1)

        if r.status_code is 200:
            results['challenge'] = json.loads(r.text)
            self.write(results)
            self.finish()
        else:
            print(f"Challenge status: {rc.status_code}")

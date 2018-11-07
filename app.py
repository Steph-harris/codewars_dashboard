import requests
import tornado.ioloop
import tornado.httpserver
import tornado.web
import json
import pprint
import re
import path_settings

class Application(tornado.web.Application):

    def __init__(self):
        handlers = [
            (r"/", MainHandler),
            (r"/kata", KataHandler)
        ]
        settings = {
            "template_path": path_settings.TEMPLATE_PATH,
            "static_path": path_settings.STATIC_PATH,
        }
        tornado.web.Application.__init__(self, handlers, **settings)


class MainHandler(tornado.web.RequestHandler):

    def get(self):
        self.render('index.html')

class KataHandler(tornado.web.RequestHandler):

    def get(self, cw_user = None):
        cw_user = cw_user if cw_user else path_settings.CODEWARS_USER
        codewars_url = path_settings.CODEWARS_URL + "users/" + cw_user
        codewars_key = path_settings.CODEWARS_KEY
        headers = {'Authorization': codewars_key}
        kata_err = "Codewars request failed with error: "
        usr_dt = {}

        try:
            r = requests.get(codewars_url, headers=headers)
            rc = requests.get(codewars_url + "/code-challenges/completed",
                headers=headers)
        except requests.exceptions.RequestException as e:
            print(kata_err + e)
            sys.exit(1)

        if r.status_code is 200 and rc.status_code is 200:
            usr_dt['general'] = json.loads(r.text)
            usr_dt['challenge_info'] = json.loads(rc.text)
            self.write(usr_dt)
            self.finish()
        else:
            print(f"User status: {r.status_code}; "
                "Challenge status: {rc.status_code}")


def main():
    applicaton = Application()
    http_server = tornado.httpserver.HTTPServer(applicaton)
    http_server.listen(8080)

    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()

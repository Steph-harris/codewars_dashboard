import os
import tornado.ioloop
import tornado.httpserver
import tornado.web
import path_settings
import request_handlers


class Application(tornado.web.Application):

    def __init__(self):
        handlers = [
            (r"/", request_handlers.MainHandler),
            (r"/user/([^/]*)", request_handlers.UserHandler),
            (r"/kata/([^/]*)", request_handlers.KataHandler),
        ]
        settings = {
            "template_path": path_settings.TEMPLATE_PATH,
            "static_path": path_settings.STATIC_PATH,
            "autoreload": True
        }
        tornado.web.Application.__init__(self, handlers, **settings)


def main():
    applicaton = Application()
    http_server = tornado.httpserver.HTTPServer(applicaton)
    port = int(os.getenv('PORT', 8080))
    http_server.listen(port, address='0.0.0.0')

    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()

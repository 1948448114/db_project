# -*- coding: utf-8 -*-
#!/usr/bin/env python
import sys
reload(sys)
sys.setdefaultencoding("utf-8")
import tornado.httpserver
import tornado.ioloop
import tornado.web
import os,json
from tornado.options import define, options

from sqlalchemy.orm import scoped_session, sessionmaker
from mod.databases.db import engine

from mod.user.register import RegisterHandler
from mod.user.login import LoginHandler
from mod.user.admin_login import AdminLoginHandler
from mod.user.all_user import AllUserHandler
from mod.user.delete_user import DeleteUserHandler

from mod.book.new_book import NewBookHandler
from mod.book.delete_book import DeleteBookHandler
from mod.book.all_book import AllBookHandler
from mod.book.update_book import UpdateBookHandler



define("port", default=8000, help="run on the given port", type=int)

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r'/reg',RegisterHandler),#注册
            (r'/login',LoginHandler),#登录
            (r'/admin/login',AdminLoginHandler),#管理员登录
            (r'/user/remove',DeleteUserHandler),#管理员删除用户
            (r'/user/all',AllUserHandler),#管理员删除用户
            (r'/book/all',AllBookHandler),#所有书籍
            (r'/book/new',NewBookHandler),#添加书籍
            (r'/book/remove',DeleteBookHandler),#删除图书
            (r'/book/update',UpdateBookHandler),#更新图书
            (r'/.*', PageNotFoundHandler)
            ]
        settings = dict(
            cookie_secret="8DB90KLP8371B5AEAC5E64C6042415EF",
            template_path=os.path.join(os.path.dirname(__file__), 'templates'),
            static_path=os.path.join(os.path.dirname(__file__), 'static'),
            debug=True,
            autoload=True,
            # autoescape=None
        )
        tornado.web.Application.__init__(self, handlers,**settings)
        self.db = scoped_session(sessionmaker(bind=engine,
                                              autocommit=False, autoflush=True,
                                              expire_on_commit=False))

class PageNotFoundHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('404.html')
    def post(self):
        self.render('404.html')

if __name__ == "__main__":
    tornado.options.parse_command_line()
    Application().listen(options.port)
    try:
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        tornado.ioloop.IOLoop.instance().stop()
Status API Training Shop Blog About Pricing
© 2016 GitHub, Inc. Terms Privacy Security Contact Help
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


from mod.Basehandler import BaseHandler
from mod.user.register import RegisterHandler
from mod.user.login import LoginHandler
from mod.user.admin_login import AdminLoginHandler
from mod.user.all_user import AllUserHandler
from mod.user.delete_user import DeleteUserHandler

from mod.book.new_book import NewBookHandler
from mod.book.delete_book import DeleteBookHandler
from mod.book.all_book import AllBookHandler
from mod.book.update_book import UpdateBookHandler

from mod.order.new_order import NewOrderHandler
from mod.order.delete_order import DeleteOrderHandler
from mod.order.get_order import GetOrderHandler
from mod.order.update_order import UpdateOrderHandler
from mod.order.all_order import AllOrderHandler


define("port", default=8000, help="run on the given port", type=int)

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r'/',HomeHandler),#主页
            (r'/user/reg',RegisterHandler),#注册
            (r'/user/login',LoginHandler),#登录
            (r'/admin/login',AdminLoginHandler),#管理员登录
            (r'/user/remove',DeleteUserHandler),#管理员删除用户
            (r'/user/all',AllUserHandler),#管理员删除用户
            
            (r'/book/all',AllBookHandler),#所有书籍
            (r'/book/new',NewBookHandler),#添加书籍
            (r'/book/remove',DeleteBookHandler),#删除图书
            (r'/book/update',UpdateBookHandler),#更新图书

            (r'/order/new',NewOrderHandler),#新建订单
            (r'/order/delete',DeleteOrderHandler),#删除订单
            (r'/order/get',GetOrderHandler),#获取个人订单
            (r'/order/update',UpdateOrderHandler),#更改订单状态
            (r'/order/all',AllOrderHandler),#管理员获取所有已完成订单
            (r'/header',HomePageHandler),#header
            (r'/shoppingchart',ShopChartHandler),#购物车
            (r'/confirmOrder',ConfirmOrderHandler),#确认订单
            (r'/orders',OrderHandler),#订单
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
class HomePageHandler(BaseHandler):
    def get(self):
        user = self.get_current_user()
        self.render('header.html',user=user)
class HomeHandler(BaseHandler):
    def get(self):
        user = self.get_current_user()
        self.render('home.html',user=user)
class ShopChartHandler(BaseHandler):
    def get(self):
        user = self.get_current_user()
        self.render('shoppingchart.html',user=user)
class ConfirmOrderHandler(BaseHandler):
    def get(self):
        user = self.get_current_user()
        self.render('confirmOrder.html',user=user)
class OrderHandler(BaseHandler):
    def get(self):
        user = self.get_current_user()
        self.render('orders.html',user=user)
if __name__ == "__main__":
    tornado.options.parse_command_line()
    Application().listen(options.port)
    try:
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        tornado.ioloop.IOLoop.instance().stop()

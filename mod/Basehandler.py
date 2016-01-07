# -*- coding: utf-8 -*-
#!/usr/bin/env python
import tornado.web
import tornado.gen
from databases.tables import Cookies,AdminCookies
from sqlalchemy.orm.exc import NoResultFound
import json

class BaseHandler(tornado.web.RequestHandler):
    @property
    def db(self):
        return self.application.db
    def on_finish(self):
        self.db.close()
    def get_current_user(self):
        name = self.get_secure_cookie("username")
        if name:
            try:
                status = self.db.query(Cookies).filter(Cookies.cookie == name).one()
                return status
            except NoResultFound:
                return False
        else:
            return False
    def get_current_admin(self):
        admin = self.get_secure_cookie("admin_user")
        if admin:
            try:
                status = self.db.query(AdminCookies).filter(AdminCookies.cookie == admin).one()
                return status
            except NoResultFound:
                return False
        else:
            return False


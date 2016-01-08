# -*- coding: utf-8 -*-
#!/usr/bin/env python
import tornado.web
import tornado.gen
from ..databases.tables import Users,Cookies
from ..Basehandler import BaseHandler
import json,time,string
import hashlib,uuid,traceback
from time import time

class LoginHandler(BaseHandler):
	def get(self):
		pass

	def post(self):
		retjson = {'code':200,'content':'ok'}
		pwd = self.get_argument('pwd',default=None)
		phone = self.get_argument('phone',default=None)
		if not (pwd and phone):
			retjson['code'] = 400
			retjson['content'] = u"参数缺少"
		else:
			pwd = hashlib.sha256(pwd+'db_project').hexdigest()
			sql = u"select pwd from Users where phone='%s'" % phone
			try:
				result = self.db.execute(sql).fetchone()
				if not result or result.pwd != pwd:
					retjson['code'] = 400
					retjson['content'] = u'用户名密码不正确'
				else:
					cookie_value = uuid.uuid1()
					self.set_secure_cookie("username",str(cookie_value),expires_days=30,expires=int(time())+2592000)
					cookie = Cookies(phone = phone,cookie = cookie_value)
					self.db.add(cookie)
					self.db.commit()
			except Exception,e:
				self.db.rollback()
				retjson['code'] = 500
				retjson['content'] = str(e)
		ret = json.dumps(retjson,ensure_ascii=False, indent=2)
		self.write(ret)
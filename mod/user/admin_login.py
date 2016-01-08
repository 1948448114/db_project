# -*- coding: utf-8 -*-
#!/usr/bin/env python
import tornado.web
import tornado.gen
from ..databases.tables import Admin,AdminCookies
from ..Basehandler import BaseHandler
import json,time,string
import hashlib,uuid,traceback
from time import time

class AdminLoginHandler(BaseHandler):
	def get(self):
		pass

	def post(self):
		retjson = {'code':200,'content':'ok'}
		pwd = self.get_argument('pwd',default=None)
		name = self.get_argument('name',default=None)
		if not (pwd and name):
			retjson['code'] = 400
			retjson['content'] = u"参数缺少"
		else:
			sql = u"select pwd from Admin where name='%s'" % name
			try:
				result = self.db.execute(sql).fetchone()
				print result
				if not result:
					retjson['code'] = 400
					retjson['content'] = u'用户名不存在'
				elif result.pwd != pwd:
					retjson['code'] = 400
					retjson['content'] = u'用户名密码不正确'
				else:
					cookie_value = uuid.uuid1()
					self.set_secure_cookie("admin_user",str(cookie_value),expires_days=30,expires=int(time())+2592000)
					cookie = AdminCookies(name = name,cookie = cookie_value)
					self.db.add(cookie)
					self.db.commit()
			except Exception,e:
				self.db.rollback()
				retjson['code'] = 500
				retjson['content'] = str(e)
		ret = json.dumps(retjson,ensure_ascii=False, indent=2)
		self.write(ret)
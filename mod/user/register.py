# -*- coding: utf-8 -*-
#!/usr/bin/env python

import tornado.web
import tornado.gen
from ..databases.tables import Users,Cookies,Question
from ..Basehandler import BaseHandler
import json,time,string
from sqlalchemy.exc import IntegrityError
import hashlib,uuid,traceback
from time import time


class RegisterHandler(BaseHandler):
	def get(self):
		pass

	def post(self):
		retjson = {'code':200,'content':'ok'}
		name = self.get_argument('name',default=None)
		pwd = self.get_argument('pwd',default=None)
		email = self.get_argument('email',default=None)
		address = self.get_argument('address',default=None)
		phone = self.get_argument('phone',default=None)
		q1 = self.get_argument('q1',default="")
		q2 = self.get_argument('q2',default="")
		q3 = self.get_argument('q3',default="")
		q4 = self.get_argument('q4',default="")
		q5 = self.get_argument('q5',default="")
		if not (name and pwd and email and address and phone):
			retjson['code'] = 400
			retjson['content'] = u"参数缺少"
		else:
			pwd = hashlib.sha256(pwd+'db_project').hexdigest()
			sql = u"insert into Users values('%s','%s','%s','%s','%s')" % (name,pwd,email,address,phone)
			try:
				result = self.db.execute(sql)
				if result.rowcount == 1:
					cookie_value = uuid.uuid1()
					self.set_secure_cookie("username",str(cookie_value),expires_days=30,expires=int(time())+2592000)
					cookie = Cookies(phone = phone,cookie = cookie_value)
					self.db.add(cookie)
					self.db.commit()
					sql = "insert into question values('%s','%s','%s','%s','%s')" %(q1,q2,q3,q4,q5)
					self.db.execute(sql)
					self.db.commit()
				else:
					retjson['code'] = 500
					retjson['content'] = u'插入失败'
			except IntegrityError:
				self.db.rollback()
				retjson['code'] = 500
				retjson['content'] = u'手机号已经注册'
			except Exception,e:
				self.db.rollback()
				traceback.print_exc()
				retjson['code'] = 500
				retjson['content'] = str(e)
		ret = json.dumps(retjson,ensure_ascii=False, indent=2)
		self.write(ret)
		
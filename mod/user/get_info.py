# -*- coding: utf-8 -*-
#!/usr/bin/env python
import tornado.web
import tornado.gen
from ..databases.tables import Users
from ..Basehandler import BaseHandler
from sqlalchemy.exc import IntegrityError
import json,time,string

class FindUserHandler(BaseHandler):
	def get(self):
		pass
	def post(self):
		retjson = {'code':200,'content':'ok'}
		try:
			user = self.get_current_user()
			if not user:
				retjson['code'] = 400
				retjson['content'] = u'请先登录'
			else:
				sql = u"select * from Users where phone='%s'" %(user.phone)
				result1 = self.db.execute(sql).fetchone()
				user = {
						'name':result1.name,
						'email':result1.email,
						'address':result1.address,
						'phone':result1.phone
					}
				retjson['content'] = user
		except Exception,e:
			self.db.rollback()
			retjson['code'] = 500
			retjson['content'] = str(e)
		ret = json.dumps(retjson,ensure_ascii=False, indent=2)
		self.write(ret)
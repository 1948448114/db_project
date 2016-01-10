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
			argu = self.generate_argu(self.request.arguments)
			if not (argu):
				retjson['code'] = 400
				retjson['content'] = u"参数缺少"
			else:
				sql = u"select * from Users where %s" %(argu)
				result1 = self.db.execute(sql).fetchall()
				content = []
				for i in result1:
					user = {
							'name':i.name,
							'email':i.email,
							'address':i.address,
							'phone':i.phone
						}
					content.append(user)
				retjson['content'] = content
		except IntegrityError:
			self.db.rollback()
			retjson['code'] = 500
			retjson['content'] = u'该用户已存在'
		except Exception,e:
			self.db.rollback()
			retjson['code'] = 500
			retjson['content'] = str(e)
		ret = json.dumps(retjson,ensure_ascii=False, indent=2)
		self.write(ret)
	def generate_argu(self,arguments):
		phone_key = ['phone']
		all_ukey = ['name','email']
		sql = ""
		for (key,value) in arguments.iteritems():
			if key in phone_key and len(value[0])>0:
				sql += " and %s=%s" %(key,value[0])
			elif key in all_ukey and len(value[0])>0:
				sql += " and %s like \'%%%s%%\'" %(key,value[0])
			else:
				pass
		if sql:
			sql = sql[4:]
		return sql
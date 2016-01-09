# -*- coding: utf-8 -*-
#!/usr/bin/env python
import tornado.web
import tornado.gen
from ..databases.tables import Books
from ..Basehandler import BaseHandler
from sqlalchemy.exc import IntegrityError
import json,time,string
from new_book import change_time

class UpdateBookHandler(BaseHandler):
	def get(self):
		pass
	def post(self):
		retjson = {'code':200,'content':'ok'}
		try:
			admin = self.get_current_admin()
			if not admin:
				retjson['code'] = 400
				retjson['content'] = u'请先登录'
			else:
				argu = self.generate_argu(self.request.arguments)
				isbn = self.get_argument('isbn',default=None)
				if not (isbn and argu):
					retjson['code'] = 400
					retjson['content'] = u"参数缺少"
				else:
					sql = u"update Books set %s where isbn='%s'" %(argu,isbn)
					print sql
					result = self.db.execute(sql)
					print result.rowcount
					self.db.commit()
		except IntegrityError:
			self.db.rollback()
			retjson['code'] = 500
			retjson['content'] = u'该书籍已存在'
		except Exception,e:
			self.db.rollback()
			retjson['code'] = 500
			retjson['content'] = str(e)
		ret = json.dumps(retjson,ensure_ascii=False, indent=2)
		self.write(ret)
	def generate_argu(self,arguments):
		int_key = ['soldnum','remainnum','active']
		float_key = ['price']
		time_key = ['shelftime','releasetime']
		all_key = ['name','author','picture','note']
		sql = ""
		for (key,value) in arguments.iteritems():
			if key in int_key:
				sql += ",%s=%d" %(key,int(value[0]))
			elif key in float_key:
				sql += ",%s=%.2f" %(key,float(value[0]))
			elif key in time_key:
				sql += ",%s='%s'" %(key,change_time(value[0],0))
			elif key in all_key:
				sql += ",%s='%s'" %(key,value[0])
			else:
				pass
		if sql:
			sql = sql[1:]
		return sql
# -*- coding: utf-8 -*-
#!/usr/bin/env python
import tornado.web
import tornado.gen
from ..databases.tables import Books
from ..Basehandler import BaseHandler
from sqlalchemy.exc import IntegrityError
import json,time,string
from new_book import change_time

class FindBookHandler(BaseHandler):
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
				sql = u"select * from Books where %s" %(argu)
				result = self.db.execute(sql).fetchall()
				content = []
				for i in result:
					book = {
							'isbn':i.isbn,
							'name':i.name,
							'author':i.author,
							'price':i.price,
							'soldnum':i.soldnum,
							'remainnum':i.remainnum,
							'shelftime':change_time(i.shelftime,1),
							'releasetime':change_time(i.releasetime,1),
							'active':i.active,
							'picture':i.picture,
							'note':i.note
						}
					content.append(book)
				retjson['content'] = content
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
		isn_key = ['isbn']
		all_key = ['name','author']
		sql = ""
		for (key,value) in arguments.iteritems():
			if key in isn_key and len(value[0])>0:
				sql += " and %s=%s" %(key,value[0])
			elif key in all_key and len(value[0])>0:
				sql += " and %s like \'%%%s%%\'" %(key,value[0])
			else:
				pass
		if sql:
			sql = sql[4:]
		return sql
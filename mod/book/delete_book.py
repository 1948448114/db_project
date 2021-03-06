# -*- coding: utf-8 -*-
#!/usr/bin/env python
import tornado.web
import tornado.gen
from ..databases.tables import Books
from ..Basehandler import BaseHandler
from sqlalchemy.exc import IntegrityError
import json,time,string

class DeleteBookHandler(BaseHandler):
	def post(self):
		retjson = {'code':200,'content':'ok'}
		try:
			admin = self.get_current_admin()
			if not admin:
				retjson['code'] = 400
				retjson['content'] = u'请先登录'
			else:
				isbn = self.get_argument('isbn',default=None)
				if not isbn:
					retjson['code'] = 400
					retjson['content'] = u"参数缺少"
				else:
					sql = "delete from Books where isbn='%s'" % isbn
					result = self.db.execute(sql)
					if result.rowcount != 1:
						retjson['code'] = 400
						retjson['content'] = u'书籍不存在'
					else:
						self.db.commit()
		except Exception,e:
			self.db.rollback()
			retjson['code'] = 500
			retjson['content'] = str(e)
		ret = json.dumps(retjson,ensure_ascii=False, indent=2)
		self.write(ret)
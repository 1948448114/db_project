# -*- coding: utf-8 -*-
#!/usr/bin/env python
import tornado.web
import tornado.gen
from ..databases.tables import Orders
from ..Basehandler import BaseHandler
from sqlalchemy.exc import IntegrityError
import json,time,string
from ..book.new_book import change_time

class GetOrderHandler(BaseHandler):
	def post(self):
		retjson = {'code':200,'content':'ok'}
		try:
			user = self.get_current_user()
			if not user:
				retjson['code'] = 400
				retjson['content'] = u'请先登录'
			else:
				sql = "select * from Orders where usered='%s'" % user.phone
				result = self.db.execute(sql).fetchall()
				content = []
				for i in result:
					order = {
						'orderid':i.orderid,
						'isbn':i.bookid,
						'ordernum':i.ordernum,
						'ordertime':change_time(i.ordertime,1),
						'orderstate':i.orderstate,
						'bookprice':i.bookprice,
					}
					content.append(order)
				retjson['content'] = content
		except Exception,e:
			self.db.rollback()
			retjson['code'] = 500
			retjson['content'] = str(e)
		ret = json.dumps(retjson,ensure_ascii=False, indent=2)
		self.write(ret)
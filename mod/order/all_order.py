# -*- coding: utf-8 -*-
#!/usr/bin/env python
import tornado.web
import tornado.gen
from ..databases.tables import Orders
from ..Basehandler import BaseHandler
from sqlalchemy.exc import IntegrityError
import json,time,string
from ..book.new_book import change_time

class AllOrderHandler(BaseHandler):
	def post(self):
		retjson = {'code':200,'content':'ok'}
		try:
			admin = self.get_current_admin()
			if not admin:
				retjson['code'] = 400
				retjson['content'] = u'请先登录'
			else:
				pagesize = self.get_argument('pagesize',default=100)
				pagenumber = self.get_argument('pagenumber',default=1)
				start_number = (int(pagenumber)-1)*int(pagesize)
				all_number = self.db.execute("select count(*) as number from Orders").fetchone().number
				retjson['number'] = all_number
				sql = "select * from Orders  order by ordertime DESC limit %d,%d" %(start_number,int(pagesize))
				result = self.db.execute(sql).fetchall()
				content = []
				for i in result:
					order = {
						'orderid':i.orderid,
						'phone':i.usered,
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
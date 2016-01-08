# -*- coding: utf-8 -*-
#!/usr/bin/env python
import tornado.web
import tornado.gen
from ..databases.tables import Books
from ..Basehandler import BaseHandler
from sqlalchemy.exc import IntegrityError
import json,time,string
from new_book import change_time

class AllBookHandler(BaseHandler):
	def post(self):
		retjson = {'code':200,'content':'ok'}
		try:
			pagesize = self.get_argument('pagesize',default=10)
			pagenumber = self.get_argument('pagenumber',default=1)
			start_number = (int(pagenumber)-1)*int(pagesize)
			all_number = self.db.execute("select count(*) as number from Books").fetchone().number
			retjson['number'] = all_number
			sql = "select * from Books order by releasetime DESC limit %d,%d" % (start_number,int(pagesize))
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
		except Exception,e:
			self.db.rollback()
			retjson['code'] = 500
			retjson['content'] = str(e)
		ret = json.dumps(retjson,ensure_ascii=False, indent=2)
		self.write(ret)
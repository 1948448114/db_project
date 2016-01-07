# -*- coding: utf-8 -*-
#!/usr/bin/env python
import tornado.web
import tornado.gen
from ..databases.tables import Books
from ..Basehandler import BaseHandler
from sqlalchemy.exc import IntegrityError
import json,time,string
import hashlib,uuid,traceback
import time
from new_book import change_time

class HotBookHandler(BaseHandler):
	def post(self):
		retjson = {'code':200,'content':'ok'}
		try:
			page_size = self.get_argument('pagesize',default=10)
			page_number = self.get_argument('pagenumber',default=1)
			if not (page_size and page_number):
				retjson['code'] = 400
				retjson['content'] = u"参数缺少"
			else:
				start_number = (int(page_number)-1)*int(page_size)
				end_number = start_number+int(page_size);
				sql = u"select * from Books order by releasetime DESC"
				result = self.db.execute(sql).fetchall()[start_number:end_number]
				content = []
				retjson['number'] = len(result)
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
			retjson['code'] = 500
			retjson['content'] = str(e)
		ret = json.dumps(retjson,ensure_ascii=False, indent=2)
		self.write(ret)
		
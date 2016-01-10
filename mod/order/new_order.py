# -*- coding: utf-8 -*-
#!/usr/bin/env python
import tornado.web
import tornado.gen
from ..databases.tables import Books
from ..Basehandler import BaseHandler
from sqlalchemy.exc import IntegrityError
import json,time,string,uuid
from ..book.new_book import change_time

class NewOrderHandler(BaseHandler):
	def get(self):
		pass
	def post(self):
		"""
			state状态表
			1：完成
			0：已取消
		"""
		retjson = {'code':200,'content':u'新建订单成功'}
		try:
			user = self.get_current_user()
			if not user:
				retjson['code'] = 400
				retjson['content'] = u'请先登录'
			else:
				isbn = self.get_argument('isbn',default=None)
				ordernum = self.get_argument('ordernum',default=None)
				bookprice = self.get_argument('price',default=None)
				if not isbn or not ordernum or not bookprice:
					retjson['code'] = 400
					retjson['content'] = u'参数缺少'
				else:
					if int(ordernum)>0:
						querysql = "select count(*) as number from Books where active=1 and isbn='"+isbn+"'";
						result = self.db.execute(querysql).fetchone().number
						if result>0:
							orderid = uuid.uuid1()
							sql = "insert into Orders values('%s','%s','%s',%d,'%s',%d,%.2f)" % (orderid,isbn,user.phone,int(ordernum),int(time.time()),1,float(bookprice))
							self.db.execute(sql)
							self.db.commit()
						else:
							retjson['code'] = 400
							retjson['content'] = u'书籍不存在或下架'
					else:
						retjson['code'] = 400
						retjson['content'] = u'数量不合法'
		except Exception,e:
			self.db.rollback()
			retjson['code'] = 500
			retjson['content'] = str(e)
		ret = json.dumps(retjson,ensure_ascii=False, indent=2)
		self.write(ret)

# -*- coding: utf-8 -*-
#!/usr/bin/env python
import tornado.web
import tornado.gen
from ..databases.tables import Orders
from ..Basehandler import BaseHandler
import json,time,string

class DeleteOrderHandler(BaseHandler):
	def post(self):
		retjson = {'code':200,'content':'ok'}
		try:
			user = self.get_current_user()
			if not user:
				retjson['code'] = 400
				retjson['content'] = u'请先登录'
			else:
				orderid = self.get_argument('orderid',default=None)
				if not orderid:
					retjson['code'] = 400
					retjson['content'] = u"参数缺少"
				else:
					sql = "delete from Orders where orderid='%s'" % orderid
					result = self.db.execute(sql)
					if result.rowcount != 1:
						retjson['code'] = 400
						retjson['content'] = u'订单不存在'
					else:
						self.db.commit()
		except Exception,e:
			self.db.rollback()
			retjson['code'] = 500
			retjson['content'] = str(e)
		ret = json.dumps(retjson,ensure_ascii=False, indent=2)
		self.write(ret)
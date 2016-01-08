# -*- coding: utf-8 -*-
#!/usr/bin/env python
import tornado.web
import tornado.gen
from ..databases.tables import Orders
from ..Basehandler import BaseHandler
from sqlalchemy.exc import IntegrityError
import json,time,string

class UpdateOrderHandler(BaseHandler):
	def post(self):
		retjson = {'code':200,'content':'ok'}
		try:
			user = self.get_current_user()
			if not user:
				retjson['code'] = 400
				retjson['content'] = u'请先登录'
			else:
				state = self.get_argument('state',default=None)
				orderid = self.get_argument('orderid',default=None)
				if not (state and orderid):
					retjson['code'] = 400
					retjson['content'] = u"参数缺少"
				else:
					if int(state) in [0,1]:
						sql = "update  Orders set orderstate=%d where orderid='%s'" % (int(state),orderid)
						result = self.db.execute(sql)
						self.db.commit()
					else:
						retjson['code'] = 400
						retjson['content'] = u"状态不合法"
		except Exception,e:
			self.db.rollback()
			retjson['code'] = 500
			retjson['content'] = str(e)
		ret = json.dumps(retjson,ensure_ascii=False, indent=2)
		self.write(ret)
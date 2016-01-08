# -*- coding: utf-8 -*-
#!/usr/bin/env python
import tornado.web
import tornado.gen
from ..databases.tables import Users
from ..Basehandler import BaseHandler
from sqlalchemy.exc import IntegrityError
import json,time,string

class AllUserHandler(BaseHandler):
	def post(self):
		retjson = {'code':200,'content':'ok'}
		try:
			admin = self.get_current_admin()
			if not admin:
				retjson['code'] = 400
				retjson['content'] = u'请先登录'
			else:
				pagesize = self.get_argument('pagesize',default=10)
				pagenumber = self.get_argument('pagenumber',default=1)
				start_number = (int(pagenumber)-1)*int(pagesize)
				end_number = start_number+int(pagesize);
				all_number = self.db.execute("select count(*) as number from Users").fetchone().number
				retjson['number'] = all_number
				sql = "select * from Users"
				result = self.db.execute(sql).fetchall()[start_number:end_number]
				content = []
				for i in result:
					user = {
						'name':i.name,
						'email':i.email,
						'address':i.address,
						'phone':i.phone
					}
					content.append(user)
				retjson['content'] = content
		except Exception,e:
			self.db.rollback()
			retjson['code'] = 500
			retjson['content'] = str(e)
		ret = json.dumps(retjson,ensure_ascii=False, indent=2)
		self.write(ret)
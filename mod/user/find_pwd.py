# -*- coding: utf-8 -*-
#!/usr/bin/env python
import tornado.web
import tornado.gen
from ..databases.tables import Question
from ..Basehandler import BaseHandler
import json,time,string
import hashlib,uuid,traceback
from time import time

class FindpwdHandler(BaseHandler):
	def get(self):
		pass

	def post(self):
		retjson = {'code':200,'content':u'修改成功'}
		phone = self.get_argument('phone',default=None)
		pwd = self.get_argument('pwd',default=None)
		q1 = self.get_argument('q1',default=None)
		q2 = self.get_argument('q2',default=None)
		q3 = self.get_argument('q3',default=None)
		q4 = self.get_argument('q4',default=None)
		q5 = self.get_argument('q5',default=None)
		if not (phone and pwd) or not(q1 or q2 or q3 or q4 or q5):
			retjson['code'] = 400
			retjson['content'] = u"参数缺少"
		else:
			sql = u"select * from question where phone='%s'" % phone
			try:
				result = self.db.execute(sql).fetchone()
				state = 1
				if q1:
					if q1!=result.q1:
						state = 0
				if q2:
					if q2!=result.q2:
						state = 0
				if q3:
					if q3!=result.q3:
						state = 0
				if q4:
					if q4!=result.q4:
						state = 0
				if q5:
					if q5!=result.q5:
						state = 0
				if state:
					pwd = hashlib.sha256(pwd+'db_project').hexdigest()
					sql = u"update Users set pwd='%s' where phone='%s'" % (pwd,phone)
					result = self.db.execute(sql)
					if result.rowcount == 1:
						cookie_value = uuid.uuid1()
						self.set_secure_cookie("username",str(cookie_value),expires_days=30,expires=int(time())+2592000)
						cookie = Cookies(phone = phone,cookie = cookie_value)
						self.db.add(cookie)
						self.db.commit()
					else:
						retjson['code'] = 400
						retjson['content'] = u'用户不存在'
				else:
					retjson['code'] = 400
					retjson['content'] = u"问题答案不匹配"
			except Exception,e:
				self.db.rollback()
				retjson['code'] = 500
				retjson['content'] = str(e)
		ret = json.dumps(retjson,ensure_ascii=False, indent=2)
		self.write(ret)
# -*- coding: utf-8 -*-
#!/usr/bin/env python
import tornado.web
import tornado.gen
from ..databases.tables import Books
from ..Basehandler import BaseHandler
from sqlalchemy.exc import IntegrityError
import json,time,string

class NewBookHandler(BaseHandler):
	def get(self):
		pass
	def post(self):
		retjson = {'code':200,'content':'ok'}

		try:
			admin = self.get_current_admin()
			if not admin:
				retjson['code'] = 400
				retjson['content'] = u'请先登录'
			else:
				isbn = self.get_argument('isbn',default=None)
				name = self.get_argument('name',default=None)
				author = self.get_argument('author',default=None)
				price = self.get_argument('price',default=None)
				soldnum = 0
				remainnum = self.get_argument('remainnum',default=None)
				shelftime = change_time(self.get_argument('shelftime',default=None),0)
				releasetime = change_time(self.get_argument('releasetime',default=None),0)
				active = self.get_argument('active',default=None)
				picture = self.get_argument('picture',default='/static/images/book/default.jpg')
				note = self.get_argument('note',default=None)
				if not (isbn and name and author and price and remainnum and shelftime and releasetime and active and picture and note):
					retjson['code'] = 400
					retjson['content'] = u"参数缺少"
				else:
					price = float(price)
					remainnum = int(remainnum)
					active = int(active)
					sql = u"insert into Books values('%s','%s','%s',%.2f,%d,%d,'%s','%s',%d,'%s','%s')" %(isbn,name,author,price,soldnum,remainnum,shelftime,releasetime,active,picture,note)
					self.db.execute(sql)
					self.db.commit()
		except IntegrityError:
			self.db.rollback()
			retjson['code'] = 500
			retjson['content'] = u'该书籍已存在'
		except Exception,e:
			self.db.rollback()
			retjson['code'] = 500
			retjson['content'] = str(e)
		ret = json.dumps(retjson,ensure_ascii=False, indent=2)
		self.write(ret)

def change_time(init,mod):
	try:
		if mod==0:
			return int(time.mktime(time.strptime(init,"%Y-%m-%d")))
		elif mod==1:
			return time.strftime("%Y-%m-%d",time.localtime(int(init)))
	except Exception,e:
		print str(e)
		return -1
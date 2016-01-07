# -*- coding: utf-8 -*-


from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

DB_HOST = '115.159.115.133'
DB_USER = 'user'
DB_PWD = '2016'
DB_NAME = 'db'


Base = declarative_base()
engine = create_engine('mysql://%s:%s@%s/%s?charset=utf8' %
                       (DB_USER, DB_PWD, DB_HOST, DB_NAME),
                     encoding='utf-8', echo=False,
                       pool_size=100, pool_recycle=10)

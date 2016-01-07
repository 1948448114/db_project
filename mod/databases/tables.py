#!/usr/bin/env python
# -*- coding: utf-8 -*-

from sqlalchemy import Column, Integer, VARCHAR,Float,ForeignKey
from sqlalchemy.orm import relationship,backref
from db import Base


class Books(Base):
	__tablename__ = 'Books'

	isbn = Column(VARCHAR(13),nullable=False,primary_key=True)
	name = Column(VARCHAR(50),nullable=False)
	author = Column(VARCHAR(50),nullable=False)
	price = Column(Float(),nullable=False)
	soldnum = Column(Integer(),nullable=False)
	remainnum = Column(Integer(),nullable=False)
	shelftime = Column(VARCHAR(50),nullable=False)
	releasetime = Column(VARCHAR(50),nullable=False)
	active = Column(Integer(),nullable=False)
	picture = Column(VARCHAR(50),nullable=False)
	note = Column(VARCHAR(1024),nullable=False)

class Users(Base):
	__tablename__ = 'Users'

	name = Column(VARCHAR(50),nullable=False)
	pwd=Column(VARCHAR(64),nullable=False)
	email=Column(VARCHAR(50),nullable=False)
	address=Column(VARCHAR(100),nullable=False)
	phone=Column(VARCHAR(11),nullable=False,primary_key=True)
class Orders(Base):
	__tablename__ = 'Orders'

	orderid = Column(Integer(),nullable=False,primary_key=True)
	bookid = Column(VARCHAR(13),nullable=False)
	usered = Column(VARCHAR(50),nullable=False)
	ordernum = Column(Integer(),nullable=False)
	ordertime = Column(VARCHAR(50),nullable=False)
	orderstate = Column(Integer(),nullable=False)
	bookprice = Column(Float(),nullable=False)

class Cookies(Base):
	__tablename__ = 'Cookies'

	id = Column(Integer(),primary_key=True)
	phone = Column(VARCHAR(11),ForeignKey('Users.phone',ondelete='CASCADE'))
	cookie = Column(VARCHAR(64))
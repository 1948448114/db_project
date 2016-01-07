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
	active = Column(Integer(1),nullable=False)
	picture = Column(VARCHAR(50),nullable=False)
	note = Column(VARCHAR(1024),nullable=False)


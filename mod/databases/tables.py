#!/usr/bin/env python
# -*- coding: utf-8 -*-

from sqlalchemy import Column, Integer, VARCHAR,ForeignKey
from sqlalchemy.orm import relationship,backref
from db import Base


class Books(Base):
	__tablename__ = 'Books'

	isbn = Column(VARCHAR(13),nullable=False,primary_key=True)
	name = Column(VARCHAR(50),nullable=False)
	author = Column(VARCHAR(50),nullable=False)
	cardnum = Column(VARCHAR(9),nullable=False,unique=True)
	card_password = Column(VARCHAR(64),nullable=False)
	salt = Column(VARCHAR(64))

class Users(Base):
	__tablename__ = 'Users'

	name = Column(VARCHAR(50),nullable=False)
	pwd=Column(VARCHAR(50),nullable=False)
	email=Column(VARCHAR(50),nullable=False)
	address=Column(VARCHAR(100),nullable=False)
	phone=Column(VARCHAR(11),nullable=False,primary_key=True)

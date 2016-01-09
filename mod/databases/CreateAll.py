#!/usr/bin/env python
# -*- coding: utf-8 -*-
from db import engine, Base
from tables import  Books,Users,Orders,Cookies,AdminCookies,Admin,Question
Base.metadata.create_all(engine) #create all of Class which belonged to Base Class
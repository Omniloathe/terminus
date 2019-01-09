import os

DEBUG=True
SECRET_KEY = 'W(TS&E(RJK#L:S#a%&RS(*FDEJOF'
basedir=os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_DATABASE_URI='sqlite:///'+os.path.join(basedir,'data.sqlite')
SQLALCHEMY_COMMIT_ON_TEARDOWN=True

from werkzeug.security import generate_password_hash, check_password_hash
from terminus import db

class User(db.Model):
    __tablename__='users'
    id=db.Column(db.Intenger,primary_key=True)
    username=db.Column(db.String(32),unique=True,index=True)
    password_hash=db.Column(db.String(128))

    @property
    def password(selfself):
        raise AttributeError('password not readable attribute')

    @password.setter
    def password(self,password):
        self.password_hash=generate_password_hash(password)

    def verify_password(self,password):
        return check_password_hash(self.password_hash,password)

    def __repr__(self):
        return '<User: {}>'.format(self.username)
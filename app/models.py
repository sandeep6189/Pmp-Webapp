from app import db
from flask.ext.login import LoginManager, UserMixin
class User(db.Model,UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    social_id = db.Column(db.String(120),index=True,unique=True)
    gender = db.Column(db.String(10))
    country = db.Column(db.String(100))
    phone = db.Column(db.String(10))
    timezone = db.Column(db.String(40))
    image = db.Column(db.String(300),index=True)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2
        except NameError:
            return str(self.id)  # python 3

    def __repr__(self):
        return '<User %r>' % (self.nickname)

class Connection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    provider_id = db.Column(db.String(255))
    provider_user_id = db.Column(db.String(255))
    access_token = db.Column(db.String(255))
    secret = db.Column(db.String(255))
    display_name = db.Column(db.String(255))
    profile_url = db.Column(db.String(512))
    image_url = db.Column(db.String(512))
    rank = db.Column(db.Integer)



class User_Preferences(db.Model):
    nickname = db.Column(db.String(64),index=True,unique=True)
    email = db.Column(db.String(200),index=True,primary_key=True)
    preferences = db.Column(db.String(1000))
    last_accessed = db.Column(db.DateTime)
    last_updated = db.Column(db.DateTime)

    def get_id(self):
        try:
            return unicode(self.id)  # python 2
        except NameError:
            return str(self.id)  # python 3

    def __repr__(self):
        return '<User %r>' % (self.nickname)
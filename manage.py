from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.script import Manager
from flask.ext.migrate import Migrate, MigrateCommand
from flask.ext.login import LoginManager, UserMixin
from app import models

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:admin@localhost/login_users'

db = SQLAlchemy(app)
migrate = Migrate(app, db)

manager = Manager(app)
manager.add_command('db', MigrateCommand)

class User(db.Model,UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    image = db.Column(db.String(300),index=True)
    social_id = db.Column(db.String(120),index=True,unique=True)
    gender = db.Column(db.String(10))
    country = db.Column(db.String(100))
    phone = db.Column(db.String(10))
    timezone = db.Column(db.String(40))



class User_Preferences(db.Model):
	nickname = db.Column(db.String(64),index=True,unique=True)
	email = db.Column(db.String(200),index=True,primary_key=True)
	preferences = db.Column(db.String(1000))
	last_accessed = db.Column(db.DateTime)
	last_updated = db.Column(db.DateTime)


if __name__ == '__main__':
    manager.run()
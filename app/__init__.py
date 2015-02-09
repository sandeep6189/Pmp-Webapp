import os
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
from config import basedir


app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)
lm = LoginManager()
lm.init_app(app)
lm.login_view = 'login'
app.config['MYSQL_DATABASE_USER'] = 'pmp'
app.config['MYSQL_DATABASE_PASSWORD'] = '$yn3rgYaz1b34'
app.config['MYSQL_DATABASE_DB'] = 'pmp'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['SOCIAL_GOOGLE'] = {
    'consumer_key': '969188133123-6tbmkj0oe22pcr693tf7ljv8pcvn4u50.apps.googleusercontent.com',
    'consumer_secret': 'j_hcIMGTVS9_cOrg4YsVgBBL'
}
app.config['OAUTH_CREDENTIALS'] = {
    'facebook': {
        'id': '1598411600380707',
        'secret': '2856eb415bbb9d7ea6b898394ee80f82'
    },
    'twitter': {
        'id': '3RzWQclolxWZIMq5LJqzRZPTl',
        'secret': 'm9TEd58DSEtRrZHpz2EjrV9AhsBRxKMo8m3kuIZj3zLwzwIimt'
    },
    'google': {
        'id': '969188133123-6tbmkj0oe22pcr693tf7ljv8pcvn4u50.apps.googleusercontent.com',
        'secret': 'j_hcIMGTVS9_cOrg4YsVgBBL'
    }
}
from app import views

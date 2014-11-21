from app import app


from flask import request, redirect, url_for, send_from_directory ,flash ,render_template
from flask_debugtoolbar import DebugToolbarExtension
from flaskext.mysql import MySQL
from flask.ext.login import LoginManager
import json
from user_agents import parse
from .forms import LoginForm
#app = Flask(__name__)

#login_manager = LoginManager()
#login_manager.init_app(app)
#configure the database
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'admin'
app.config['MYSQL_DATABASE_DB'] = 'pmp'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

'''
@login_manager.user_loader
def load_user(userid):
	if not(userid):
		redirect(url_for('login'))
	return User.get(userid)

@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        # login and validate the user...
        login_user(user)
        flash("Logged in successfully.")
        return redirect(request.args.get("next") or url_for("index"))
    return render_template("login.html", form=form)
'''



@app.route("/")
@app.route("/index")
def hello_world():
	ua = request.headers.get('User-Agent')
	user_agent = parse(ua)
	if user_agent.is_pc:
		return render_template('index.html')
	elif user_agent.is_mobile:
		return render_template('index-mobile.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        flash('Login requested for OpenID="%s", remember_me=%s' %
              (form.openid.data, str(form.remember_me.data)))
        return redirect('/index')
    return render_template('login.html', 
                           title='Sign In',
                           form=form,
                           providers=app.config['OPENID_PROVIDERS'])




@app.route("/top_free_apps",methods=['GET'])
def top_free_apps():
	if request.method == "GET":
		cursor = mysql.connect().cursor()
		cursor.execute("SELECT *  FROM  `top_free_apps` LIMIT 0 , 10")
		data = cursor.fetchall()
		cursor.close()
		lis = []
		for row in data:
			row_data = {}
			row_data["app_name"] = row[4]
			row_data["icon"] = row[7]
			row_data["track_url"] = row[6]
			row_data["avg_rating"] = row[10]
			row_data["bundle_id"] = row[1]
			lis.append(row_data)
		return json.dumps(lis)

@app.route("/top_paid_apps",methods=['GET'])
def top_paid_apps():
	if request.method == "GET":
		cursor = mysql.connect().cursor()
		cursor.execute("SELECT *  FROM  `top_paid_apps` LIMIT 0 , 10")
		data = cursor.fetchall()
		cursor.close()
		lis = []
		for row in data:
			row_data = {}
			row_data["app_name"] = row[4]
			row_data["icon"] = row[7]
			row_data["track_url"] = row[6]
			row_data["avg_rating"] = row[10]
			row_data["bundle_id"] = row[1]
			lis.append(row_data)
		return json.dumps(lis)

@app.route("/categories",methods=['GET','POST'])
def categories():
	if request.method == "POST":
		category = request.form['category']
		cursor = mysql.connect().cursor()
		#from top free apps
		cursor.execute("SELECT * FROM  `top_free_apps` WHERE genre = '"+category+"' LIMIT 0 , 5")
		data = cursor.fetchall()
		#from top paid apps
		cursor.execute("SELECT * FROM  `top_paid_apps` WHERE genre = '"+category+"' LIMIT 0 , 5")
		data2= cursor.fetchall()
		cursor.close()
		lis = []
		data = data+data2
		for row in data:
			row_data = {}
			row_data["app_name"] = row[4]
			row_data["icon"] = row[7]
			row_data["track_url"] = row[6]
			row_data["avg_rating"] = row[10]
			row_data["bundle_id"] = row[1]
			lis.append(row_data)
		return json.dumps(lis)

@app.route("/search",methods=['POST'])
def search():
	if request.method == "POST":
		query = request.form['query']
		cursor = mysql.connect().cursor()
		cursor.execute("SELECT DISTINCT `bundle_id` FROM `app_desc` WHERE `app_name` LIKE '%"+query+"%' LIMIT 10")
		data = cursor.fetchall()
		#cursor.close()
		
		lis = []
		
		print data
		for row in data:
			bundle_id = row[0]
			cursor.execute("SELECT `app_desc`.`bundle_id`,`app_desc`.`app_name`,`app_desc`.`version`,`app_desc`.`genre`,`images`.`icon`, `images`.`screenshot`, `rating`.`avg_rating`, `rating`.`rating_count`,`bundle`.`track_url` FROM app_desc INNER JOIN images ON app_desc.bundle_id = images.bundle_id INNER JOIN rating ON images.bundle_id = rating.bundle_id INNER JOIN bundle ON rating.bundle_id = bundle.bundle_id WHERE app_desc.bundle_id =  '"+bundle_id+"' LIMIT 10")
			cur_data = cursor.fetchone()
			#lis.append(cur_data)
			dic = {}
			dic["bundle_id"] = cur_data[0]
			dic["app_name"] = cur_data[1]
			dic["version"] = cur_data[2]
			dic["genre"] = cur_data[3]
			dic["icon"] = cur_data[4]
			dic["avg_rating"] = cur_data[6]
			dic["track_url"] = cur_data[8]
			lis.append(dic)
		return json.dumps(lis)

@app.route("/app_details",methods=['POST'])
def app_details():
	if request.method == "POST":
		img = request.form['img_src']
		url = request.form['url']
		#div_id = request.form['div_id']
		idd =  request.form['id']
		#print img,url,div_id
		cursor = mysql.connect().cursor()
		cursor.execute("SELECT * FROM  `top_paid_apps` WHERE bundle_id = "+idd+" UNION SELECT *	FROM  `top_free_apps` WHERE bundle_id = "+idd+"")
		row = cursor.fetchone()
		#cursor.close()
		app_name = row[4]
		icon = row[7]
		track_url = row[6]
		rating = row[10]
		bundle_id = row[1]
		version = row[3]
		genre = row[5]
		#lis = []
		
		if len(app_name) > 16:
			app_name = app_name[0:14]+"..."
		
		img_str = ""
		count = 0

		if int(rating)<=5:
			for i in range(0,int(rating)):
				img_str= img_str+'''<img src="/static/img/full.png" alt='' style='height:12px'>'''
				count = count + 1
          	half = rating - int(rating)
          	if half==0.5:
          		img_str=img_str+'''<img src='/static/img/half.png' alt='' style='height:12px'>'''
            	count = count + 1
        	while count<5:
				img_str = img_str+'''<img src='static/img/empty.png' alt='' style='height:12px'>'''
            	count = count + 1
          
		#print html_str

		lis = [img_str,url,img,app_name,version,genre]
		return json.dumps(lis)

@app.route("/search_results",methods=['POST'])
def search_results():
	if request.method == "POST":
		img = request.form['img_src']
		url = request.form['url']
		idd =  request.form['id']
		cursor = mysql.connect().cursor()
		cursor.execute("SELECT app_desc.app_name,app_desc.version,app_desc.genre, rating.avg_rating FROM app_desc INNER JOIN images ON app_desc.bundle_id = images.bundle_id	INNER JOIN rating ON images.bundle_id = rating.bundle_id INNER JOIN bundle ON rating.bundle_id = bundle.bundle_id WHERE app_desc.bundle_id =  '"+idd+"' LIMIT 10")
		row = cursor.fetchone()
		cursor.close()
		app_name = row[0]
		icon = img
		track_url = url
		rating = row[3]
		bundle_id = idd
		version = row[1]
		genre = row[2]
		#lis = []
		
		if len(app_name) > 16:
			app_name = app_name[0:14]+"..."
		
		img_str = ""
		count = 0
		'''
		if int(rating)<=5:
			for i in range(0,int(rating)):
				img_str= img_str+"<img src='/static/img/full.png' alt='' style='height:12px'>"
				count = count + 1
          	half = rating - int(rating)
          	if half==0.5:
          		img_str=img_str+"<img src='/static/img/half.png' alt='' style='height:12px'>"
            	count = count + 1
        	while count<5:
				img_str = img_str+"<img src='static/img/empty.png' alt='' style='height:12px'>"
            	count = count + 1
          
		#print html_str
		'''
		lis = [img_str,url,img,app_name,version,genre]
		return json.dumps(lis)

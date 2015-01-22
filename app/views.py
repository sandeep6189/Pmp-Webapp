from app import app
from models import User , User_Preferences
from flask import request, redirect, url_for, send_from_directory ,flash ,render_template ,g ,session
from flask_debugtoolbar import DebugToolbarExtension
from flaskext.mysql import MySQL
from flask.ext.login import LoginManager , login_user, logout_user, current_user, login_required , UserMixin
import json,datetime,time
import MySQLdb
from user_agents import parse
from forms import LoginForm
from app import lm,db
from flask_googlelogin import GoogleLogin
from flask.ext.social import Social
from flask.ext.social.datastore import SQLAlchemyConnectionDatastore
from flask.ext.security import Security , SQLAlchemyUserDatastore
from oauth import OAuthSignIn

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
googlelogin = GoogleLogin(app)
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



@lm.user_loader
def load_user(id):
    return User.query.get(int(id))

@app.before_request
def before_request():
    g.user = current_user


@app.route("/index")
@login_required
def hello_world():
	ua = request.headers.get('User-Agent')
	user_agent = parse(ua)
	if user_agent.is_pc:
		user = g.user.nickname
		image = g.user.image
		return render_template('index.html',title='home',user=user,image=image)
	elif user_agent.is_mobile:
		return render_template('index-mobile.html')

@app.route("/")
@app.route('/login', methods=['GET', 'POST'])
def login():
    if g.user is not None and g.user.is_authenticated():
    	print g.user
        return redirect("/index")
    form = LoginForm()
    '''
    if form.validate_on_submit():
        session['remember_me'] = form.remember_me.data
        return oid.try_login(form.openid.data, ask_for=['nickname', 'email','image','gender','country','phone','dob','timezone'])
    '''
    return render_template('login.html',
                           title='Sign In',
                           form=form)

def dump(obj):
  for attr in dir(obj):
    print "obj.%s = %s" % (attr, getattr(obj, attr))


@app.route('/authorize/<provider>')
def oauth_authorize(provider):
    if not current_user.is_anonymous():
        return redirect('/index')
    oauth = OAuthSignIn.get_provider(provider)
    return oauth.authorize()


@app.route('/callback/<provider>')
def oauth_callback(provider):
    if not current_user.is_anonymous():
        return redirect('/index')
    oauth = OAuthSignIn.get_provider(provider)
    social_id, username, email,gender,timezone,image,locale = oauth.callback()
    #print image
    if social_id is None:
        flash('Authentication failed.')
        return redirect('/index')
    user = User.query.filter_by(social_id=social_id).first()
    if not user:
        user = User(social_id=social_id, nickname=username, email=email,gender=gender,timezone=timezone,image=image,country=locale)
        db.session.add(user)
        db.session.commit()
    login_user(user, True)
    return redirect('/index')


def after_login(resp):
    if resp.email is None or resp.email == "":
    	flash('Invalid login. Please try again.')
    	return redirect(url_for('login'))
    dump(resp)
    user = User.query.filter_by(email=resp.email).first()
    if user is None:
        nickname = resp.nickname
        if nickname is None or nickname == "":
            nickname = resp.email.split('@')[0]
        user = User(nickname=nickname, email=resp.email)
        db.session.add(user)
        db.session.commit()
    remember_me = False
    if 'remember_me' in session:
        remember_me = session['remember_me']
        session.pop('remember_me', None)
    login_user(user, remember=remember_me)
    return redirect(request.args.get('next') or url_for('index'))


@app.route('/add_preferences',methods=['POST','GET'])
@login_required
def add_preferences():
	if request.method=="GET":
		user = g.user.nickname
		email = g.user.email
		image = g.user.image
		return render_template('preferences.html',user=user,email=email,image=image)
	elif request.method=="POST":
		userName = request.form["user"]
		userEmail = request.form["email"]
		bundleId = request.form["bundleId[0][]"]
		aa = User_Preferences.query.filter_by(email=userEmail).first()
		if aa:
			b = aa.preferences
			bundleId = bundleId + ";"+b
		print bundleId
		db1 = MySQLdb.connect("localhost","root","admin","login_users" )
		cursor =db1.cursor()
		if(aa and aa.email):
			aa.preferences = bundleId
			db.session.commit()
		else:
			cursor.execute("INSERT INTO  `login_users`.`user__preferences` (`nickname` ,`preferences` ,`last_accessed` ,`last_updated` ,`email`) VALUES ('"+userName+"',  '"+bundleId+"',  '"+time.strftime('%Y-%m-%d %H:%M:%S')+"',  '"+time.strftime('%Y-%m-%d %H:%M:%S')+"',  '"+userEmail+"');")
			print "INSERT INTO  `login_users`.`user__preferences` (`nickname` ,`preferences` ,`last_accessed` ,`last_updated` ,`email`) VALUES ('"+userName+"',  '"+bundleId+"',  '"+time.strftime('%Y-%m-%d %H:%M:%S')+"',  '"+time.strftime('%Y-%m-%d %H:%M:%S')+"',  '"+userEmail+"');"
			db1.commit()
		return "Success"			


@app.route('/get_preferences',methods=['POST','GET'])
@login_required
def get_preferences():
	if request.method == "POST":
		user = json.loads(request.data)
		userName = user["user"]
		email = user["email"]
		user_pref_obj = User_Preferences.query.filter_by(email=email).first()
		current_preferences = user_pref_obj.preferences
		if(current_preferences):
			current = current_preferences.split(";")
			#print current
			return get_data_from_id_2(current)
		return ""		

@app.route('/remove_preferences',methods=['POST','GET'])
@login_required
def remove_preferences():
	if request.method == "POST":
		userName = request.form["user"]
		userEmail = request.form["email"]
		bundle_id = request.form["bundleId[0][]"]
		user_pref_obj = User_Preferences.query.filter_by(email=userEmail).first()
		current_preferences = user_pref_obj.preferences
		#print current_preferences
		if(current_preferences):
			current = current_preferences.split(";")
			current.remove(bundle_id)
			pref = ";".join(current)
			#print pref
			#update the user preference table
			user_pref_obj.preferences = pref
			db.session.commit()
			return "1"
		return "0"

@app.route('/logout')
def logout():
    logout_user()
    return redirect('/index')


@app.route("/info_apps",methods=['GET','POST'])
def info_apps():
	if request.method == "POST":
		id_app = request.form["bundle_id[0][]"]
		cursor = mysql.connect().cursor()
		cursor.execute("SELECT * FROM `app_desc` WHERE `bundle_id`="+id_app+"  LIMIT 0 , 1")
		data = cursor.fetchone()
		cursor.close()
		lis = {}
		lis["version"] = data[2]
		lis["genre"] = data[4]
		lis["description"] = data[3]
		return json.dumps(lis)




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
			row_data["version"] = row[3]
			row_data["genre"] = row[5]
			row_data["app_name"] = row[2]
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
			row_data["version"] = row[3]
			row_data["genre"] = row[5]
			row_data["app_name"] = row[2]
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
			row_data["version"] = row[3]
			row_data["genre"] = row[5]
			row_data["app_name"] = row[2]
			row_data["icon"] = row[7]
			row_data["track_url"] = row[6]
			row_data["avg_rating"] = row[10]
			row_data["bundle_id"] = row[1]
			lis.append(row_data)
			#print row_data
		return json.dumps(lis)

def get_data_from_id(data):
	cursor = mysql.connect().cursor()
	lis = []
	for row in data:
		bundle_id = row
		cursor.execute("SELECT `app_desc`.`bundle_id`,`app_desc`.`app_name`,`app_desc`.`version`,`app_desc`.`genre`,`images`.`icon`, `images`.`screenshot`, `rating`.`avg_rating`, `rating`.`rating_count`,`bundle`.`track_url` FROM app_desc INNER JOIN images ON app_desc.bundle_id = images.bundle_id INNER JOIN rating ON images.bundle_id = rating.bundle_id INNER JOIN bundle ON rating.bundle_id = bundle.bundle_id WHERE app_desc.bundle_id =  '"+bundle_id+"' LIMIT 10")
		cur_data = cursor.fetchone()
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


@app.route("/search",methods=['POST'])
def search():
	if request.method == "POST":
		app.config['MYSQL_DATABASE_DB'] = 'pmp'
		query = request.form['query']
		cursor = mysql.connect().cursor()
		cursor.execute("SELECT DISTINCT `bundle_id` FROM `app_desc` WHERE `app_name` LIKE '%"+query+"%' LIMIT 10")
		data = cursor.fetchall()
		lis = []
		for row in data:
			lis.append(row[0])
		return get_data_from_id(lis)


@app.route("/search_new",methods=['POST'])
def search_new():
	if request.method == "POST":
		app.config['MYSQL_DATABASE_DB'] = 'pmp'
		query = request.form['query']
		#print query
		cursor = mysql.connect().cursor()
		cursor.execute("SELECT DISTINCT `bundleid` FROM `recommend` WHERE `name` LIKE '%"+query+"%' LIMIT 10")
		data = cursor.fetchall()
		lis = []
		for row in data:
			lis.append(row[0])
		return get_data_from_id_2(lis)

def get_data_from_id_2(data):
	cursor = mysql.connect().cursor()
	#print cursor.description
	lis = []
	for row in data:
		bundle_id = row
		cursor.execute("SELECT * FROM `recommend` WHERE `bundleid` = '"+bundle_id+"' LIMIT 10")
		field_names = [i[0] for i in cursor.description]
		indices = []
		#get accessed fields
		for i in range(0,len(field_names)):
			if "accessed" in field_names[i]:
				indices.append(i)
		#get recommended fields
		indices_recommend = []
		for i in range(0,len(field_names)):
			if "recommend" in field_names[i]:
				indices_recommend.append(i)

		cur_data = cursor.fetchone()
		privacy_data_accessed = []
		recommended_protect = []
		dic = {}

		if cur_data !=None:
			dic['name'] = cur_data[1]
			dic['version'] = cur_data[2]
			dic['bundleid'] = cur_data[0]
			for i in indices:
				if cur_data[i]>=1:
					privacy_data_accessed.append(textify(field_names[i]))
			for i in indices_recommend:
				if cur_data[i]=="0":
					recommended_protect.append({"field_name":textify_recommend(field_names[i]),"value":"No"})
				elif cur_data[i]=="1":
					recommended_protect.append({"field_name":textify_recommend(field_names[i]),"value":"Yes"})
			dic['privacy'] = privacy_data_accessed
			dic['recommended_protect'] = recommended_protect
			#print recommended_protect
			lis.append(dic)
	dic2 = {}
	dic2["entries"]=lis
	return json.dumps(dic2)


def textify(field_name):
	st = field_name.split("_")
	st[0] = st[0].title()
	return " ".join(st)

def textify_recommend(field_name):
	st = field_name.split("_")[1:]
	#st = st[1:]
	st[0] = st[0].title()
	return " ".join(st)	

@app.route("/info",methods=['POST','GET'])
def info():
	data = '''<div class="content white">
	<div id='back' style='padding:0'>
			<div class='arrow-left'>
			</div>
			<div class='rect' style='padding-top:5px;'>
			<span class='rect-text' style='margin-left:4px'>Back</span>
			</div>
		</div>
	<h2>Info</h2>
	<div class="accordion-container">
		<a href="#" class="accordion-toggle">Why Pmp ? <span class="toggle-icon"><i class="fa fa-plus-circle"></i></span></a>
		<div class="accordion-content">
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
		</div>
		<!--/.accordion-content-->
	</div>
	<!--/.accordion-container-->
	<div class="accordion-container">
		<a href="#" class="accordion-toggle">FAQ <span class="toggle-icon"><i class="fa fa-plus-circle"></i></span></a>
		<div class="accordion-content">
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
		</div>
		<!--/.accordion-content-->
	</div>
	<!--/.accordion-container-->
	<div class="accordion-container">
		<a href="#" class="accordion-toggle">Privacy Policy <span class="toggle-icon"><i class="fa fa-plus-circle"></i></span></a>
		<div class="accordion-content">
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
		</div>
		<!--/.accordion-content-->
	</div>
	<!--/.accordion-container-->
	<div class="accordion-container">
		<a href="#" class="accordion-toggle">Terms of Service <span class="toggle-icon"><i class="fa fa-plus-circle"></i></span></a>
		<div class="accordion-content">
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
		</div>
		<!--/.accordion-content-->
	</div>
	<!--/.accordion-container-->
	<div class="accordion-container">
		<a href="#" class="accordion-toggle">Contact Us <span class="toggle-icon"><i class="fa fa-plus-circle"></i></span></a>
		<div class="accordion-content">
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
		</div>
		<!--/.accordion-content-->
	</div>
	<!--/.accordion-container-->
	</div>'''
	return data


@app.route("/app_details",methods=['POST'])
def app_details():
	if request.method == "POST":
		img = request.form['img_src']
		url = request.form['url']
		idd =  request.form['id']
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
		#print idd
		cursor = mysql.connect().cursor()
		cursor.execute("SELECT app_desc.app_name,app_desc.version,app_desc.genre, rating.avg_rating FROM app_desc INNER JOIN images ON app_desc.bundle_id = images.bundle_id	INNER JOIN rating ON images.bundle_id = rating.bundle_id INNER JOIN bundle ON rating.bundle_id = bundle.bundle_id WHERE app_desc.bundle_id =  '"+idd+"' LIMIT 10")
		row = cursor.fetchone()
		cursor.close()
		#print row
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

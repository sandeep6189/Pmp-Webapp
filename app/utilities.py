import json
import urllib2

#function to get image from apple
def get_image_url(bundleid):
	req = urllib2.urlopen("http://itunes.apple.com/lookup?bundleId="+str(bundleid))
	data = None
	image_url = None
	if req:
		data = json.loads(req.read())
	if data:
		try:
			image_url = data['results'][0]['artworkUrl60']
		except Exception: 
			image_url = ""
	print image_url
	return image_url

#function to get processed text for accesses column
def textify(field_name):
	st = field_name.split("_")[1:]
	st[0] = st[0].title()
	return " ".join(st)

#function to get processed text for recommend column
def textify_recommend(field_name):
	st = field_name.split("_")[1:]
	#st = st[1:]
	st[0] = st[0].title()
	return " ".join(st)
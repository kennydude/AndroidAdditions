'''
Generate Manifest

Due to changes in Chrome, this is manual. Google, you can be a pest when you want to be
'''

import glob, json

files = glob.glob("content/*/*")
manifest = json.load(open("manifest.json.template", "r"))
manifest['web_accessible_resources'] = files

o = open("manifest.json", "w")
json.dump(manifest, o)
o.close()

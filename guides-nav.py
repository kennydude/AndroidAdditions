'''
Generate Guide
'''

import glob

files = glob.glob("content/guides/*")

nav = {}
for file in files:
	f = open(file, "r")
	s = f.read()
	f.close()
	
	fname = file.split("/")[-1].split(".")
	fname[-1] = "txt"
	fname = ".".join(fname)
	for line in s.split("\n"):
		if line[0] == "#":
			title = line[1:].strip()
			break
	
	print "> %s = %s" % (fname, title)
	nav[fname] = title

file = '''
<div class="nav-section-header"><a href="#">
<span class="en" style="display: inline; ">Android Additions</span>
</a></div>

<ul style="display: block; ">
'''

for (fname, title) in nav.items():
	file += '''
      <li><a href="%s">
            <span class="en" style="display: inline; ">%s</span></a>
      </li>
''' % (fname, title)

file += '''
</ul>
'''

f = open("bin/content/guides/nav.html", "w")
f.write(file)
f.close()

print "OK"

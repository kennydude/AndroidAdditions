all:
	python manifest.py
package:
	zip extension.zip content/*/* manifest.json jquery.min.js page.js guide.html guide.js page.css
	echo "Extension is ready at extension.zip"

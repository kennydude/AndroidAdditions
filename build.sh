echo "Android Additions"
echo "Building..."

python guides-nav.py
python manifest.py
echo "Manifest: Done"

mkdir -p bin
cp manifest.json jquery.min.js guide.html guide.js page.css page.js bin/
echo "Copy: Done"

MDFILES=`find -name *.md`;

for file in $MDFILES; do
	myfile=${file/md/txt};
	dir=`dirname $myfile`;
	dir="bin/$dir";
	mkdir -p "$dir";
	markdown $file -o "bin/$myfile"; \
done;
echo "Markdown: Done"

for file in `ls content/*/class-ov.js`; do
	cp $file bin/$file
done;

cd bin
zip ../extension.zip content/*/* manifest.json jquery.min.js page.js guide.html guide.js page.css
cd ..
echo "Zipping: Done"

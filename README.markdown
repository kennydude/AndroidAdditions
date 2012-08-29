# Android Additions

Notes: You need Make installed. Most good OS's have this (NOT Windows. I don't know how to install it there, nor do I care).

Run `./buid.sh` to build + package.

**Note:** you may need the `markdown` command line tool:

	sudo apt-get install discount

## Adding Content

Multiple places

* content/className/class-ov.md - Class Overview for `className`
* content/className/method.md - Method information
* content/design/filename.md - Design information. You need to get the filename of the image in use, replace all `/` with `_` except the first one and add notes you want to be inserted after the image. Sorry, it's just not intended for extras
* content/guides/file.md - Add a guide. You must add it to nav.html too or it won't show up!

If you do add content, feel free to fork, add your name (if you want) and content and submit a pull request.

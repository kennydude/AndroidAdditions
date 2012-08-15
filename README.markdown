# Android Additions

Notes: You need Make installed. Most good OS's have this (NOT Windows. I don't know how to install it there, nor do I care).

Run `make` to build the manifest (to skate around manifest permission errors).

Run `make package` to package up for Webstore

## Adding Content

Multiple places

* content/className/class-ov.txt - Class Overview for `className`
* content/className/method.txt - Method information
* content/design/filename.txt - Design information. You need to get the filename of the image in use, replace all `/` with `_` except the first one and add notes you want to be inserted after the image. Sorry, it's just not intended for extras
* content/guides/file.html - Add a guide. You must add it to nav.html too or it won't show up!

If you do add content, feel free to fork, add your name (if you want) and content and submit a pull request.

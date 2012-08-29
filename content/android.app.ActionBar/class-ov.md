Want to keep back-compatability? [ActionBarSherlock](http://abs.io) is here to help.

Also, if you want a progress spinner in the ActionBar:

	public boolean onCreateOptionsMenu(final Menu menu) {
		// Inflate Layout here

		// ProgressBar
		if(isRefreshing){
			ProgressBar p = new ProgressBar(this, null, android.R.attr.progressBarStyleSmall);
			menu.findItem(R.id.refreshAction).setActionView(p).setEnabled(false);
		}

		// Do other crazy stuff here
	}
[Gist from GitHub](https://gist.github.com/3512711)

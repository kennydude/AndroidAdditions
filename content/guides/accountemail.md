# Quick Sign in

Written by @kennydude from the App Clinic by Google [here](https://www.youtube.com/watch?v=jg8ID7UZDT8)

First of all you need the [Google Play Services](https://developers.google.com/android/google-play-services/authentication)

## Ask for an account

You can do this:

	Intent intent = AccountPicker.newChooseAccountIntent( null, null, new String[]{ "com.google" }, false, null, null, null, null);
	startActivityForResult(intent, RQ_ACCOUNTPICKER);

Where `RQ_ACCOUNTPICKER` is a integer you have for your account.

You can ask for any account in the Android account system, but here we are asking for `com.google` accounts aka Google Accounts.

## On return from the picker

	protected void onActivityResult(int requestCode, int resultCode){
		if( (requestCode == RQ_ACCOUNTPICKER || requestCode == RQ_USERAUTH && resultCode == RESULT_OK){
			String accountName = data.getString(AccountManager.KEY_ACCOUNT_NAME);

			// Start a background thread to finish the deal
			new AuthTask().execute(accountName);
		}
	}

	private class AuthTask extends AsyncTask<String...>{
		@Override
		protected Long doInBackground(String... params){
			try{
				String token = GoogleAuthUtil.getToken( MyActivity.this, params[0], "oauth2:https://www.googleapis.com/auth/userinfo.profile");
				URL url = new URL("https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + token);
				HttpURLConnection con = (HttpURLConnection) url.openConnection();
				int serverCode = con.getResponseCode();
				if( serverCode == 200){
					// Read the response
				} else{
					// handle error
				}
			} catch( UserRecoverableAuthException e){
				startActivityForResult(e.getIntent(), RQ_USER_AUTH);
			}
		}
	}

You get a JSON response from Google which will tell you:

* User ID
* Gender
* Birthday
* Picture
* Name

And this looks like:

	{
	 "id": "00000000000000",
	 "email": "fred.example@gmail.com",
	 "verified_email": true,
	 "name": "Fred Example",
	 "given_name": "Fred",
	 "family_name": "Example",
	 "picture": "https://lh5.googleusercontent.com/-2Sv-4bBMLLA/AAAAAAAAAAI/AAAAAAAAABo/bEG4kI2mG0I/photo.jpg",
	 "gender": "male",
	 "locale": "en-US"
	}

And to read the JSON add to `// Read the response`:

	InputStream is = con.getInputStream();
	BufferedInputStream bis = new BufferedInputStream(is);
	ByteArrayBuffer baf = new ByteArrayBuffer(50);

	int current = 0;
	while((current = bis.read()) != -1){
	baf.append((byte)current);
	}

	/* Convert the Bytes read to a String. */
	String json = new String(baf.toByteArray());
	JSONObject profile = new JSONObject(json);

So for example:

	String name = profile.getString("name");

See Also

* [Using OAuth2 For Login @ Google Developers](https://developers.google.com/accounts/docs/OAuth2Login)
* [App Clinic](https://www.youtube.com/watch?v=jg8ID7UZDT8&feature=player_embedded)

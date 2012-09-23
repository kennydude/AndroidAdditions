# Contact Sync
Written by [kennydude](http://twitter.com/kennydude)

Please note: To keep up, you must have a fairly good understanding of how Android works.

Contact Sync is extremely complex to understand, but once you have mastered it and sync adapters, it's insanely good to use. For my guide on how to make contact sync work, I'm going to be using some bits of code behind [Boid for Android](http://boidapp.com) to show you it is really in-use :)

## Metadata required

First of all, you need to add some items to the manifest like so:

	<!-- Contact Sync -->
	<service
		android:name="com.teamboid.twitter.contactsync.AccountAuthenticatorService"
		android:exported="false" android:process=":auth">
		<intent-filter>
			<action android:name="android.accounts.AccountAuthenticator" />
		</intent-filter>

		<meta-data android:name="android.accounts.AccountAuthenticator"
			android:resource="@xml/authenticator" />
	</service>
	<service android:name="com.teamboid.twitter.contactsync.ContactSyncAdapterService"
		android:exported="false" android:process=":contacts">
		<intent-filter>
			<action android:name="android.content.SyncAdapter" />
		</intent-filter>

		<meta-data android:name="android.content.SyncAdapter"
			android:resource="@xml/sync_contacts" />
		<meta-data android:name="android.provider.CONTACTS_STRUCTURE"
			android:resource="@xml/contact_structure" />
	</service>

Don't forget the permissions (gulp!):

	<uses-permission android:name="android.permission.READ_CONTACTS" />
	<uses-permission android:name="android.permission.WRITE_CONTACTS" />
	<uses-permission android:name="android.permission.GET_ACCOUNTS" />
	<uses-permission android:name="android.permission.MANAGE_ACCOUNTS" />
	<uses-permission android:name="android.permission.AUTHENTICATE_ACCOUNTS" />
	<uses-permission android:name="android.permission.READ_SYNC_SETTINGS" />
	<uses-permission android:name="android.permission.WRITE_SYNC_SETTINGS" />

A few things to note about this bit of manifest is that we have 2 services. One is an "Account Authenticator" which allows you to insert accounts into the "Accounts" section on the system preferences. Second is the actual Contact Sync service which defines some information to Android to say that it is in fact providing contact information and what information it is planning on providing (the structure).

The `@xml/authenticator` resource will look something like this:

	<?xml version="1.0" encoding="UTF-8"?>
	<account-authenticator xmlns:android="http://schemas.android.com/apk/res/android"
		android:accountType="com.teamboid.twitter.account" android:icon="@drawable/launcher_icon"
		android:smallIcon="@drawable/launcher_icon" android:label="@string/app_name" />

This says that we have an account type of `com.teamboid.twitter.account` with an icon, and name. You can choose seperate `smallIcon` but it doesn't seem to make much of a difference.

Next up is the `@xml/sync_contacts` resource:

	<?xml version="1.0" encoding="utf-8"?>
	<sync-adapter xmlns:android="http://schemas.android.com/apk/res/android"
	    android:contentAuthority="com.android.contacts"
	    android:supportsUploading="false"
	    android:accountType="com.teamboid.twitter.account" />

Which says that this SyncAdapter will be providing `com.android.contacts` with data, but not allowing the user to edit and upload data (as you cannot edit other's profiles on Twitter) and this information will be available for accounts that are of the same type as above. This means that Twitter Accounts will get Twitter profiles added to contacts.

If you want to move onto Sync Adapters for others (like Boid does with notifications)

### READMORE

You will need to add to your manifest a "provider" for your custom data:

	<provider android:name="com.teamboid.twitter.notifications.NotificationsProvider"
		android:authorities="com.teamboid.twitter.notifications"
		android:exported="true" android:label="@string/notifications"
		android:process=":contacts" android:syncable="true" />

With a custom `authorites` for your data, in this case notifications. We say it is syncable, and that allows Android to signal to refresh when it wants to. No Alarms here!

We have a template content provider which does nothing, for simplicity (allows you to store locally in SharedPreferences because it's easier!). Here is that:

	package com.teamboid.twitter.utilities;

	import android.content.ContentProvider;
	import android.content.ContentValues;
	import android.database.Cursor;
	import android.net.Uri;

	/**
	 * Does nothing.
	 * @author kennydude
	 *
	 */
	public class EmptyContentProvider extends ContentProvider {
		@Override
		public int delete(Uri arg0, String arg1, String[] arg2) {
			return 0;
		}

		@Override
		public String getType(Uri arg0) {
			return null;
		}

		@Override
		public Uri insert(Uri arg0, ContentValues arg1) {
			return null;
		}

		@Override
		public boolean onCreate() {
			return true;
		}

		@Override
		public Cursor query(Uri arg0, String[] arg1, String arg2, String[] arg3,
				String arg4) {
			return null;
		}

		@Override
		public int update(Uri arg0, ContentValues arg1, String arg2, String[] arg3) {
			return 0;
		}
	}

### ENDREADMORE

Next up is the actual contact structure. This allows you to define the Actions like "View Profile"

	<?xml version="1.0" encoding="UTF-8"?>
	<ContactsAccountType
	    viewContactNotifyService="com.teamboid.twitter.contactsync.ContactViewNotifyService"
	    xmlns:android="http://schemas.android.com/apk/res/android">
		<ContactsDataKind android:icon="@drawable/launcher_icon"
			android:mimeType="vnd.android.cursor.item/vnd.com.teamboid.twitter.account"
			android:summaryColumn="data2" android:detailColumn="data3"
			android:detailSocialSummary="true" />
	</ContactsAccountType>

This is where it gets tricky and confusing for me. Basically, we define a type of contact information as an account listing. Which we use certain colmums `data2` and `data3` for different information and mark it as a Social Summary. (If you figure this out better, please edit this guide on [github](http://github.com/kennydude/AndroidAdditions)!)

Now we can code!

## Code!!!!

We need to implement a sync adapter. Generally these are pretty simple following a simplistic template:

	public class MySyncAdapter extends Service{
		@Override
		public IBinder onBind(Intent arg0) {
			return getSyncAdapter().getSyncAdapterBinder();
		}

		SyncAdapterImpl instance;

		SyncAdapterImpl getSyncAdapter() {
			if (instance == null)
				instance = new SyncAdapterImpl(this);
			return instance;
		}

		public class SyncAdapterImpl extends AbstractThreadedSyncAdapter {
			public Context mContext;

			public BaseTwitterSync(Context context) {
				super(context, true);
				mContext = context;
			}

			@Override
			public final void onPerformSync(Account account, Bundle extras,
					String authority, ContentProviderClient provider,
					SyncResult syncResult) {
				// do something here
			}
		}
	}

However, for Contact Syncing we need to actually save the contacts somewhere. Now, this is the real nightmare!

You need to interact with the contact service.

### Starting off

I reconmend using a version to define if you should keep or remove contacts, it's up to you exactly. Either way, I reconmend you grab all of the contacts at the beginning:

	// inside of SyncAdapterImpl
	class TempoaryContactDetails {
		public String version;
		public Long id;

		public TempoaryContactDetails(String v, Long rawid) {
			id = rawid;
			version = v;
		}
	}

	// begining of onPerformSync
		// Here we can actually sync
		HashMap<String, TempoaryContactDetails> existingAccounts = new HashMap<String, TempoaryContactDetails>();

		// Step 1: Get all existing contacts with username, raw contact ID
		// (to remove) and version
		Uri rawContactUri = RawContacts.CONTENT_URI
				.buildUpon()
				.appendQueryParameter(RawContacts.ACCOUNT_NAME,
						account.name)
				.appendQueryParameter(RawContacts.ACCOUNT_TYPE,
						account.type).build();
		Cursor c1 = mContext.getContentResolver().query(
				rawContactUri,
				new String[] { BaseColumns._ID, RawContacts.SYNC1,
						RawContacts.SYNC4 }, null, null, null);
		while (c1.moveToNext()) {
			Log.d("contactsync", c1.getString(1) + "");
			if(existingAccounts.containsKey(c1.getString(1))){
				deleteContact(c1.getLong(0));
			} else{
				existingAccounts.put(
						c1.getString(1),
						new TempoaryContactDetails(c1.getString(2), c1
								.getLong(0)));
			}
		}

### Adding Contacts

Now, you will fetch all of your users from wherever they are. When you add one to Android, remove it from the HashMap. We use `SYNC1` to store a username of the user, which you could use whatever is similar for your service.

You then add them into Android (note: `User` is a Boid class for a user and `CONTACT_VERSION` is the version number of contact sync info):

	// SyncAdapterImpl
	public void addContact(User user) {
		ArrayList<ContentProviderOperation> operationList = new ArrayList<ContentProviderOperation>();

		ContentProviderOperation.Builder builder = ContentProviderOperation
				.newInsert(RawContacts.CONTENT_URI);
		builder.withValue(RawContacts.ACCOUNT_NAME, account.name);
		builder.withValue(RawContacts.ACCOUNT_TYPE, account.type);
		builder.withValue(RawContacts.SYNC1, user.getScreenName());
		builder.withValue(RawContacts.SYNC4, CONTACT_VERSION);
		operationList.add(builder.build());

		// Add Extra Information

		try {
			Log.d("sync", "Adding " + user.getScreenName() + " to Android");
			mContext.getContentResolver().applyBatch(
					ContactsContract.AUTHORITY, operationList);
		} catch (Exception e) {
			Log.d("sync", "Couldn't add " + user.getScreenName());
		}

	}

The one "Add Extra Information" you'll probbably want to add is a "View Profile" link:

	builder = ContentProviderOperation
			.newInsert(ContactsContract.Data.CONTENT_URI);
	builder.withValueBackReference(
			ContactsContract.Data.RAW_CONTACT_ID, 0);
	builder.withValue(ContactsContract.Data.MIMETYPE,
			"vnd.android.cursor.item/vnd.com.teamboid.twitter.account");
	builder.withValue(ContactsContract.Data.DATA1, user.getScreenName());
	builder.withValue(ContactsContract.Data.DATA2, "Twitter Profile");
	builder.withValue(ContactsContract.Data.DATA3, "View profile");
	operationList.add(builder.build());

If you want more details, here's some help for "Add Extra Information":

### READMORE

Real name:

	builder = ContentProviderOperation
			.newInsert(ContactsContract.Data.CONTENT_URI);
	builder.withValueBackReference(
			ContactsContract.CommonDataKinds.StructuredName.RAW_CONTACT_ID,
			0);
	builder.withValue(
			ContactsContract.Data.MIMETYPE,
			ContactsContract.CommonDataKinds.StructuredName.CONTENT_ITEM_TYPE);
	builder.withValue(
			ContactsContract.CommonDataKinds.StructuredName.DISPLAY_NAME,
			user.getName());
	operationList.add(builder.build());

Nickname:

	builder = ContentProviderOperation
			.newInsert(ContactsContract.Data.CONTENT_URI);
	builder.withValueBackReference(
			ContactsContract.Data.RAW_CONTACT_ID, 0);
	builder.withValue(ContactsContract.Data.MIMETYPE,
			ContactsContract.CommonDataKinds.Nickname.CONTENT_ITEM_TYPE);
	builder.withValue(ContactsContract.CommonDataKinds.Nickname.NAME,
			user.getScreenName());
	builder.withValue(ContactsContract.CommonDataKinds.Nickname.TYPE,
			ContactsContract.CommonDataKinds.Nickname.TYPE_CUSTOM);
	builder.withValue(ContactsContract.CommonDataKinds.Nickname.LABEL,
			"Twitter Screen Name");
	operationList.add(builder.build());

Description/Bio:

	builder = ContentProviderOperation
			.newInsert(ContactsContract.Data.CONTENT_URI);
	builder.withValueBackReference(
			ContactsContract.Data.RAW_CONTACT_ID, 0);
	builder.withValue(ContactsContract.Data.MIMETYPE,
			ContactsContract.CommonDataKinds.Note.CONTENT_ITEM_TYPE);
	builder.withValue(ContactsContract.CommonDataKinds.Note.NOTE,
			user.getDescription());
	operationList.add(builder.build());

Website:

	builder = ContentProviderOperation
			.newInsert(ContactsContract.Data.CONTENT_URI);
	builder.withValueBackReference(
			ContactsContract.Data.RAW_CONTACT_ID, 0);
	builder.withValue(ContactsContract.Data.MIMETYPE,
			ContactsContract.CommonDataKinds.Website.CONTENT_ITEM_TYPE);
	builder.withValue(ContactsContract.CommonDataKinds.Website.URL,
			user.getUrl());
	builder.withValue(ContactsContract.CommonDataKinds.Website.TYPE,
			ContactsContract.CommonDataKinds.Website.TYPE_CUSTOM);
	builder.withValue(ContactsContract.CommonDataKinds.Website.LABEL,
			"Profile Link");
	operationList.add(builder.build());

### ENDREADMORE

### Finishing Off

At the end, remove those which are no longer around:

	// SyncAdapterImpl
	private void deleteContact(long rawContactId) {
		Uri uri = ContentUris
				.withAppendedId(RawContacts.CONTENT_URI, rawContactId)
				.buildUpon()
				.appendQueryParameter(
						ContactsContract.CALLER_IS_SYNCADAPTER, "true")
				.build();
		ContentProviderClient client = mContext.getContentResolver()
				.acquireContentProviderClient(
						ContactsContract.AUTHORITY_URI);
		try {
			client.delete(uri, null, null);
		} catch (RemoteException e) {
			e.printStackTrace();
		}
		client.release();
	}
	
	// onPerformSync:
	for (TempoaryContactDetails acc : existingAccounts.values()) {
		deleteContact(acc.id);
	}

### View Profile

So, you may have noticed that that button does nothing. Want to fix that?

On your view profile Activity, add this filter (changing mimetype which you seen above):

	<intent-filter>
		<action android:name="android.intent.action.VIEW" />
		<category android:name="android.intent.category.DEFAULT" />
		<data android:mimeType="vnd.android.cursor.item/vnd.com.teamboid.twitter.account" />
	</intent-filter>

Then, in your Activity you will want something like:

	if (getIntent().getDataString().contains("com.android.contacts")) {
		// Loading from contact (contact syncing)
		getLoaderManager().initLoader(LOAD_CONTACT_ID, null,
				new LoaderManager.LoaderCallbacks<Cursor>() {

					@Override
					public Loader<Cursor> onCreateLoader(int arg0,
							Bundle arg1) {
						return new CursorLoader(
								ProfileScreen.this,
								getIntent().getData(),
								new String[] { ContactsContract.Data.DATA1 },
								null, null, null);
					}

					@Override
					public void onLoadFinished(Loader<Cursor> arg0,
							Cursor cursor) {
						cursor.moveToNext();
						loadUI(
								cursor.getString(cursor
										.getColumnIndex(ContactsContract.Data.DATA1)));
					}

					@Override
					public void onLoaderReset(Loader<Cursor> arg0) {
					}

				});
		setTitle(R.string.please_wait);
	}

You only need to follow and else and load the other way you may have, and have the function `loadUI` to actually load the UI for that username. Oh, and we ask to wait while we do so but you could change that. And, we persume the class is `ProfileScreen`

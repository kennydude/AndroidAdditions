And here's one I did earlier (Blue Peter style!):

	import java.util.ArrayList;
	import java.util.List;

	import android.support.v4.app.Fragment;
	import android.support.v4.app.FragmentManager;
	import android.support.v4.app.FragmentPagerAdapter;
	import android.support.v4.app.FragmentTransaction;
	import android.support.v4.view.ViewPager;
	import android.util.Log;
	import android.view.ViewGroup;
	import com.actionbarsherlock.app.ActionBar.Tab;
	import com.actionbarsherlock.app.ActionBar.TabListener;
	import com.actionbarsherlock.app.SherlockFragmentActivity;

	public class FragmentAdapter extends FragmentPagerAdapter implements TabListener, ViewPager.OnPageChangeListener {
		public FragmentAdapter(SherlockFragmentActivity a, FragmentManager fm) {
			super(fm);
			this.mContext = a;
			this.mManager = fm;
			mPager = (ViewPager) a.findViewById(R.id.pager);
			mPager.setOnPageChangeListener(this);
		
		}
		SherlockFragmentActivity mContext;
		FragmentManager mManager;
		ViewPager mPager;
	
		static class FragmentInfo{
			public String fragment;
			public int stringId;
		}

		private List<FragmentInfo> fragments = new ArrayList<FragmentInfo>();

		@Override
		public Fragment getItem(int position) {
			return Fragment.instantiate(mContext, fragments.get(position).fragment);
		}
	
		public Fragment getCurrent(){
			return mManager.findFragmentByTag( makeFragmentName(mPager.getCurrentItem()) );
		}
	
		public void addFragment(Class<?> name, int string){
			FragmentInfo fi = new FragmentInfo();
			fi.fragment = name.getName();
			fi.stringId = string;
			fragments.add(fi);
		
			Tab tab = mContext.getSupportActionBar().newTab();
			tab.setText(string).setTabListener(this);
			mContext.getSupportActionBar().addTab(tab);
		
			notifyDataSetChanged();
		}

		@Override
		public int getCount() {
			return fragments.size();
		}
	
		private FragmentTransaction mCurTransaction;
		private Fragment mCurrentPrimaryItem;
	
	    @Override
	    public void destroyItem(ViewGroup container, int position, Object object) {
		if (mCurTransaction == null) {
		    mCurTransaction = mManager.beginTransaction();
		}
		mCurTransaction.detach((Fragment)object);
	    }
	
		@Override
		public Object instantiateItem(ViewGroup container, int position) {
			if (mCurTransaction == null) {
				mCurTransaction = mManager.beginTransaction();
			}

			final long itemId = position;

			// Do we already have this fragment?
			String name = makeFragmentName(itemId);
			Fragment fragment = mManager.findFragmentByTag(name);
			if (fragment != null) {
				mCurTransaction.attach(fragment);
			} else {
				fragment = getItem(position);
				mCurTransaction.add(container.getId(), fragment,
						makeFragmentName(itemId));
			}
		
			if (mCurrentPrimaryItem != fragment) {
		    fragment.setMenuVisibility(false);
		    fragment.setUserVisibleHint(false);
		}

			return fragment;
		}
	
	    @Override
	    public void finishUpdate(ViewGroup container) {
		if (mCurTransaction != null) {
		    mCurTransaction.commitAllowingStateLoss();
		    mCurTransaction = null;
		    mManager.executePendingTransactions();
		} else{
			super.finishUpdate(container);
		}
	    }
	    
	    @Override
	    public void setPrimaryItem(ViewGroup container, int position, Object object) {
		Fragment fragment = (Fragment)object;
		if (fragment != mCurrentPrimaryItem) {
		    if (mCurrentPrimaryItem != null) {
		        mCurrentPrimaryItem.setMenuVisibility(false);
		        mCurrentPrimaryItem.setUserVisibleHint(false);
		    }
		    if (fragment != null) {
		        fragment.setMenuVisibility(true);
		        fragment.setUserVisibleHint(true);
		    }
		    mCurrentPrimaryItem = fragment;
		}
	    }

		private String makeFragmentName(long itemId) {
			return "page:" + itemId;
		}

		public void onTabSelected(Tab tab, FragmentTransaction ft) {
			mPager.setCurrentItem(tab.getPosition());
			mContext.invalidateOptionsMenu();
		}

		public void onTabUnselected(Tab tab, FragmentTransaction ft) {
			// TODO Auto-generated method stub
		
		}

		public void onTabReselected(Tab tab, FragmentTransaction ft) {
			// TODO Auto-generated method stub
		
		}

		public void onPageScrollStateChanged(int arg0) {
			// TODO Auto-generated method stub
		
		}

		public void onPageScrolled(int arg0, float arg1, int arg2) {
			// TODO Auto-generated method stub
		
		}

		public void onPageSelected(int page) {
			mContext.getSupportActionBar().setSelectedNavigationItem(page);
			mContext.invalidateOptionsMenu();
		}

	}

[See it on GitHub](https://gist.github.com/3194218)

package md5a015150e89100aaba0b2edc1f6e002d8;


public class NoScrollViewPager
	extends android.support.v4.view.ViewPager
	implements
		mono.android.IGCUserPeer
{
/** @hide */
	public static final String __md_methods;
	static {
		__md_methods = 
			"n_onTouchEvent:(Landroid/view/MotionEvent;)Z:GetOnTouchEvent_Landroid_view_MotionEvent_Handler\n" +
			"n_onInterceptTouchEvent:(Landroid/view/MotionEvent;)Z:GetOnInterceptTouchEvent_Landroid_view_MotionEvent_Handler\n" +
			"";
		mono.android.Runtime.register ("AIS_Demonstrator.NoScrollViewPager, AIS_Demonstrator", NoScrollViewPager.class, __md_methods);
	}


	public NoScrollViewPager (android.content.Context p0)
	{
		super (p0);
		if (getClass () == NoScrollViewPager.class)
			mono.android.TypeManager.Activate ("AIS_Demonstrator.NoScrollViewPager, AIS_Demonstrator", "Android.Content.Context, Mono.Android", this, new java.lang.Object[] { p0 });
	}


	public NoScrollViewPager (android.content.Context p0, android.util.AttributeSet p1)
	{
		super (p0, p1);
		if (getClass () == NoScrollViewPager.class)
			mono.android.TypeManager.Activate ("AIS_Demonstrator.NoScrollViewPager, AIS_Demonstrator", "Android.Content.Context, Mono.Android:Android.Util.IAttributeSet, Mono.Android", this, new java.lang.Object[] { p0, p1 });
	}


	public boolean onTouchEvent (android.view.MotionEvent p0)
	{
		return n_onTouchEvent (p0);
	}

	private native boolean n_onTouchEvent (android.view.MotionEvent p0);


	public boolean onInterceptTouchEvent (android.view.MotionEvent p0)
	{
		return n_onInterceptTouchEvent (p0);
	}

	private native boolean n_onInterceptTouchEvent (android.view.MotionEvent p0);

	private java.util.ArrayList refList;
	public void monodroidAddReference (java.lang.Object obj)
	{
		if (refList == null)
			refList = new java.util.ArrayList ();
		refList.add (obj);
	}

	public void monodroidClearReferences ()
	{
		if (refList != null)
			refList.clear ();
	}
}

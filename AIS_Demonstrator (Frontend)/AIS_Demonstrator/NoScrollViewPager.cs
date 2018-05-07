using Android.Content;
using Android.Support.V4.View;
using Android.Util;
using Android.Views;

namespace AIS_Demonstrator
{
    // ReSharper disable once UnusedMember.Global
    public class NoScrollViewPager : ViewPager
    {
        //Constructors
        public NoScrollViewPager(Context context) : base(context){ }

        public NoScrollViewPager(Context context, IAttributeSet attrs) : base(context, attrs) { }

        //Disalbe Scrolling/Swiping
        public override bool OnTouchEvent(MotionEvent e)
        {
            return false;
        }

        public override bool OnInterceptTouchEvent(MotionEvent ev)
        {
            return false;
        }
    }
}
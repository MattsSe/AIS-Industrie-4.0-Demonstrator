using System;
using AIS_Demonstrator.Fragments;
using Android.OS;
using Android.Support.V4.App;
using Android.Support.V4.View;
using Android.Widget;
using NineOldAndroids.View;
using Fragment = Android.Support.V4.App.Fragment;
using FragmentManager = Android.Support.V4.App.FragmentManager;

namespace AIS_Demonstrator
{
    public class CarouselPagerAdapter : FragmentPagerAdapter, ViewPager.IOnPageChangeListener
    {
        //Page Setup
        private LinearLayout _cur;
        private LinearLayout _next;
        private LinearLayout _prev;
        private LinearLayout _nextnext;

        //Context
        private readonly ViewPager _pagerI;
        private readonly ViewPager _pagerT;
        private readonly FragmentManager _fm;
        private readonly CoffeeFragment _coffeeFragment;

        //Variables
        private float _scale;
        private bool _isBlured;

        //Constants
        private static readonly float MinAlpha = 0.6f;
        private static readonly float MaxAlpha = 1f;
        private static readonly float MinDegree = 60.0f;

        public static float GetMinDegree()
        {
            return MinDegree;
        }
        public static float GetMinAlpha()
        {
            return MinAlpha;
        }
        // ReSharper disable once UnusedMember.Global
        public static float GetMaxAlpha()
        {
            return MaxAlpha;
        }

        public CarouselPagerAdapter(ViewPager pagerI, ViewPager pagerT, CoffeeFragment coffeeFragment, FragmentManager fm) : base(fm)
        {
            _fm = fm;
            _pagerI = pagerI;
            _pagerT = pagerT;
            _coffeeFragment = coffeeFragment;
        }

        public override Fragment GetItem(int position)
        {
            if (position == CoffeeFragment.FirstPage)
                _scale = CoffeeFragment.BigScale;
            else
            {
                _scale = CoffeeFragment.SmallScale;
                _isBlured = true;

            }

            Fragment curFragment = NewFragmentInstance(_scale, _isBlured, CoffeeFragment.CoffeeNames[position]);
            _cur = GetRootView(position);
            _next = GetRootView(position + 1);
            _prev = GetRootView(position - 1);

            return curFragment;
        }


        public override int Count => CoffeeFragment.CoffeeNames.Length;


        void ViewPager.IOnPageChangeListener.OnPageScrollStateChanged(int state)
        {
            //throw new NotImplementedException ();
        }

        void ViewPager.IOnPageChangeListener.OnPageScrolled(int position, float positionOffset, int positionOffsetPixels)
        {
            if (positionOffset >= 0f && positionOffset <= 1f)
            {
                positionOffset = positionOffset * positionOffset;
                _cur = GetRootView(position);
                _next = GetRootView(position + 1);
                _prev = GetRootView(position - 1);
                _nextnext = GetRootView(position + 2);

                //Set Alpha
                if (_cur != null)
                {
                    ViewHelper.SetAlpha(_cur, MaxAlpha - 0.5f * positionOffset);
                }
                if (_next != null)
                {
                    ViewHelper.SetAlpha(_next, MinAlpha + 0.5f * positionOffset);
                }
                if (_prev != null)
                {
                    ViewHelper.SetAlpha(_prev, MinAlpha + 0.5f * positionOffset);
                }
                if (_nextnext != null)
                {
                    ViewHelper.SetAlpha(_nextnext, MinAlpha);
                }


                //Set Rotation and Scale
                if (_nextnext != null)
                {
                    ViewHelper.SetRotationY(_nextnext, -MinDegree);
                    ViewHelper.SetScaleX(_nextnext, CoffeeFragment.SmallScale);
                    ViewHelper.SetScaleY(_nextnext, CoffeeFragment.SmallScale);
                }

                if (_next != null)
                {
                    ViewHelper.SetRotationY(_next, -MinDegree + MinDegree * positionOffset);
                    ViewHelper.SetScaleX(_next, CoffeeFragment.SmallScale + CoffeeFragment.DiffScale * positionOffset);
                    ViewHelper.SetScaleY(_next, CoffeeFragment.SmallScale + CoffeeFragment.DiffScale * positionOffset);
                }
                if (_cur != null)
                {
                    ViewHelper.SetRotationY(_cur, 0 + MinDegree * positionOffset);
                    ViewHelper.SetScaleX(_cur, CoffeeFragment.BigScale - CoffeeFragment.DiffScale * positionOffset);
                    ViewHelper.SetScaleY(_cur, CoffeeFragment.BigScale - CoffeeFragment.DiffScale * positionOffset);
                }
                if (_prev != null)
                {
                    ViewHelper.SetRotationY(_prev, MinDegree);
                    ViewHelper.SetScaleX(_prev, CoffeeFragment.SmallScale);
                    ViewHelper.SetScaleY(_prev, CoffeeFragment.SmallScale);
                }
            }
            if (positionOffset >= 1f)
            {
                ViewHelper.SetAlpha(_cur, MaxAlpha);
            }
        }

        void ViewPager.IOnPageChangeListener.OnPageSelected(int position)
        {
            //Link Text Pager
            _pagerT.SetCurrentItem(position,true);

            //Set CoffeeTitle
            _coffeeFragment.UpdateTitle(CoffeeFragment.CoffeeNames[position]);
        }


        private CarouselFragment NewFragmentInstance(float scale, bool isBlured, string coffeeName)
        {
            CarouselFragment carouselFragment = new CarouselFragment();
            Bundle bundle = new Bundle();
            bundle.PutFloat("SCALE", scale);
            bundle.PutBoolean("IS_BLURED", isBlured);
            bundle.PutString("COFFEE_NAME", coffeeName);
            carouselFragment.Arguments = bundle;
            return carouselFragment;
        }


        private LinearLayout GetRootView(int position)
        {
            LinearLayout ly;
            try
            {
                ly = (LinearLayout)_fm.FindFragmentByTag(GetFragmentTag(position)).View.FindViewById(Resource.Id.root);
            }
            catch (Exception)
            {
                return null;
            }
            return ly;
        }

        private String GetFragmentTag(int position)
        {
            return "android:switcher:" + _pagerI.Id + ":" + position;
        }
    }
}
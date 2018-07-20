using System;
using AIS_Demonstrator.Fragments;
using Android.Content;
using Android.Runtime;
using Android.Support.V4.App;
using Android.Util;
using Android.Views;
using Android.Widget;
using Android.OS;
using Java.Lang;

namespace AIS_Demonstrator
{
    public class MenuPagerAdapter : FragmentPagerAdapter
    {
        // private readonly string[] _tabTitles = { "Kaffee", "Übersicht", "Profil" };
        //Use this instead if Login is disabled
        private readonly string[] _tabTitles = { "Kaffee", "Übersicht" }; 
        readonly Context _context;

        // ReSharper disable once UnusedMember.Global
        public MenuPagerAdapter(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
        {
        }
        
        public MenuPagerAdapter(Context context, FragmentManager fm) : base(fm)
        {
            _context = context;
        }

        public override int Count => _tabTitles.Length;

        //Decide which fragment is going to be shown
        public override Fragment GetItem(int position)
        {
            switch (position)
            {
                case 0:
                    return new CoffeeFragment();
                case 1:
                    return new OverviewFragment();
                case 2:
                    return new ProfileFragment();
                default:
                    return new CoffeeFragment();
            }
        }

        // Generate title based on item position
        public override ICharSequence GetPageTitleFormatted(int position)
        {
            return CharSequence.ArrayFromStringArray(_tabTitles)[position];
        }

        //TextView Tab Style
        public View GetTabView(int position)
        {
            var tv = (TextView)LayoutInflater.From(_context).Inflate(Resource.Layout.tab_layout, null);
            tv.Text = _tabTitles[position];
            tv.SetTextColor(Android.Graphics.Color.Black);
            tv.SetTextSize(ComplexUnitType.Sp, 16);
            tv.Typeface = Android.Graphics.Typeface.DefaultBold;
            return tv;
        }
    }
}
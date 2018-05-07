using System;
using AIS_Demonstrator.Fragments;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Support.V4.App;
using Java.Lang;

namespace AIS_Demonstrator
{
    public class CoffeePagerAdapter : FragmentPagerAdapter
    {
        // ReSharper disable once UnusedMember.Global
        public CoffeePagerAdapter(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
        {
        }

        // ReSharper disable once UnusedParameter.Local
        public CoffeePagerAdapter(Context context, FragmentManager fm) : base(fm)
        {
        }

        public override int Count => CoffeeFragment.CoffeeNames.Length;

        //Decide which fragment is going to be shown
        public override Fragment GetItem(int position)
        {
            switch (position)
            {
                case 0:
                    return NewFragmentInstance("SmallCoffee");
                case 1:
                    return NewFragmentInstance("LargeCoffee");
                case 2:
                    return NewFragmentInstance("LatteMacchiato");
                case 3:
                    return NewFragmentInstance("Cappuccino");
                default:
                    return NewFragmentInstance("SmallCoffee");
            }
        }

        // Generate title based on item position
        public override ICharSequence GetPageTitleFormatted(int position)
        {
            return CharSequence.ArrayFromStringArray(CoffeeFragment.CoffeeNames)[position];
        }

        //Custom Instantiation For Fragment
        private CoffeeTypeFragment NewFragmentInstance(string coffeeType)
        {
            CoffeeTypeFragment coffeeTypeFragment = new CoffeeTypeFragment();
            Bundle bundle = new Bundle();
            bundle.PutString("COFFEE_TYPE", coffeeType);
            coffeeTypeFragment.Arguments = bundle;
            return coffeeTypeFragment;
        }
    }
}
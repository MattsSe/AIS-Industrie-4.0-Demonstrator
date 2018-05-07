using System;
using AIS_Demonstrator.Dialogs;
using AIS_Demonstrator.SQLite;
using Android.OS;
using Android.Support.V4.App;
using Android.Views;
using Android.Widget;

namespace AIS_Demonstrator.Fragments
{
    class CoffeeTypeFragment : Fragment
    {
        private string _coffeeName;
        private DataBase _dataBase;
        private View _view;

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            base.OnCreateView(inflater, container, savedInstanceState);

            _coffeeName = Arguments.GetString("COFFEE_TYPE");

            _view = inflater.Inflate(Resource.Layout.CoffeeType, container, false);

            //Setup Stat Names
            _view.FindViewById<TextView>(Resource.Id.textStat1).Text = GetString(Resource.String.StatTotalQuantity);
            _view.FindViewById<TextView>(Resource.Id.textStat2).Text = GetString(Resource.String.StatCoffeeQuantity);
            _view.FindViewById<TextView>(Resource.Id.textStat3).Text = GetString(Resource.String.StatMilkQuantity);
            _view.FindViewById<TextView>(Resource.Id.textStat4).Text = GetString(Resource.String.StatCoffeeStregth);

            //Load DB
            _dataBase = new DataBase();
            _dataBase.CreateDataBase();

            //Setup Stat Values
            SetupStatValues();

            return _view;
        }

        //Set All Variable TextViews in Current View
        private void SetupStatValues()
        {
            //Querry DB
            int coffeeQuantity = _dataBase.GetCoffeeQuantity(_coffeeName);
            int milkQuantity = _dataBase.GetMilkQuantity(_coffeeName);
            int coffeeStregth = _dataBase.GetCoffeeStregth(_coffeeName);
            int totalQuantity = coffeeQuantity + milkQuantity;

            //Write Values
            TextView statTextView1 = _view.FindViewById<TextView>(Resource.Id.textStat11);
            statTextView1.Text = totalQuantity.ToString().PadRight(4) + "ml";

            TextView statTextView2 = _view.FindViewById<TextView>(Resource.Id.textStat21);
            statTextView2.Text = coffeeQuantity.ToString().PadRight(4) + "ml";
            statTextView2.SetCompoundDrawablesWithIntrinsicBounds(0, 0, Resource.Drawable.ic_mode_edit_black_18dp, 0);
            statTextView2.Click += StatTextView_Click;

            TextView statTextView3 = _view.FindViewById<TextView>(Resource.Id.textStat31);
            statTextView3.Text = milkQuantity.ToString().PadRight(4) + "ml";
            statTextView3.SetCompoundDrawablesWithIntrinsicBounds(0, 0, Resource.Drawable.ic_mode_edit_black_18dp, 0);
            statTextView3.Click += StatTextView_Click;

            TextView statTextView4 = _view.FindViewById<TextView>(Resource.Id.textStat41);
            statTextView4.Text = coffeeStregth.ToString().PadRight(4);
            statTextView4.SetCompoundDrawablesWithIntrinsicBounds(0, 0, Resource.Drawable.ic_mode_edit_black_18dp, 0);
            statTextView4.Click += StatTextView_Click;
        }

        //Click Event For StatValues
        private void StatTextView_Click(object sender, EventArgs e)
        {
            //Show CoffeeValueDialog-Fragment
            CoffeeValueDialog coffeeValueDialog = NewDialogInstance();
            FragmentTransaction transaction = Activity.SupportFragmentManager.BeginTransaction()
                .SetCustomAnimations(Resource.Animation.enter_from_left, Resource.Animation.exit_to_left)
                .Add(Resource.Id.main_content, coffeeValueDialog)
                .AddToBackStack("coffeeValueDialog");
            transaction.Commit();
            Activity.SupportFragmentManager.ExecutePendingTransactions();

            //Listen For CoffeeValueDialogComplete-Event 
            coffeeValueDialog.CoffeeValueDialogComplete += (o, args) => SetupStatValues();
        }

        //Custom Instantiation For Fragment
        private CoffeeValueDialog NewDialogInstance()
        {
            CoffeeValueDialog coffeeValueDialog = new CoffeeValueDialog();
            Bundle bundle = new Bundle();
            bundle.PutString("COFFEE_NAME", _coffeeName);
            coffeeValueDialog.Arguments = bundle;
            return coffeeValueDialog;
        }
    }
}
using System;
using AIS_Demonstrator.SQLite;
using Android.OS;
using Android.Support.V4.View;
using Android.Util;
using Android.Views;
using Android.Widget;
using AlertDialog = Android.Support.V7.App.AlertDialog;

namespace AIS_Demonstrator.Fragments
{
    public class CoffeeFragment : Android.Support.V4.App.Fragment
    {
        private Button _coffeeButton;
        private ViewPager _pagerI;
        private ViewPager _pagerT;
        private CarouselPagerAdapter _adapterI;
        private CoffeePagerAdapter _adapterT;
        private string _currentCoffeeName;
        private View _view;

        //Settings for the CarouselPager
        internal static readonly int FirstPage = 1;
        internal const float BigScale = 1.0f;
        internal const float SmallScale = 0.7f;
        internal const float DiffScale = 0.3f;
        internal static readonly string[] CoffeeNames =
        {
            "SmallCoffee",
            "LargeCoffee",
            "LatteMacchiato",
            "Cappuccino"
        };

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            base.OnCreateView(inflater, container, savedInstanceState);

            _view = inflater.Inflate(Resource.Layout.Coffee, container, false);

            //Find Views
            _coffeeButton = _view.FindViewById<Button>(Resource.Id.buttonPrepare);
            _pagerI = _view.FindViewById<ViewPager>(Resource.Id.pagerI);
            _pagerT = _view.FindViewById<ViewPager>(Resource.Id.pagerT);
            _adapterI = new CarouselPagerAdapter(_pagerI, _pagerT, this, ChildFragmentManager);
            _adapterT = new CoffeePagerAdapter(Activity, ChildFragmentManager);

            //Setup ImagePager
            _pagerI.Adapter = _adapterI;
            _pagerI.AddOnPageChangeListener(_adapterI);
            _pagerI.SetCurrentItem(FirstPage, true);
            _pagerI.OffscreenPageLimit = 3;
            _pagerI.PageMargin = (int)(GetScreenWidth() * -0.6f);

            //Setup TextPager
            _pagerT.Adapter = _adapterT;
            _pagerT.SetCurrentItem(FirstPage, true);

            //Assign ClickFunction
            _coffeeButton.Click +=(sender, args) => CreateAlertCoffeeCup();

            return _view;
        }

        //Updates the Name of the Coffee above the picture
        public void UpdateTitle(string coffeeName)
        {
            _currentCoffeeName = coffeeName;
            int id = Context.Resources.GetIdentifier(_currentCoffeeName, "string", Context.PackageName);
            _view.FindViewById<TextView>(Resource.Id.textCoffeeName).Text = GetString(id);
        }

        //Create Alert Dialog For Preparing Coffee
        private void CreateAlertCoffeeCup()
        {
            AlertDialog.Builder alert = new AlertDialog.Builder(Activity);
            alert.SetTitle(GetString(Resource.String.AlertTitle));
            alert.SetMessage(GetString(Resource.String.AlertMessage));
            alert.SetPositiveButton(GetString(Resource.String.ButtonPositive), (senderAlert, args) => {             
                MakeCoffee();
                Toast.MakeText(Activity, GetString(Resource.String.MessagePositive) + " 10 Sekunden", ToastLength.Short).Show();
            });
            alert.SetNegativeButton(GetString(Resource.String.ButtonNegative), (senderAlert, args) => {
                Toast.MakeText(Activity, GetString(Resource.String.MessageNegative), ToastLength.Short).Show();
            });
            alert.Show();
        }

        //Returns the Width of the Screen in Pixels
        private int GetScreenWidth()
        {
            DisplayMetrics displayMetrics = Activity.Resources.DisplayMetrics;
            return displayMetrics.WidthPixels;
        }

        //Send command to machine and add order to history
        private void MakeCoffee()
        {
            //TODO Implement OPC UA and "make coffee"

            //Connect to Coffee-DB
            //Remove the following lines if Login is diabled
            DataBase dataBase = new DataBase();
            dataBase.CreateDataBase();

            History history = new History
            {
                CoffeeName = _currentCoffeeName,
                User = MainActivity.UserName,
                Price = dataBase.GetCoffeePrice(_currentCoffeeName),
                Time = (int) DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1)).TotalSeconds,
                IsPayed = false
            };

            //Connect to History-DB
            HistoryDb historyDb = new HistoryDb();
            historyDb.CreateDataBase();
            historyDb.InsertTableHistory(history);
        }
    }
}
using System.Globalization;
using AIS_Demonstrator.SQLite;
using Android.OS;
using Android.Support.V7.App;
using Android.Text;
using Android.Views;
using Android.Widget;

namespace AIS_Demonstrator.Dialogs
{
    public class CostSettingDialog : Android.Support.V4.App.DialogFragment
    {
        private DataBase _dataBase;
        private ListView _listViewL;
        private ListView _listViewR;
        private ArrayAdapter<string> _adapterL;
        private ArrayAdapter<decimal> _adapterR;
        private readonly decimal[] _prices=
        {
            1.00M,1.50M,2.00M,2.00M
        };
        private static readonly string[] CoffeeNames =
        {
            "SmallCoffee",
            "LargeCoffee",
            "LatteMacchiato",
            "Cappuccino"
        };

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            base.OnCreateView(inflater, container, savedInstanceState);

            var view = inflater.Inflate(Resource.Layout.CostSetting, container, false);

            //Load DB
            _dataBase = new DataBase();
            _dataBase.CreateDataBase();

            //Setup ListViews With Adapter
            for (int i = 0; i < CoffeeNames.Length; i++ )
            {
                _prices[i] = _dataBase.GetCoffeePrice(CoffeeNames[i]);
            }
            _adapterL = new ArrayAdapter<string>(Context, Android.Resource.Layout.SimpleListItem1, CoffeeNames);
            _adapterR = new ArrayAdapter<decimal>(Context, Android.Resource.Layout.SimpleListItem1, _prices);
            _listViewL = view.FindViewById<ListView>(Resource.Id.listViewL);
            _listViewL.Adapter = _adapterL;
            _listViewR = view.FindViewById<ListView>(Resource.Id.listViewR);
            _listViewR.Adapter = _adapterR;
            _listViewR.ItemClick += _listViewR_ItemClick;
            _listViewR.ItemsCanFocus = true;


            //Setup Actionbar
            AppCompatActivity activity = (AppCompatActivity)Activity;
            activity.SupportActionBar.SetDisplayHomeAsUpEnabled(true);
            activity.SupportActionBar.SetHomeButtonEnabled(true);
            activity.SupportActionBar.Title = GetString(Resource.String.CostSettingDialog);
            activity.SupportActionBar.SetDisplayUseLogoEnabled(false);

            return view;
        }

        private void _listViewR_ItemClick(object sender, AdapterView.ItemClickEventArgs e)
        {
            CreateAlertChangePrice(CoffeeNames[e.Position], _prices[e.Position], e.Position);
        }

        //Create Alert Dialog For Changing Price
        private void CreateAlertChangePrice(string coffeeName, decimal coffeePrice, int pos)
        {
            AlertDialog.Builder alert = new AlertDialog.Builder(Activity);
            alert.SetTitle(coffeeName + "-Preis");
            // Set an EditText view to get user input 
            EditText input = new EditText(Context)
            {
                InputType = InputTypes.NumberFlagDecimal,
                Text = coffeePrice.ToString(CultureInfo.InvariantCulture)
            };
            alert.SetView(input);


            alert.SetPositiveButton(GetString(Resource.String.ButtonPositive), (senderAlert, args) =>
            {
                double value; 
                bool resultParse = double.TryParse(input.Text, NumberStyles.Number, CultureInfo.CreateSpecificCulture("en-US"), out value);
                if (resultParse)
                {
                    _prices[pos] = (decimal) value;
                    _dataBase.SetPrice(coffeeName, _prices[pos]);
                    _adapterR.NotifyDataSetChanged();
                    _adapterR = new ArrayAdapter<decimal>(Context, Android.Resource.Layout.SimpleListItem1, _prices);
                    _listViewR.Adapter = _adapterR;
                    Toast.MakeText(Activity, GetString(Resource.String.NoErrorParse), ToastLength.Short).Show();
                }
                else
                {
                    Toast.MakeText(Activity, GetString(Resource.String.ErrorParse), ToastLength.Short).Show();
                }
                
            });

            alert.SetNegativeButton(GetString(Resource.String.ButtonNegative), (senderAlert, args) => {
                Toast.MakeText(Activity, GetString(Resource.String.Cancel), ToastLength.Short).Show();
            });
        
            alert.Show();
        }
    }
}
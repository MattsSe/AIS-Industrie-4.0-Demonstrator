using System;
using System.Collections.Generic;
using AIS_Demonstrator.SQLite;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Support.V7.App;
using Android.Views;
using Android.Widget;
using System.Globalization;
// ReSharper disable FieldCanBeMadeReadOnly.Local

namespace AIS_Demonstrator.Dialogs
{
    public class CostOverviewDialog : Android.Support.V4.App.DialogFragment
    {
        private HistoryDb _historyDb;
        private ListView _listViewL;
        private MyArrayAdapter _adapterL;
        private TextView _currentSum;
        private TextView _pay;
        private AppCompatActivity _activity;

        private List<string> _coffeeNames = new List<string>();
        private List<string> _time = new List<string>();
        private List<string> _cost = new List<string>();
        private List<bool> _isPayed = new List<bool>();


        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            base.OnCreateView(inflater, container, savedInstanceState);

            var view = inflater.Inflate(Resource.Layout.CostOverview, container, false);


            //Setup Actionbar
            _activity = (AppCompatActivity)Activity;
            _activity.SupportActionBar.SetDisplayHomeAsUpEnabled(true);
            _activity.SupportActionBar.SetHomeButtonEnabled(true);
            _activity.SupportActionBar.Title = GetString(Resource.String.CostOverviewDialog);
            _activity.SupportActionBar.SetDisplayUseLogoEnabled(false);

            //Setup PayButton
            _pay = view.FindViewById<TextView>(Resource.Id.textOptionPay);
            _pay.Text = GetString(Resource.String.Pay);
            _pay.Click += _pay_Click;

            //Load DB
            _historyDb = new HistoryDb();
            _historyDb.CreateDataBase();

            //Get Account Balance
            _currentSum = view.FindViewById<TextView>(Resource.Id.textCurrentSum);
            _currentSum.Text = GetString(Resource.String.CurrentSum) + _historyDb.GetBalance(MainActivity.UserName);

            //Get Name and Cost
            GetDatabaseEntires();

            //Setup ListViews With Adapter
            _adapterL = new MyArrayAdapter(Context, _activity, _coffeeNames, _time, _cost, _isPayed);
            _listViewL = view.FindViewById<ListView>(Resource.Id.listViewL);
            _listViewL.Adapter = _adapterL;

            return view;
        }

        private void _pay_Click(object sender, EventArgs e)
        {
            AlertDialog.Builder alert = new AlertDialog.Builder(Activity);
            alert.SetTitle("€" + _historyDb.GetBalance(MainActivity.UserName) + " " + GetString(Resource.String.AlertTitlePay));
            alert.SetMessage(GetString(Resource.String.AlertMessagePay));
            alert.SetPositiveButton(GetString(Resource.String.ButtonPositive), (senderAlert, args) => {
                Toast.MakeText(Activity, GetString(Resource.String.MessagePositivePay), ToastLength.Short).Show();
                _historyDb.PayCoffee(MainActivity.UserName);
                GetDatabaseEntires();
                _adapterL.NotifyDataSetChanged();
                _adapterL = new MyArrayAdapter(Context, _activity, _coffeeNames, _time, _cost, _isPayed);
                _listViewL.Adapter = _adapterL;
                _currentSum.Text = GetString(Resource.String.CurrentSum) + _historyDb.GetBalance(MainActivity.UserName);
            });

            alert.SetNegativeButton(GetString(Resource.String.ButtonNegative), (senderAlert, args) => {
                Toast.MakeText(Activity, GetString(Resource.String.MessageNegativePay), ToastLength.Short).Show();
            });
            alert.Show();
        }

        private void GetDatabaseEntires()
        {
            _coffeeNames = new List<string>();
            _time = new List<string>();
            _cost = new List<string>();
            _isPayed = new List<bool>();
            int timeStart = (int)DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1)).TotalSeconds;
            int timeEnd = (int)DateTime.UtcNow.AddMonths(-1).Subtract(new DateTime(1970, 1, 1)).TotalSeconds;
            List<History> histories = _historyDb.GetTableEntries(MainActivity.UserName, timeStart, timeEnd);
            foreach (History history in histories)
            {
                _coffeeNames.Insert(0, history.CoffeeName);
                _time.Insert(0, UnixTimeStampToDateTime(history.Time));
                _cost.Insert(0, "€" + history.Price);
                _isPayed.Insert(0, history.IsPayed);
            }
        }

        private string UnixTimeStampToDateTime(int unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToLocalTime();
            return dtDateTime.ToString("MM/dd/yyyy",
                CultureInfo.InvariantCulture);
        }
    }

    public class MyArrayAdapter : ArrayAdapter
    {
        private readonly List<bool> _flags;
        private readonly List<string> _names;
        private readonly List<string> _dates;
        private readonly List<string> _prices;
        private readonly AppCompatActivity _activity;

        public MyArrayAdapter(Context context, AppCompatActivity activity, List<string> names, List<string> dates, List<string> prices, List<bool> flags) : base(context,
            Resource.Layout.CustomArrayAdapterLayout, names)
        {
            _activity = activity;
            _flags = flags;
            _names = names;
            _dates = dates;
            _prices = prices;
        }

        public override View GetView(int position, View convertView, ViewGroup parent)
        {
            View view = _activity.LayoutInflater.Inflate(Resource.Layout.CustomArrayAdapterLayout, parent, false);
            TextView textL = (TextView)view.FindViewById(Resource.Id.TextViewL);
            TextView textM = (TextView)view.FindViewById(Resource.Id.TextViewM);
            TextView textR = (TextView)view.FindViewById(Resource.Id.TextViewR);

            textL.Text = _names[position];
            textM.Text = _dates[position];
            textR.Text = _prices[position];
            
            if (_flags[position])
            {
                textL.SetTextColor(Color.Gray);
                textM.SetTextColor(Color.Gray);
                textR.SetTextColor(Color.Gray);
            }
            return view;
        }
    }
}
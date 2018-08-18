using System;
using AIS_Demonstrator.SQLite;
using Android.OS;
using Android.Support.V7.App;
using Android.Views;
using Android.Widget;

namespace AIS_Demonstrator.Dialogs
{

    public class CoffeeValueDialog : Android.Support.V4.App.DialogFragment
    {
        private Button _cancelButton;
        private Button _okButton;
        private EditText _editCoffeeQuantity;
        private EditText _editMilkQuantity;
        private EditText _editCoffeeStregth;
        private DataBase _dataBase;
        private string _coffeeName;

        public event EventHandler<EventArgs> CoffeeValueDialogComplete;

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            base.OnCreateView(inflater, container, savedInstanceState);

            //Get Sent Arguments
            _coffeeName = Arguments.GetString("COFFEE_NAME");

            //Inflate View
            var view = inflater.Inflate(Resource.Layout.DialogCoffeeValue, container, false);

            //Find views
            int id = Activity.Resources.GetIdentifier(_coffeeName, "string", Activity.PackageName);
            view.FindViewById<TextView>(Resource.Id.textCoffeeName).Text = GetString(id);
            _cancelButton = view.FindViewById<Button>(Resource.Id.buttonNegative);
            _okButton = view.FindViewById<Button>(Resource.Id.buttonPositve);
            _editCoffeeQuantity = view.FindViewById<EditText>(Resource.Id.txtCoffeeQuantity);
            _editMilkQuantity = view.FindViewById<EditText>(Resource.Id.txtMilkQuantity);
            _editCoffeeStregth = view.FindViewById<EditText>(Resource.Id.txtCoffeeStregth);

            //Connect to DB
            _dataBase = new DataBase();
            _dataBase.CreateDataBase();

            //Enable Back Navigation in Bar
            AppCompatActivity activity = (AppCompatActivity)Activity;
            activity.SupportActionBar.SetDisplayHomeAsUpEnabled(true);
            activity.SupportActionBar.SetHomeButtonEnabled(true);
            activity.SupportActionBar.Title = GetString(Resource.String.DialogCoffeeValue);
            activity.SupportActionBar.SetDisplayUseLogoEnabled(false);

            //Fill EditText With DB Data
            _editCoffeeQuantity.Text = _dataBase.GetCoffeeQuantity(_coffeeName).ToString();
            _editMilkQuantity.Text = _dataBase.GetMilkQuantity(_coffeeName).ToString();
            _editCoffeeStregth.Text = _dataBase.GetCoffeeStregth(_coffeeName).ToString();

            //Button Functions
            _cancelButton.Click += _cancelButton_Click;
            _okButton.Click += _okButton_Click;

            return view;
        }

        //Write Values in DB
        private void _okButton_Click(object sender, EventArgs e)
        {
            //Test for Correctness
            if (_editCoffeeQuantity.Text == string.Empty)
            {
                Toast.MakeText(Activity, GetString(Resource.String.StatCoffeeQuantity) + " " + GetString(Resource.String.MissingValue), ToastLength.Short).Show();
                return;
            }
            if (_editMilkQuantity.Text == string.Empty)
            {
                Toast.MakeText(Activity, GetString(Resource.String.StatMilkQuantity) + " " + GetString(Resource.String.MissingValue), ToastLength.Short).Show();
                return;
            }
            if (_editCoffeeStregth.Text == string.Empty)
            {
                Toast.MakeText(Activity, GetString(Resource.String.StatCoffeeStregth) + " " + GetString(Resource.String.MissingValue), ToastLength.Short).Show();
                return;
            }
            if (int.Parse(_editCoffeeQuantity.Text) > 120)
            {
                Toast.MakeText(Activity, GetString(Resource.String.StatCoffeeQuantity) + " " + GetString(Resource.String.ValueTooHigh), ToastLength.Short).Show();
                _editCoffeeQuantity.Text = "120";
                return;
            }
            if (int.Parse(_editMilkQuantity.Text) > 120)
            {
                Toast.MakeText(Activity, GetString(Resource.String.StatMilkQuantity) + " " + GetString(Resource.String.ValueTooHigh), ToastLength.Short).Show();
                _editMilkQuantity.Text = "120";
                return;
            }
            if (int.Parse(_editCoffeeStregth.Text) > 5)
            {
                Toast.MakeText(Activity, GetString(Resource.String.StregthTooHigh), ToastLength.Short).Show();
                _editCoffeeStregth.Text = "5";
                return;
            }
            if (int.Parse(_editCoffeeStregth.Text) < 1)
            {
                Toast.MakeText(Activity, GetString(Resource.String.StregthTooLow), ToastLength.Short).Show();
                _editCoffeeStregth.Text = "1";
                return;
            }

            //Object to Update
            CoffeeSettings coffeeSettings = new CoffeeSettings()
            {
                CoffeeName = _coffeeName,
                CoffeeQuantity = int.Parse(_editCoffeeQuantity.Text),
                MilkQuantity = int.Parse(_editMilkQuantity.Text),
                CoffeeStregth = int.Parse(_editCoffeeStregth.Text)
            };
            _dataBase.UpdateTableCoffeeSettings(coffeeSettings);

            //Event For Change Complete
            // ReSharper disable once PossibleNullReferenceException
            CoffeeValueDialogComplete.Invoke(this, EventArgs.Empty);

            //Close Dialog
            Activity.OnBackPressed();
            Dismiss();
        }

        //Close Dialog Fragment
        private void _cancelButton_Click(object sender, EventArgs e)
        {
            //Close Dialog
            Activity.OnBackPressed();
            Dismiss();
        }
    }
}
using System;
using AIS_Demonstrator.SQLite;
using Android.OS;
using Android.Support.V7.App;
using Android.Views;
using Android.Widget;

namespace AIS_Demonstrator.Dialogs
{

    public class ChangeUserDataDialog : Android.Support.V4.App.DialogFragment
    {
        private EditText _editUserName;
        private EditText _editOldPassword;
        private EditText _editNewPassword;
        private Button _buttonPositive;
        private Button _buttonNegative;
        private UserDataBase _userDataBase;

        public event EventHandler<EventArgs> ChangeUserDataComplete;

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            base.OnCreateView(inflater, container, savedInstanceState);

            //Enable Back Navigation in Bar
            AppCompatActivity activity = (AppCompatActivity)Activity;
            activity.SupportActionBar.SetDisplayHomeAsUpEnabled(true);
            activity.SupportActionBar.SetHomeButtonEnabled(true);
            activity.SupportActionBar.Title = GetString(Resource.String.ChangeUserData);
            activity.SupportActionBar.SetDisplayUseLogoEnabled(false);

            //Inflate View
            var view = inflater.Inflate(Resource.Layout.DialogChangeUserData, container, false);

            //Load DB
            _userDataBase = new UserDataBase();
            _userDataBase.CreateDataBase();

            //Find views
            _editUserName = view.FindViewById<EditText>(Resource.Id.txtUserName);
            _editOldPassword = view.FindViewById<EditText>(Resource.Id.txtOldPassword);
            _editNewPassword = view.FindViewById<EditText>(Resource.Id.txtNewPassword);
            _buttonPositive = view.FindViewById<Button>(Resource.Id.buttonPositve);
            _buttonNegative = view.FindViewById<Button>(Resource.Id.buttonNegative);

            //Setup Text
            _editUserName.Text = MainActivity.UserName;

            //Set ClickFunction
            _buttonPositive.Click += _buttonPositive_Click;
            _buttonNegative.Click += _buttonNegative_Click;

            return view;
        }

        private void _buttonNegative_Click(object sender, EventArgs e)
        {
            //Close Dialog
            Activity.OnBackPressed();
            Dismiss();
        }

        private void _buttonPositive_Click(object sender, EventArgs e)
        {
            //Check UserInput
            if (_editOldPassword.Text == string.Empty)
            {
                Toast.MakeText(Activity, GetString(Resource.String.EmptyUserPassword), ToastLength.Short).Show();
                return;
            }
            if (_editNewPassword.Text == string.Empty)
            {
                Toast.MakeText(Activity, GetString(Resource.String.EmptyUserPassword), ToastLength.Short).Show();
                return;
            }
            if (_userDataBase.CheckUserPassword(MainActivity.UserName, _editOldPassword.Text) == false )
            {
                Toast.MakeText(Activity, GetString(Resource.String.WrongUserPassword), ToastLength.Short).Show();
                return;
            }

            //UserPassword correct
            User user = new User()
            {
                // Deactivated local User Database
                // Id = MainActivity.UserId,
                UserName = _editUserName.Text,
                UserPassword = _editNewPassword.Text
            };
            _userDataBase.UpdateTableUser(user);
            MainActivity.UserName = _editUserName.Text;

            //Event For Change Complete
            // ReSharper disable once PossibleNullReferenceException
            ChangeUserDataComplete.Invoke(this, EventArgs.Empty);

            //Close Dialog
            Activity.OnBackPressed();
            Dismiss();
        }
    }
}
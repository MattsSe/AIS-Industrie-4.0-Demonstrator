using System;
using Android.App;
using Android.OS;
using Android.Views;
using Android.Widget;

namespace AIS_Demonstrator.Dialogs
{
    public class OnSignupEventArgs : EventArgs
    {
        //Constructor
        public OnSignupEventArgs(string userName, string password)
        {
            UserName = userName;
            Password = password;
        }

        //Get Set
        public string UserName { get; }
        public string Password { get; }
    }

    class DialogSignUp : DialogFragment
    {
        private EditText _txtUserName;
        private EditText _txtPassword1;
        private EditText _txtPassword2;
        private Button _buttonSignup;

        public event EventHandler<OnSignupEventArgs> OnSignupComplete;

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            base.OnCreateView(inflater, container, savedInstanceState);

            var view = inflater.Inflate(Resource.Layout.Signup, container, false);

            //Find Views
            _txtUserName = view.FindViewById<EditText>(Resource.Id.txtUserName);
            _txtPassword1 = view.FindViewById<EditText>(Resource.Id.txtPassword1);
            _txtPassword2 = view.FindViewById<EditText>(Resource.Id.txtPassword2);
            _buttonSignup = view.FindViewById<Button>(Resource.Id.buttonSignup);

            //Set ButtonClickFunctions
            _buttonSignup.Click += ButtonSignupClick;

            return view;
        }

        //Click Event For Signup Button
        private void ButtonSignupClick(object sender, EventArgs e)
        {
            if (String.IsNullOrEmpty(_txtUserName.Text))
            {
                Toast.MakeText(Activity, GetString(Resource.String.EmptyUserName), ToastLength.Short).Show();
                return;
            }
            if (_txtPassword1.Text != _txtPassword2.Text)
            {
                Toast.MakeText(Activity, GetString(Resource.String.PasswordNotMatching), ToastLength.Short).Show();
                return;
            }
            // ReSharper disable once PossibleNullReferenceException
            OnSignupComplete.Invoke(this, new OnSignupEventArgs(_txtUserName.Text, _txtPassword1.Text));
            Dismiss();
        }

        //Remove Title From Fragment
        public override void OnActivityCreated(Bundle savedInstanceState)
        {
            Dialog.Window.RequestFeature(WindowFeatures.NoTitle);
            base.OnActivityCreated(savedInstanceState);
        }
    }
}
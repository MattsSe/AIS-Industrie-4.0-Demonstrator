using AIS_Demonstrator.Dialogs;
using AIS_Demonstrator.SQLite;
using Android.App;
using Android.Content;
using Android.Views;
using Android.Widget;
using Android.OS;
using Android.Support.V7.App;
using Java.Lang;

// Added for OPC UA Support
using Opc.Ua;
using Opc.Ua.Client;
using Opc.Ua.Configuration;

namespace AIS_Demonstrator
{
    //If Login isn't required: MainLauncher = false and in MainActivity MainLauncher = true
    [Activity(Label = "AIS Industrie 4.0 Demonstrator", MainLauncher = true, Icon = "@drawable/icon")]
    // ReSharper disable once UnusedMember.Global
    public class LoginActivity : AppCompatActivity
    {
        private Button _buttonSignup;
        private Button _buttonLogin;
        private ProgressBar _progressBar;
        private EditText _editUserName;
        private EditText _editUserPassword;
        private EditText _editServerEndpoint;

        // Deactivated local User Database
        // private UserDataBase _userDataBase;

        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);

            // Set the start-up view to "Login"
            SetContentView(Resource.Layout.Login);

            // Deactivated local User Database
            /*
            //Load DB
            _userDataBase = new UserDataBase();
            _userDataBase.CreateDataBase();
            */

            //Find Views
            _editUserName = FindViewById<EditText>(Resource.Id.editUserName);
            _editUserPassword = FindViewById<EditText>(Resource.Id.editUserPassword);
            // save user input: OPC UA Server Endpoint URL
            _editServerEndpoint = FindViewById<EditText>(Resource.Id.editServerEndpoint);

            //Create Account Button Clicked
            #region CreateAccount
            _buttonSignup = FindViewById<Button>(Resource.Id.buttonCreateAccount);
            _progressBar = FindViewById<ProgressBar>(Resource.Id.progressBarLogin);
            _buttonSignup.Click += (sender, args) =>
            {
                Toast.MakeText(this, "Das Anlegen neuer User ist zur Zeit deaktiviert. Bitte einen Admin, dir im Back-End einen neuen User anzulegen.", ToastLength.Long).Show();
                // User Creation has been deactivated by Jakob Lammel. The local user database is no longer used, and User Creation for OPC UA is handled in the back-end by an administrator.
                //Show Signup Dialog
                /*
                FragmentTransaction transaction = FragmentManager.BeginTransaction();
                DialogSignUp signUpDialog = new DialogSignUp();
                signUpDialog.Show(transaction, "signUpDialog Fragment");
                signUpDialog.OnSignupComplete += SignUpDialog_OnSignupComplete;
                */
            };
            #endregion

            //Login Button Clicked
            _buttonLogin = FindViewById<Button>(Resource.Id.buttonLogin);
            _progressBar = FindViewById<ProgressBar>(Resource.Id.progressBarLogin);
            _buttonLogin.Click += (sender, args) =>
            {
                _progressBar.Visibility = ViewStates.Visible;
                
                //Simulated Server
                Thread thread = new Thread(RequestSim);
                thread.Start();

                //Check UserInput
                if (_editUserName.Text == string.Empty)
                {
                    Toast.MakeText(this, GetString(Resource.String.EmptyUserName), ToastLength.Short).Show();
                    return;
                }
                if (_editUserPassword.Text == string.Empty)
                {
                    Toast.MakeText(this, GetString(Resource.String.EmptyUserPassword), ToastLength.Short).Show();
                    return;
                }

                // Username and Password checks have been disabled by Jakob Lammel because it is no longer necessary.
                // User Credentials are checked by the server once this application tries to get a session.
                
                /*
                if (_userDataBase.CheckUserName(_editUserName.Text) == false)
                {
                    Toast.MakeText(this, GetString(Resource.String.WrongUserName), ToastLength.Short).Show();
                    return;
                }
                if (_userDataBase.CheckUserPassword(_editUserName.Text, _editUserPassword.Text) == false)
                {
                    Toast.MakeText(this, GetString(Resource.String.WrongUserPassword), ToastLength.Short).Show();
                    _editUserPassword.Text = "";
                    return;
                }
                */

                //UserName and UserPassword correct

                #region OPCUA
                //Check if Server Endpoint has been entered
                if (_editServerEndpoint.Text == "")
                {
                    Toast.MakeText(this, GetString(Resource.String.WrongEndpoint), ToastLength.Short).Show();
                    return;
                }
                #endregion

                //Start MainActivity
                Intent intent = new Intent(this, typeof(MainActivity));
                intent.AddFlags(ActivityFlags.ClearTop | ActivityFlags.NewTask);
                //intent.AddFlags(ActivityFlags.NoHistory);
                intent.PutExtra("USERNAME", _editUserName.Text);
                intent.PutExtra("PASSWORD", _editUserPassword.Text);
                // Deactivated local User Database
                // intent.PutExtra("USERID", _userDataBase.GetUserId(_editUserName.Text));
                //pass server Endpoint to MainActivity
                intent.PutExtra("ENDPOINT", _editServerEndpoint.Text);
                StartActivity(intent);
                Finish();
            };
        }

        private void SignUpDialog_OnSignupComplete(object sender, OnSignupEventArgs e)
        {
            _progressBar.Visibility = ViewStates.Visible;

            //Simulated Server
            Thread thread = new Thread(RequestSim);
            thread.Start();

            string userName = e.UserName;
            string password = e.Password;

            //Insert User in DataBase
            User user = new User()
            {
                UserName = userName,
                UserPassword = password
            };
            // Deactivated local User Database
            // _userDataBase.InsertTableUser(user);
        }

        //Simulated Server
        private void RequestSim()
        {
            Thread.Sleep(2000);
            RunOnUiThread(() => { _progressBar.Visibility = ViewStates.Invisible; });
        }
    }
}



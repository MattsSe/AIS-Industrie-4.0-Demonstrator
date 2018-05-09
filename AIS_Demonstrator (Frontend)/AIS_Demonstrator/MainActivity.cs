using System.IO;
using AIS_Demonstrator.SQLite;
using Android.App;
using Android.Content;
using Android.Graphics;
using Android.Graphics.Drawables;
using Android.OS;
using Android.Provider;
using Android.Support.Design.Widget;
using Android.Support.V4.View;
using Android.Support.V7.App;
using Android.Views;
using Android.Widget;
using Android.Content.Res;
using Toolbar = Android.Support.V7.Widget.Toolbar;

// Added for OPC UA Support
using Opc.Ua;
using Opc.Ua.Client;
using Opc.Ua.Configuration;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace AIS_Demonstrator
{
    [Activity(Label = "AIS_Demonstrator", MainLauncher = false, Icon = "@drawable/icon")]
    // ReSharper disable once UnusedMember.Global
    public class MainActivity : AppCompatActivity, ViewPager.IOnPageChangeListener
    {
        public static string UserName { get; set; }
        public static int UserId { get; private set; }
        #region OPC UA Declarations
        // Declare and initialise variable for OPC UA Server Endpoint
        public string endpointUrl = "init";
        static LabelViewModel textInfo = new LabelViewModel();
        SampleClient OpcClient = new SampleClient(textInfo);

        async void Connect() //copied and modified Function "OnConnect" from UA Xamarin Client.MainPage.xaml.cs"
        {
            // Retrieve ServerEndpoint from LoginActivity
            endpointUrl = Intent.GetStringExtra("ENDPOINT");
            bool connectToServer = true;

            // not needed: ConnectIndicator is a spinning animation
            // ConnectIndicator.IsRunning = true;

            AssetManager assets = this.Assets; //AssetManager to be given to CreateCertificate function in order to be able to access the Config.xml file from the Assets
            
            await Task.Run(() => OpcClient.CreateCertificate(assets));

            if (OpcClient.haveAppCertificate == false)
            {
                Toast.MakeText(this, GetString(Resource.String.NoAppCertificate), ToastLength.Short).Show();
                connectToServer = true; // ToDo: instead of directly setting this to true, it would be better to show an alert with ok/cancel button and only set to true if the user tapped "ok"
            }

            if (connectToServer == true)
            {
                var connectionStatus = await Task.Run(() => OpcClient.OpcClient(endpointUrl));
                
                if (connectionStatus == SampleClient.ConnectionStatus.Connected)
                {
                    Toast.MakeText(this, GetString(Resource.String.ConnectionSuccess), ToastLength.Short).Show();
                    
                    //Tree tree;

                    // not needed: ConnectIndicator is a spinning animation
                    // ConnectButton.Text = "Disconnect";

                    // tree = OpcClient.GetRootNode(textInfo);
                    // if (tree.currentView[0].children == true)
                    // {
                    //    tree = OpcClient.GetChildren(tree.currentView[0].id);
                    // }

                    // not needed: ConnectIndicator is a spinning animation
                    // ConnectIndicator.IsRunning = false;
                    // Page treeViewRoot = new TreeView(tree, OpcClient);
                    // treeViewRoot.Title = "/Root";
                    // await Navigation.PushAsync(treeViewRoot);
                    
                }
                else
                {
                    // not needed: ConnectIndicator is a spinning animation
                    // ConnectIndicator.IsRunning = false;
                    Toast.MakeText(this, GetString(Resource.String.ConnectionFailed), ToastLength.Short).Show();
                }
            }
            else
            {
                // not needed: ConnectIndicator is a spinning animation
                // ConnectIndicator.IsRunning = false;
            } 

        }
        #endregion

        private ViewPager _pager;
        private Toolbar _toolbar;
        private TabLayout _tabLayout;

        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);
            Forms.Init(this, bundle);

            UserName = Intent.GetStringExtra("USERNAME");
            UserId = Intent.GetIntExtra("USERID", -1);

            // Set our view from the "main" layout resource
            SetContentView(Resource.Layout.Main);

            // Find views
            _pager = FindViewById<ViewPager>(Resource.Id.pager);
            _tabLayout = FindViewById<TabLayout>(Resource.Id.sliding_tabs);
            var adapter = new MenuPagerAdapter(this, SupportFragmentManager);
            _toolbar = FindViewById<Toolbar>(Resource.Id.toolbar);

            //Setup Toolbar
            SetSupportActionBar(_toolbar);
            SetupSupportActionBar();

            // Set adapter to view pager and add OnPageChangeListener
            _pager.Adapter = adapter;
            _pager.AddOnPageChangeListener(this);

            // Setup tablayout with view pager
            _tabLayout.SetupWithViewPager(_pager);

            // Iterate over all tabs and set the custom view
            for (int i = 0; i < _tabLayout.TabCount; i++)
            {
                TabLayout.Tab tab = _tabLayout.GetTabAt(i);
                tab.SetCustomView(adapter.GetTabView(i));
            }

            #region Connect to OPC UA Serverv
            // when View is created: connect the client to the specified Endpoint
            Connect();     

            endpointUrl = Intent.GetStringExtra("ENDPOINT"); //ToDo debug: delete this line
            Toast.MakeText(this, endpointUrl, ToastLength.Short).Show(); //ToDo debug: delete this line

            #endregion
        }

        protected override void OnDestroy()
        {
            base.OnDestroy();
            // Disconnect OPC UA Client when Activity is destroyed
            OpcClient.Disconnect(OpcClient.session);
        }

        //Catch Toolbar Button Clicks
        public override bool OnOptionsItemSelected(IMenuItem item)
        {
            switch (item.ItemId)
            {
                //Home Button in SupportActionBar Pressed
                case Android.Resource.Id.Home:
                    SetupSupportActionBar();
                    OnBackPressed();
                    return true;

                default:
                    return base.OnOptionsItemSelected(item);
            }
        }

        //Catch Hardware Back Button Press
        public override void OnBackPressed()
        {
            //Reset Toolbar
            SetupSupportActionBar();
            base.OnBackPressed();
        }

        //Needed For Changing Profile Picture
        protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);

            //Sets the new Profile Picture
            if (resultCode == Result.Ok)
            {
                //Get image from Data
                Bitmap bitmap = MediaStore.Images.Media.GetBitmap(ContentResolver, data.Data);

                //Set Image
                Drawable drawable = new BitmapDrawable(Resources, bitmap);
                var imageView = FindViewById<ImageView>(Resource.Id.imageView1);
                imageView.Background = drawable;
                
                //Save Changes to DB
                UpdateProfile(bitmap);
            }
        }

        #region OnPageChangeListener Required Function
        public void OnPageScrollStateChanged(int state)
        {
        }

        public void OnPageScrolled(int position, float positionOffset, int positionOffsetPixels)
        {
        }

        public void OnPageSelected(int position)
        {
            //Close All DialogFragments
            while (SupportFragmentManager.BackStackEntryCount > 0)
            {
                OnBackPressed();
            }
        }
        #endregion

        //Replace the original ActionBar with the one from Android.Support.V7
        private void SetupSupportActionBar()
        {
            SupportActionBar.SetDisplayHomeAsUpEnabled(false);
            SupportActionBar.SetHomeButtonEnabled(false);
            SupportActionBar.Title = "  " + GetString(Resource.String.SupportActionBarTitle);
            SupportActionBar.SetLogo(Resource.Drawable.Icon);
            SupportActionBar.SetDisplayUseLogoEnabled(true);
        }

        //Upload the ProfileImage to the DB
        private void UpdateProfile(Bitmap bitmap)
        {
            //Load DB
            UserDataBase userDataBase = new UserDataBase();
            userDataBase.CreateDataBase();

            MemoryStream memoryStream = new MemoryStream();
            bitmap.Compress(Bitmap.CompressFormat.Webp, 100, memoryStream);
            byte[] picData = memoryStream.ToArray();

            //Update DB
            User user = new User()
            {
                Id = UserId,
                UserImage = picData
            };
            userDataBase.UpdateProfileImage(user);
        }
    }
}


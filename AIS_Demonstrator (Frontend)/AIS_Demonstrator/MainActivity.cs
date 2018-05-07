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
using Toolbar = Android.Support.V7.Widget.Toolbar;

namespace AIS_Demonstrator
{
    [Activity(Label = "AIS_Demonstrator", MainLauncher = false, Icon = "@drawable/icon")]
    // ReSharper disable once UnusedMember.Global
    public class MainActivity : AppCompatActivity, ViewPager.IOnPageChangeListener
    {
        public static string UserName { get; set; }
        public static int UserId { get; private set; }
        private ViewPager _pager;
        private Toolbar _toolbar;
        private TabLayout _tabLayout;

        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);

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


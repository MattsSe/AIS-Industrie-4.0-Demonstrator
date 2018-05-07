using AIS_Demonstrator.Dialogs;
using AIS_Demonstrator.SQLite;
using Android.Content;
using Android.Graphics;
using Android.Graphics.Drawables;
using Android.OS;
using Android.Support.V4.App;
using Android.Views;
using Android.Widget;

namespace AIS_Demonstrator.Fragments
{
    class ProfileFragment : Fragment
    {
        private TextView _textOptionCostOverview;
        private TextView _userName;
        private TextView _userPassword;
        private ImageView _userImage;

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            base.OnCreateView(inflater, container, savedInstanceState);

            var view = inflater.Inflate(Resource.Layout.Profile, container, false);

            //Find Views
            _textOptionCostOverview = view.FindViewById<TextView>(Resource.Id.textOptionCostOverview);
            _userName = view.FindViewById<TextView>(Resource.Id.textOptionName);
            _userPassword = view.FindViewById<TextView>(Resource.Id.textOptionPassword);
            _userImage = view.FindViewById<ImageView>(Resource.Id.imageView1);

            //Set Text
            SetupView();

            //Set ClickFunction
            _userName.Click += ShowChangeUserDataDialog;
            _userPassword.Click += ShowChangeUserDataDialog;
            _textOptionCostOverview.Click += _textOptionCostOverview_Click;
            _userImage.Click += _userImage_Click;

            return view;
        }

        private void _userImage_Click(object sender, System.EventArgs e)
        {

            var imageIntent = new Intent();
            imageIntent.SetType("image/*");
            imageIntent.SetAction(Intent.ActionGetContent);
            StartActivityForResult(
                Intent.CreateChooser(imageIntent, "Select photo"), 0);
        }

        private void ShowChangeUserDataDialog(object sender, System.EventArgs e)
        {
            //Show ChangeUserDataDialog-Fragment
            ChangeUserDataDialog changeUserDataDialog = NewDialogInstance();
            FragmentTransaction transaction = Activity.SupportFragmentManager.BeginTransaction()
                .SetCustomAnimations(Resource.Animation.enter_from_left, Resource.Animation.exit_to_left)
                .Add(Resource.Id.main_content, changeUserDataDialog)
                .AddToBackStack("changeUserDataDialog");
            transaction.Commit();
            Activity.SupportFragmentManager.ExecutePendingTransactions();

            //Listen For CoffeeValueDialogComplete-Event 
            changeUserDataDialog.ChangeUserDataComplete += (o, args) => SetupView();
        }

        //Custom Instantiation For Fragment
        private ChangeUserDataDialog NewDialogInstance()
        {
            ChangeUserDataDialog changeUserDataDialog = new ChangeUserDataDialog();
            Bundle bundle = new Bundle();
            changeUserDataDialog.Arguments = bundle;
            return changeUserDataDialog;
        }

        //Setup Views
        private void SetupView()
        {
            _userName.Text = MainActivity.UserName;
            _userName.SetCompoundDrawablesWithIntrinsicBounds(0, 0, Resource.Drawable.ic_mode_edit_black_18dp, 0);
            _userPassword.Text = GetString(Resource.String.ChangePassword);
            _userPassword.SetCompoundDrawablesWithIntrinsicBounds(0, 0, Resource.Drawable.ic_mode_edit_black_18dp, 0);

            //Load DB
            UserDataBase userDataBase = new UserDataBase();
            userDataBase.CreateDataBase();
            byte[] imageData = userDataBase.GetUserImage(MainActivity.UserId);

            //Get Image from DB if available
            if (imageData != null)
            {
                Bitmap bitmap = BitmapFactory.DecodeByteArray(imageData, 0, imageData.Length);
                Drawable drawable = new BitmapDrawable(Resources, bitmap);
                _userImage.Background = drawable;
            }
        }

        private void _textOptionCostOverview_Click(object sender, System.EventArgs e)
        {
            CostOverviewDialog costOverviewDialog = new CostOverviewDialog();
            FragmentTransaction transaction = Activity.SupportFragmentManager.BeginTransaction()
                .SetCustomAnimations(Resource.Animation.enter_from_left, Resource.Animation.exit_to_left)
                .Add(Resource.Id.main_content, costOverviewDialog)
                .AddToBackStack("costOverviewDialog");
            transaction.Commit();
            Activity.SupportFragmentManager.ExecutePendingTransactions();
        }
    }
}
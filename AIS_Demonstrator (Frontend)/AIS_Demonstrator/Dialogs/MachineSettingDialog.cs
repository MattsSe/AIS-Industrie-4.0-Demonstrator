using Android.OS;
using Android.Support.V7.App;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;

namespace AIS_Demonstrator.Dialogs
{
    public class MachineSettingDialog : Android.Support.V4.App.DialogFragment
    {
        private SeekBar _seekBar;
        private TextView _optionWaterHardness;
        private TextView _optionPowder;


        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            base.OnCreateView(inflater, container, savedInstanceState);

            var view = inflater.Inflate(Resource.Layout.MachineSetting, container, false);

            //Find Views
            _optionWaterHardness = view.FindViewById<TextView>(Resource.Id.optionWaterHardness);
            _optionWaterHardness.Text = GetString(Resource.String.WaterHardness) + ": 0";
            _seekBar = view.FindViewById<SeekBar>(Resource.Id.slider);
            _seekBar.ProgressChanged += (sender, args) =>
                {
                    _optionWaterHardness.Text = GetString(Resource.String.WaterHardness) + ": " + (args.Progress/20);
                };
            _optionPowder = view.FindViewById<TextView>(Resource.Id.OptionPowder);
            _optionPowder.Text = GetString(Resource.String.PowderedCoffee);
            view.FindViewById<SwitchCompat>(Resource.Id.switchPowder);

            //Setup SupportActionBar
            AppCompatActivity activity = (AppCompatActivity)Activity;
            activity.SupportActionBar.SetDisplayHomeAsUpEnabled(true);
            activity.SupportActionBar.SetHomeButtonEnabled(true);
            activity.SupportActionBar.Title = GetString(Resource.String.MachineSettingDialog);
            activity.SupportActionBar.SetDisplayUseLogoEnabled(false);

            return view;
        }
    }
}
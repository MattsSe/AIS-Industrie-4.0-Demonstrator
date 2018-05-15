using System;
using AIS_Demonstrator.Dialogs;
using Android.App;
using Android.Graphics;
// ReSharper disable once RedundantUsingDirective
using Android.Graphics;
using Android.OS;
using Android.Support.V4.View;
using Android.Util;
using Android.Views;
using Android.Widget;
using FragmentTransaction = Android.Support.V4.App.FragmentTransaction;

namespace AIS_Demonstrator.Fragments
{
    public class OverviewFragment : Android.Support.V4.App.Fragment
    {
        private TextView _textOptionProfile;
        private TextView _textOptionCostOverview;
        private TextView _textOptionMachine;
        private TextView _textOptionCostSetting;
        private View _view;
        private ViewPager _pager;

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            base.OnCreateView(inflater, container, savedInstanceState);

            _view = inflater.Inflate(Resource.Layout.Overview, container, false);

            //TextView Button
            _textOptionProfile = _view.FindViewById<TextView>(Resource.Id.textOptionProfile);
            _textOptionProfile.Click += OptionProfile_Click;
            //Use this in addition if Login is disabled
            //_textOptionProfile.Enabled = false;
            //_textOptionProfile.SetBackgroundColor(Color.Gray);

            _textOptionCostOverview = _view.FindViewById<TextView>(Resource.Id.textOptionCostOverview);
            _textOptionCostOverview.Click += OptionCostOverview_Click;
            //Use this in addition if Login is disabled
            //_textOptionCostOverview.Enabled = false;
            //_textOptionCostOverview.SetBackgroundColor(Color.Gray);

            _textOptionMachine = _view.FindViewById<TextView>(Resource.Id.textOptionMachine);
            _textOptionMachine.Click += OptionMachine_Click;

            _textOptionCostSetting = _view.FindViewById<TextView>(Resource.Id.textOptionCostSetting);
            _textOptionCostSetting.Click += OptionCostSetting_Click;
            //Use this in addition if Login is disabled
            //_textOptionCostSetting.Enabled = false;
            //_textOptionCostSetting.SetBackgroundColor(Color.Gray);

            SetupContainerMachineState();
            return _view;
        }

        //Show Profile via MenuPager
        private void OptionProfile_Click(object sender, EventArgs e)
        {
            _pager = Activity.FindViewById<ViewPager>(Resource.Id.pager);
            _pager.SetCurrentItem(2, true);
        }

        //Show Cost Overview DialogFragment
        private void OptionCostOverview_Click(object sender, EventArgs e)
        {
            CostOverviewDialog costOverviewDialog = new CostOverviewDialog();
            FragmentTransaction transaction = Activity.SupportFragmentManager.BeginTransaction()
                .SetCustomAnimations(Resource.Animation.enter_from_left, Resource.Animation.exit_to_left)
                .Add(Resource.Id.main_content, costOverviewDialog)
                .AddToBackStack("costOverviewDialog");
            transaction.Commit();
            Activity.SupportFragmentManager.ExecutePendingTransactions();
        }

        //Show Machine Setting DialogFragment
        private void OptionMachine_Click(object sender, EventArgs e)
        {
            MachineSettingDialog machineSettingDialog = new MachineSettingDialog();
            FragmentTransaction transaction = Activity.SupportFragmentManager.BeginTransaction()
                .SetCustomAnimations(Resource.Animation.enter_from_left, Resource.Animation.exit_to_left)
                .Add(Resource.Id.main_content, machineSettingDialog)
                .AddToBackStack("machineSettingDialog");
            transaction.Commit();
            Activity.SupportFragmentManager.ExecutePendingTransactions();
        }

        //Show Cost Setting DialogFragment
        private void OptionCostSetting_Click(object sender, EventArgs e)
        {
            CostSettingDialog costSettingDialog = new CostSettingDialog();
            FragmentTransaction transaction = Activity.SupportFragmentManager.BeginTransaction()
                .SetCustomAnimations(Resource.Animation.enter_from_left, Resource.Animation.exit_to_left)
                .Add(Resource.Id.main_content, costSettingDialog)
                .AddToBackStack("costSettingDialog");
            transaction.Commit();
            Activity.SupportFragmentManager.ExecutePendingTransactions();
        }

        //Sets Height for MachineState Levels dynamicly
        private void SetupContainerMachineState()
        {
            //Get Container Height
            DisplayMetrics displayMetrics = Activity.Resources.DisplayMetrics;
            float layoutWeight = 0.5f;
            float height = displayMetrics.WidthPixels * layoutWeight; //Get Height of Container MachineState
            height = height - 60; //Subtract Padding and Text

            //Find Views
            View wL1 = _view.FindViewById<View>(Resource.Id.WaterLevel1);
            View wL2 = _view.FindViewById<View>(Resource.Id.WaterLevel2);

            View bL1 = _view.FindViewById<View>(Resource.Id.BeanLevel1);
            View bL2 = _view.FindViewById<View>(Resource.Id.BeanLevel2);

            View cL1 = _view.FindViewById<View>(Resource.Id.CleanLevel1);
            View cL2 = _view.FindViewById<View>(Resource.Id.CleanLevel2);

            //TODO Implement OPC UA and Get Machine Parameters (Water, Bean, Clean)

            //Set Height
            wL1.LayoutParameters.Height = (int)Math.Round(height * 0.33f);
            wL2.LayoutParameters.Height = (int)Math.Round(height * 0.66f);

            bL1.LayoutParameters.Height = (int)Math.Round(height * 0.5f);
            bL2.LayoutParameters.Height = (int)Math.Round(height * 0.5f);

            cL1.LayoutParameters.Height = (int)Math.Round(height * 0.75f);
            cL2.LayoutParameters.Height = (int)Math.Round(height * 0.25f);
        }
    }
}
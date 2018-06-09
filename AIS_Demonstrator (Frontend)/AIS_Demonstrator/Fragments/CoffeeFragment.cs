using System;
using System.Collections.Generic;
using AIS_Demonstrator.SQLite;
using Android.OS;
using Android.Support.V4.View;
using Android.Util;
using Android.Views;
using Android.Widget;
using AlertDialog = Android.Support.V7.App.AlertDialog;
using Java.Lang;

// Added for OPC UA Support
using Opc.Ua;

namespace AIS_Demonstrator.Fragments
{
    public class CoffeeFragment : Android.Support.V4.App.Fragment
    {
        private Button _coffeeButton;
        private ViewPager _pagerI;
        private ViewPager _pagerT;
        private CarouselPagerAdapter _adapterI;
        private CoffeePagerAdapter _adapterT;
        private string _currentCoffeeName;
        private View _view;

        //Settings for the CarouselPager
        internal static readonly int FirstPage = 1;
        internal const float BigScale = 1.0f;
        internal const float SmallScale = 0.7f;
        internal const float DiffScale = 0.3f;
        internal static readonly string[] CoffeeNames =
        {
            "SmallCoffee",
            "LargeCoffee",
            "LatteMacchiato",
            "Cappuccino"
        };

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            base.OnCreateView(inflater, container, savedInstanceState);

            _view = inflater.Inflate(Resource.Layout.Coffee, container, false);

            //Find Views
            _coffeeButton = _view.FindViewById<Button>(Resource.Id.buttonPrepare);
            _pagerI = _view.FindViewById<ViewPager>(Resource.Id.pagerI);
            _pagerT = _view.FindViewById<ViewPager>(Resource.Id.pagerT);
            _adapterI = new CarouselPagerAdapter(_pagerI, _pagerT, this, ChildFragmentManager);
            _adapterT = new CoffeePagerAdapter(Activity, ChildFragmentManager);

            //Setup ImagePager
            _pagerI.Adapter = _adapterI;
            _pagerI.AddOnPageChangeListener(_adapterI);
            _pagerI.SetCurrentItem(FirstPage, true);
            _pagerI.OffscreenPageLimit = 3;
            _pagerI.PageMargin = (int)(GetScreenWidth() * -0.6f);

            //Setup TextPager
            _pagerT.Adapter = _adapterT;
            _pagerT.SetCurrentItem(FirstPage, true);

            //Assign ClickFunction
            _coffeeButton.Click +=(sender, args) => CreateAlertCoffeeCup();

            return _view;
        }

        //Updates the Name of the Coffee above the picture
        public void UpdateTitle(string coffeeName)
        {
            _currentCoffeeName = coffeeName;
            int id = Context.Resources.GetIdentifier(_currentCoffeeName, "string", Context.PackageName);
            _view.FindViewById<TextView>(Resource.Id.textCoffeeName).Text = GetString(id);
        }

        //Create Alert Dialog For Preparing Coffee
        private void CreateAlertCoffeeCup()
        {
            AlertDialog.Builder alert = new AlertDialog.Builder(Activity);
            alert.SetTitle(GetString(Resource.String.AlertTitle));
            alert.SetMessage(GetString(Resource.String.AlertMessage));
            alert.SetPositiveButton(GetString(Resource.String.ButtonPositive), (senderAlert, args) => {             
                //MakeCoffee();
                Toast.MakeText(Activity, MakeCoffee(), ToastLength.Short).Show();

                // Toast.MakeText(Activity, GetString(Resource.String.MessagePositive) + " 10 Sekunden", ToastLength.Short).Show();
            });
            alert.SetNegativeButton(GetString(Resource.String.ButtonNegative), (senderAlert, args) => {
                Toast.MakeText(Activity, GetString(Resource.String.MessageNegative), ToastLength.Short).Show();
            });
            alert.Show();
        }

        //Returns the Width of the Screen in Pixels
        private int GetScreenWidth()
        {
            DisplayMetrics displayMetrics = Activity.Resources.DisplayMetrics;
            return displayMetrics.WidthPixels;
        }

        //Send command to machine and add order to history
        private string MakeCoffee()
        {
            //Connect to Coffee-DB
            //Remove the following lines if Login is diabled
            DataBase dataBase = new DataBase();
            dataBase.CreateDataBase();

            // get current Coffee Variables
            UInt16 coffeeQuantity = (UInt16) dataBase.GetCoffeeQuantity(_currentCoffeeName);
            UInt16 milkQuantity = (UInt16) dataBase.GetMilkQuantity(_currentCoffeeName);
            UInt16 coffeeStrength = (UInt16) dataBase.GetCoffeeStregth(_currentCoffeeName);

            // hard-coded NodeIDs of the Variable Nodes to write
            string coffeeQuantityNodeId = "ns=1;s=CoffeeQuantityVariable";
            string milkQuantityNodeId = "ns=1;s=MilkQuantityVariable";
            string coffeestrengthNodeId = "ns=1;s=CoffeeStrengthVariable";

            // hard-coded NodeID of the Object and the Method
            NodeId ObjectNodeID = NodeId.Parse("ns=1;s=CoffeeOrder");
            NodeId MethodNodeID = NodeId.Parse("ns=1;s=toButtonMethod");

            // Variables for handling the Method Call Result
            IList<object> callMethodResult = null;
            string resultMessage = "Fehler: Kommunikation mit dem Backend ist fehlgeschlagen";  // default value is overwritten later when the toButton Method is successfully called.

            // Write Values to OPC UA Server Namespace
            ResponseHeader responseCQ = MainActivity.OpcClient.VariableWrite(coffeeQuantity, coffeeQuantityNodeId);
            ResponseHeader responseMQ = MainActivity.OpcClient.VariableWrite(milkQuantity, milkQuantityNodeId);
            ResponseHeader responseCS = MainActivity.OpcClient.VariableWrite(coffeeStrength, coffeestrengthNodeId);

            // Call toButton() Method in OPC UA Server Namespace if all three write requests were successful
            if (responseCQ != null && responseMQ != null && responseCS != null) // check if all three variables were written to the server
            {
                if (responseCQ.ServiceResult == StatusCodes.Good && responseMQ.ServiceResult == StatusCodes.Good && responseCS.ServiceResult == StatusCodes.Good)   // check if all three variable writes were successful
                {
                    // Actually call the method which initiates a coffee order
                    callMethodResult = MainActivity.OpcClient.session.Call(ObjectNodeID, MethodNodeID, null);
                    foreach (var x in callMethodResult)
                    {
                        resultMessage = x.ToString();
                    }
                }
            }
            // Insert Order into History
            History history = new History
            {
                CoffeeName = _currentCoffeeName,
                User = MainActivity.UserName,
                Price = dataBase.GetCoffeePrice(_currentCoffeeName),
                Time = (int) DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1)).TotalSeconds,
                IsPayed = false
            };

            //Connect to History-DB
            HistoryDb historyDb = new HistoryDb();
            historyDb.CreateDataBase();
            historyDb.InsertTableHistory(history);

            return (resultMessage);

        }
        //Simulated Server
        private void RequestSim()
        {
            Thread.Sleep(1000);
        }
    }
}
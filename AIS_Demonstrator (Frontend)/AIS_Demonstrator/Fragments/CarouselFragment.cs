using Android.OS;
using Android.Support.V4.App;
using Android.Views;
using Android.Widget;
using NineOldAndroids.View;

namespace AIS_Demonstrator.Fragments
{
    public class CarouselFragment : Fragment
    {

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            LinearLayout view = (LinearLayout)inflater.Inflate(Resource.Layout.coffee_tab_layout, container, false);

            //Get Arguments
            float scale = Arguments.GetFloat("SCALE");
            bool isBlured = Arguments.GetBoolean("IS_BLURED");
            string coffeeName = Arguments.GetString("COFFEE_NAME");

            //Set Image (IdentifierName has to be lower case for drawables!)
            int id = Resources.GetIdentifier(coffeeName.ToLower(), "drawable", Activity.PackageName);
            view.FindViewById<ImageView>(Resource.Id.content).SetImageResource(id);

            LinearLayout root = (LinearLayout)view.FindViewById(Resource.Id.root);

            if (isBlured)
            {
                ViewHelper.SetAlpha(root, CarouselPagerAdapter.GetMinAlpha());
                ViewHelper.SetRotationY(root, CarouselPagerAdapter.GetMinDegree());
                ViewHelper.SetScaleX(root,scale);
                ViewHelper.SetScaleY(root, scale);
            }
            return view;
        }

    }
}

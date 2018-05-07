using SQLite;

namespace AIS_Demonstrator.SQLite
{
    public class CoffeeSettings
    {
        [PrimaryKey, AutoIncrement]
        // ReSharper disable once UnusedMember.Global
        public int Id { get; set; }
        public decimal Price { get; set; }
        public string CoffeeName { get; set; }
        public int CoffeeQuantity { get; set; }
        public int MilkQuantity { get; set; }
        public int CoffeeStregth { get; set; }
    }
}
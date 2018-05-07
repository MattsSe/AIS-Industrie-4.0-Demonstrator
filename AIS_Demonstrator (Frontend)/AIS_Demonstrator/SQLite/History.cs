using SQLite;

namespace AIS_Demonstrator.SQLite
{
    public class History
    {
        [PrimaryKey, AutoIncrement]
        // ReSharper disable once UnusedMember.Global
        public int Id { get; set; }
        public string User { get; set; }
        public int Time { get; set; }
        public decimal Price { get; set; }
        public string CoffeeName { get; set; }
        public bool IsPayed { get; set; }
    }
}
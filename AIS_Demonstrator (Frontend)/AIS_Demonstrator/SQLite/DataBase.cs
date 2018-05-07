using System.Linq;
using Android.Database;
using Android.Util;
using SQLite;

namespace AIS_Demonstrator.SQLite
{
    //TODO Use a real SQL Server
    //Change: _folder = System.Environment.GetFolderPath(System.Environment.SpecialFolder.Personal);
    //Change: connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "CoffeeSettings.db")
    class DataBase
    {
        private readonly string _folder = System.Environment.GetFolderPath(System.Environment.SpecialFolder.Personal);

        //Create DataBase For CoffeeSettings
        public void CreateDataBase()
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "CoffeeSettings.db")))
                {
                    //Create/Load DB
                    //connection.DeleteAll<CoffeeSettings>(); //Clean the DB
                    connection.CreateTable<CoffeeSettings>();

                    //Fill DB If Empty 
                    if (!connection.Table<CoffeeSettings>().Any())
                    {
                        CoffeeSettings coffeeSettings = new CoffeeSettings
                        {
                            Price = 1.00M,
                            CoffeeName = "SmallCoffee",
                            CoffeeQuantity = 100,
                            MilkQuantity = 0,
                            CoffeeStregth = 3
                        };
                        connection.Insert(coffeeSettings);

                        coffeeSettings = new CoffeeSettings()
                        {
                            Price = 1.50M,
                            CoffeeName = "LargeCoffee",
                            CoffeeQuantity = 150,
                            MilkQuantity = 0,
                            CoffeeStregth = 3
                        };
                        connection.Insert(coffeeSettings);

                        coffeeSettings = new CoffeeSettings()
                        {
                            Price = 2.00M,
                            CoffeeName = "LatteMacchiato",
                            CoffeeQuantity = 20,
                            MilkQuantity = 130,
                            CoffeeStregth = 3
                        };
                        connection.Insert(coffeeSettings);

                        coffeeSettings = new CoffeeSettings()
                        {
                            Price = 2.00M,
                            CoffeeName = "Cappuccino",
                            CoffeeQuantity = 50,
                            MilkQuantity = 100,
                            CoffeeStregth = 3
                        };
                        connection.Insert(coffeeSettings);
                    }
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
            }
        }

        public void UpdateTableCoffeeSettings(CoffeeSettings coffeeSettings)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "CoffeeSettings.db")))
                {
                    connection.Query<CoffeeSettings>(
                        "UPDATE CoffeeSettings SET CoffeeQuantity=?,MilkQuantity=?,CoffeeStregth=? WHERE CoffeeName=?",
                        coffeeSettings.CoffeeQuantity, coffeeSettings.MilkQuantity, coffeeSettings.CoffeeStregth, coffeeSettings.CoffeeName);
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
            }
        }

        // ReSharper disable once UnusedMember.Global
        public bool DeleteTableCoffeeSettings(CoffeeSettings coffeeSettings)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "CoffeeSettings.db")))
                {
                    connection.Delete(coffeeSettings);
                    return true;
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
                return false;
            }
        }

        public int GetCoffeeQuantity(string coffeeName)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "CoffeeSettings.db")))
                {
                    var query = 
                        from s in connection.Table<CoffeeSettings>()
                        where s.CoffeeName.Equals(coffeeName)
                        select s;
                    return query.FirstOrDefault().CoffeeQuantity;
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
                return -1;
            }
        }

        public int GetMilkQuantity(string coffeeName)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "CoffeeSettings.db")))
                {
                    var query =
                        from s in connection.Table<CoffeeSettings>()
                        where s.CoffeeName.Equals(coffeeName)
                        select s;
                    return query.FirstOrDefault().MilkQuantity;
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
                return -1;
            }
        }

        public int GetCoffeeStregth(string coffeeName)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "CoffeeSettings.db")))
                {
                    var query =
                        from s in connection.Table<CoffeeSettings>()
                        where s.CoffeeName.Equals(coffeeName)
                        select s;
                    return query.FirstOrDefault().CoffeeStregth;
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
                return -1;
            }
        }

        public decimal GetCoffeePrice(string coffeeName)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "CoffeeSettings.db")))
                {
                    var query =
                        from s in connection.Table<CoffeeSettings>()
                        where s.CoffeeName.Equals(coffeeName)
                        select s;
                    return query.FirstOrDefault().Price;
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
                return -1;
            }
        }

        public void SetPrice(string coffeeName, decimal price)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "CoffeeSettings.db")))
                {
                    connection.Query<CoffeeSettings>(
                        "UPDATE CoffeeSettings SET Price=? WHERE CoffeeName=?",
                        price, coffeeName);
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
            }
        }
    }
}
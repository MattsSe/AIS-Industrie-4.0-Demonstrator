using System.Collections.Generic;
using System.Linq;
using Android.Database;
using Android.Util;
using SQLite;

namespace AIS_Demonstrator.SQLite
{
    //TODO Use a real SQL Server
    //Change: _folder = System.Environment.GetFolderPath(System.Environment.SpecialFolder.Personal);
    //Change: connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "History.db")
    class HistoryDb
    {
        private readonly string _folder = System.Environment.GetFolderPath(System.Environment.SpecialFolder.Personal);

        //Create DataBase For CoffeeSettings
        public void CreateDataBase()
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "History.db")))
                {
                    //Create/Load DB
                    //connection.DeleteAll<History>(); //Clean the DB
                    connection.CreateTable<History>();

                    //Fill DB If Empty 
                    if (!connection.Table<History>().Any())
                    {
                        History history = new History()
                        {
                            Time = 1507012405,
                            User = "Anna",
                            Price = 1.00M,
                            CoffeeName = "SmallCoffee",
                            IsPayed = false
                        };
                        connection.Insert(history);

                        history = new History()
                        {
                            Time = 1507011781,
                            User = "Anna",
                            Price = 1.50M,
                            CoffeeName = "LargeCoffee",
                            IsPayed = false
                        };
                        connection.Insert(history);
                    }
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
            }
        }

        //Mark all old Coffees as Payed
        public void PayCoffee(string user)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "History.db")))
                {
                    var query = 
                        from s in connection.Table<History>()
                        where (s.User.Equals(user) && s.IsPayed.Equals(false))
                        select s;
                    foreach (History history in query)
                    {
                        history.IsPayed = true;
                        connection.Update(history);
                    }
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
            }
        }


        public void InsertTableHistory(History history)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "History.db")))
                {
                    connection.Insert(history);
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
            }
        }

        //Returns Account Balance
        public decimal GetBalance(string user)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "History.db")))
                {
                    var query =
                        from s in connection.Table<History>()
                        where (s.User.Equals(user) && s.IsPayed.Equals(false))
                        select s;
                    decimal balance = 0.00M;
                    foreach (History history in query)
                    {
                        balance += history.Price;
                    }
                    return balance;
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
                return 0.00M;
            }
        }

        //Gets TableEntries between two given times
        public List<History> GetTableEntries(string user, int timeStart, int timeEnd)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "History.db")))
                {
                    var query =
                        from s in connection.Table<History>()
                        where (s.User.Equals(user) && s.Time > timeEnd && s.Time <= timeStart)
                        select s;
                    List<History> histories = query.ToList();
                    return histories;
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
                return null;
            }
        }
    }
}
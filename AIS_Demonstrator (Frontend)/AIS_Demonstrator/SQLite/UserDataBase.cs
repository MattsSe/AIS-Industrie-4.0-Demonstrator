using System.Linq;
using Android.Database;
using Android.Util;
using SQLite;

namespace AIS_Demonstrator.SQLite
{
    //TODO Use a real SQL Server
    //Change: _folder = System.Environment.GetFolderPath(System.Environment.SpecialFolder.Personal);
    //Change: connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "User.db")
    class UserDataBase
    {
        private readonly string _folder = System.Environment.GetFolderPath(System.Environment.SpecialFolder.Personal);

        //Create DataBase For CoffeeSettings
        public void CreateDataBase()
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "User.db")))
                {
                    //Create/Load DB
                    //connection.DeleteAll<CoffeeSettings>(); //Clean the DB
                    connection.CreateTable<User>();

                    //Fill DB If Empty 
                    if (!connection.Table<User>().Any())
                    {
                        User user = new User
                        {
                            UserName = "Anna",
                            UserPassword = "123456"
                        };
                        connection.Insert(user);
                    }
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
            }
        }

        //Insert a new User
        public void InsertTableUser(User user)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "User.db")))
                {
                    connection.Insert(user);
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
            }
        }

        //Edit a Password and UserName of an existing user
        public void UpdateTableUser(User user)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "User.db")))
                {
                    connection.Query<User>(
                        "UPDATE User SET UserName=?, UserPassword=? WHERE Id=?",
                        user.UserName, user.UserPassword, user.Id);
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
            }
        }

        //Edit the profile image of an existing user
        public void UpdateProfileImage(User user)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "User.db")))
                {
                    connection.Query<User>(
                        "UPDATE User SET UserImage=? WHERE Id=?",
                        user.UserImage, user.Id);
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
            }
        }

        //Check if given UserName exists
        public bool CheckUserName(string userName)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "User.db")))
                {
                    var query =
                        from s in connection.Table<User>()
                        where s.UserName.Equals(userName)
                        select s;
                    if (query.FirstOrDefault() != null)
                        return true;
                    return false;
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
                return false;
            }
        }

        //Check if given password of an existing Username is correct
        public bool CheckUserPassword(string userName, string userPassword)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "User.db")))
                {
                    var query =
                        from s in connection.Table<User>()
                        where s.UserName.Equals(userName)
                        select s;
                    return query.FirstOrDefault().UserPassword == userPassword;
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
                return false;
            }
        }

        //Get the unique UserID
        public int GetUserId(string userName)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "User.db")))
                {
                    var query =
                        from s in connection.Table<User>()
                        where s.UserName.Equals(userName)
                        select s;
                    return query.FirstOrDefault().Id;
                }
            }
            catch (SQLException ex)
            {
                Log.Info("SQLiteEx", ex.Message);
                return -1;
            }
        }

        //Get UserImager
        public byte[] GetUserImage(int userId)
        {
            try
            {
                using (var connection = new SQLiteConnection(System.IO.Path.Combine(_folder, "User.db")))
                {
                    var query =
                        from s in connection.Table<User>()
                        where s.Id.Equals(userId)
                        select s;
                    return query.FirstOrDefault().UserImage;
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
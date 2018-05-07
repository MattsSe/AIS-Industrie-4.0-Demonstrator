using SQLite;

namespace AIS_Demonstrator.SQLite
{
    public class User
    {
        [PrimaryKey, AutoIncrement]
        // ReSharper disable once UnusedMember.Global
        public int Id { get; set; }
        public string UserName { get; set; }
        public string UserPassword { get; set; }
        public byte[] UserImage { get; set; }
    }
}
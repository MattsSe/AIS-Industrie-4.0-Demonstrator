const Sequelize = require('sequelize');

const con = new Sequelize('root', null, null, {
    dialect: "sqlite",
    storage: 'coffeedb',
    define: {
        freezeTableName: true
    }
});

con
    .authenticate()
    .then(function (err) {
        console.log('Connection has been established successfully.');
    }, function (err) {
        console.log('Unable to connect to the database:', err);
    });


//  MODELS
var User = con.define('User', {
    username: Sequelize.STRING,
    password: Sequelize.STRING
});


//  SYNC SCHEMA
con
    .sync({force: true})
    .then(function (err) {
        console.log('It worked!');
    }, function (err) {
        console.log('An error occurred while creating the table:', err);
    });

// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('coffee.db');
//
// db.serialize(function() {
//     db.run(`
//     CREATE TABLE
// IF NOT EXISTS users
// (
//   user_id integer PRIMARY KEY,
//   first_name text NOT NULL,
//   last_name text NOT NULL,
//   email text NOT NULL UNIQUE,
// )`);
//
//     var stmt = db.prepare("INSERT INTO lorem users (?)");
//     for (var i = 0; i < 10; i++) {
//         stmt.run("Ipsum " + i);
//     }
//     stmt.finalize();
//
//     db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
//         console.log(row.id + ": " + row.info);
//     });
// });
//
// db.close();
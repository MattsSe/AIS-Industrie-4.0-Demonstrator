import {Sequelize} from 'sequelize-typescript';
import * as sqlite from 'sqlite3';

// create a new DB only in dev
if (process.env.ENV !== 'prod'){
    const dbPath = process.env.DB_PATH || './coffeedb.sqlite';
    const db = new sqlite.Database(dbPath);
}

export const sequelize = new Sequelize({
    database: 'coffeedb.sqlite',
    dialect: 'sqlite',
    username: '',
    password: '',
    modelPaths: [__dirname + '/models']
});

import {Sequelize} from 'sequelize-typescript';
import {User} from './models/User';

const sequelize = new Sequelize({
    database: 'coffeedb',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    modelPaths: [__dirname + '/models']
});

const user = new User({username: 'Dummy', password: 'password'});
user.save();
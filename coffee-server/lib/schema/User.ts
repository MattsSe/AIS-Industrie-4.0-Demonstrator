import {Table, Column, Model, UpdatedAt, CreatedAt} from 'sequelize-typescript';
import * as model from '../model';

@Table
export class User extends Model<User> implements model.User {

    @Column
    username: string;

    @Column
    password: string;

    @Column
    email: string;

    @CreatedAt
    @Column
    createdAt: Date;

    @UpdatedAt
    @Column
    updatedAt: Date;
}

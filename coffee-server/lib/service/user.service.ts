import "reflect-metadata";

import {USERS} from "../mock";
import {provideSingleton} from "../inversify/ioc";
import {User} from '../shared/models';

@provideSingleton(UserService)
export class UserService {

    getUsers(): Promise<User[] | any> {
        return USERS();
    }
}
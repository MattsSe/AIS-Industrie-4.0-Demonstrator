import {Get, Route} from "tsoa";
// IMPORTANT: reflect-metadata needs to be imported otherwise the dependency injection won't work
import "reflect-metadata";
import {provideSingleton} from "../inversify/ioc";

import {UserService} from "../service/user.service";
import {User} from "../shared/models";

@Route("Users")
@provideSingleton(UsersController)
export class UsersController {
    // Injection of objects is possible without the @inject decorator because TS exports the needed metadata automatically when we use 'reflect-metadata'
    constructor(private userService: UserService) {
    }

    @Get()
    async getHeroes(): Promise<User[]> {
        return this.userService.getUsers().then(
            async users => {
                console.log("Users name: " + users[0].name);
                return await users;
            }).catch(error => console.log(`getHeroes error: ${error}`));
    }
}
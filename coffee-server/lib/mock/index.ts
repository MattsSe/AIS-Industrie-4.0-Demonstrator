import * as model from '../model';
import {User} from '../schema/User';

// const demoUser = User.create({username: 'demo', password: 'pass'});

export async function USERS(): Promise<model.User[]> {
    return [];
}
    
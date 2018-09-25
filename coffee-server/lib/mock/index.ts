import * as model from '../shared/models';
import {User} from '../schema/User';

// const demoUser = User.create({username: 'demo', password: 'pass'});

export async function USERS(): Promise<model.User[]> {
    return [];
}
    
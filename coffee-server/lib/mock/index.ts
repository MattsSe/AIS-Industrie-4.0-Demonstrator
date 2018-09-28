import * as model from '../shared/models';

// const demoUser = User.create({username: 'demo', password: 'pass'});

export async function USERS(): Promise<model.User[]> {
    return [{username: "Dummyname", password: "DummyPassword", email: "dummyemail"}];
}
    
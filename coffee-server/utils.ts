import * as dotenv from 'dotenv';

dotenv.load({path: '.env'});

export namespace config {

    export function port() {
        return process.env.PORT || 27017
    }

    export function user() {
        return process.env.USER || ''
    }

    export function pass() {
        return process.env.PASS || ''
    }

    export function host() {
        return process.env.HOST || 'localhost'
    }

    export function connectionString() {
        let conn = 'mongodb://'
        if (user() && pass()) {
            conn += `${user()}:${pass()}`
        }
        return `${conn}@${host()}:${port()}/COFFEEdb`
    }

}


# AIS Coffee Demonstrator backend

## Install

````bash
# install all dependencies after cloning the repo
npm install
````


## Build

````bash
# build application
npm run build

# build application for production
npm run build:prod
````

## Run

```bash
# Enable typescript compiler and start nodemon server concurrently
npm run demon

# Alternatively start tsc compiler and nodemon server in two separate shells
npm run build:watch # 1. shell
npm run dev # 2. shell

# Run in production
npm run prod
```

You can set the port the server run by declaring the `PORT` env variable: `export PORT=3000`. Default is `3000`.

## Server routes

The server comes with swagger-ui support. Visit `localhost:3000/api-docs/` for the defined routes.


## Database

This project comes with sqlite3 support. If no database exists a new sqlite3 DB will be created during init at `./coffeedb.sqlite` or at the `DB_PATH` env variable if present.
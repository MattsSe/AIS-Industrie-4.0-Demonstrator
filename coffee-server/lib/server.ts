import app from './app';
import {createServer} from 'http';
import {sequelize} from './sequel';

const port = process.env.PORT || 3000;

// const httpsOptions = {
// //     key: fs.readFileSync('./config/key.pem'),
// //     cert: fs.readFileSync('./config/cert.pem')
// // }
// //
// // https.createServer(httpsOptions, app).listen(port, () => {
// //     console.log('Express server listening on port ' + port);
// // })

// waiting after the database is synced
(async () => {
    await sequelize.sync({force: true});

    createServer(app)
        .listen(
            port,
            () => console.info(`Server running on port ${port}`)
        );
})();
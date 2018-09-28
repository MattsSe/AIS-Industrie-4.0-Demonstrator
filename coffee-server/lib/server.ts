import app from './app';
import {createServer} from 'http';
import {sequelize} from './sequel';

// must be imported so tsoa can generate the routes, see: tsoa.json
import "./controllers/user.controller";
import "./opcua/controllers/BrowseController";
import "./opcua/controllers/ConnectorController";
import "./opcua/service/UAClientService";

const port = process.env.PORT || 3000;

// const httpsOptions = {
// //     key: fs.readFileSync('./config/key.pem'),
// //     cert: fs.readFileSync('./config/cert.pem')
// // }
// //
// // https.createServer(httpsOptions, app).listen(port, () => {
// //     console.log('Express opcua listening on port ' + port);
// // })

// waiting after the database is synced
(async () => {
    // this will delete all tables in the current database
    await sequelize.sync({force: true});

    createServer(app)
        .listen(
            port,
            () => console.info(`Server running on port ${port}`)
        );
})();
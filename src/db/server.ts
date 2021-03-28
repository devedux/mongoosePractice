import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
// path -> paquete de node por default
const path = require('path');

import {Routes} from '../routes';
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

export class Server {
    public app: express.Application;
    public static _instace: Server;
    public port = process.env.PORT || 3001;
    

    constructor() {
        this.connect__mongoDB();
        this.app = express();
        this.settings__json();
        this.hability__publicFile();
        this.settings__cors();
        this.settings__routes();
    }


    settings__cors () {
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            next();
        });
    }

    settings__json() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }) )
        // console.log('json')
    }


    hability__publicFile() {
        this.app.use(express.static(path.resolve(__dirname, '../../public')))
        console.log(path.resolve(__dirname, '../../public'))
    }

    settings__routes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.json({
                ok: true,
                message: 'The server is active'
            });
        });

        this.app.use(Routes);
    }

    connect__mongoDB() {
        let urlDB : any ;
        let useUnifiedTopology;
        if(process.env.NODE_ENV === 'dev') {
            config()
            urlDB = process.env.URL_DEV
            useUnifiedTopology = true
            console.log('dev')
        } else  {
            console.log('prod')
            urlDB = process.env.URL_PROD
            useUnifiedTopology = false
        }  
        mongoose.set('useFindAndModify', false);
        mongoose.connect( urlDB  , {
            useCreateIndex : true,
            useNewUrlParser: true,
            dbName: 'cafe',
            useUnifiedTopology
        }).then(() => {
            console.log('MongoDB Conectado')
        }).catch((err:any) => {
            console.log(err)
        })
    }

    

    run__start() {
        this.app.listen(this.port, () => {
            console.log(`the server running successfully in port http://localhost:${this.port} `);
        })
    }
}
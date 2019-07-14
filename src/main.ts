import express from 'express';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { userRoute } from './route/user';
import { todoRoute } from './route/todo';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { createLogger, transports } from 'winston';

const app = express();
config();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    res.header("Access-Control-Allow-Methods",
        "GET, POST, PUT, OPTIONS, DELETE");
    next();
});
const logger = createLogger({
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'server.log' })
    ]
});


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());


// function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
//     if (res.headersSent) {
//         return next(err)
//     }
//     res.status(500).json({ error: err })
// }
// app.use(errorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
    logger.log({
        level: 'info',
        message: JSON.stringify(req.body)
    });

    next();
});

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    res.json('get call');
});


app.use('/api/v1/user', userRoute);

app.use('/api/v1/todo', todoRoute);


mongoose.connect(process.env.DB || '',
    { useNewUrlParser: true }).
    then(() => {
        app.listen(process.env.PORT || 8001, () => {
            console.log('server started on 8001');
        });
    });

import express from 'express';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { userRoute } from './route/user';
import { todoRoute } from './route/todo';
import bodyParser from 'body-parser';
import { config } from 'dotenv';

const app = express();
config();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    res.header("Access-Control-Allow-Methods",
        "GET, POST, PUT, OPTIONS, DELETE");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());

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

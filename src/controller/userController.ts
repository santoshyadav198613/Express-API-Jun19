import { Request, Response, NextFunction } from 'express';
import { user } from "../model/user";
import { sign } from 'jsonwebtoken';

export class UserController {

    static getUsers(req: Request, res: Response, next: NextFunction) {
        res.json({ id: 1, name: 'rohit' });
    }

    static addUser(req: Request, res: Response, next: NextFunction) {
        console.log(req.body);
        res.json({ status: 'user added' });
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const privateKey = process.env.PRIVATEKEY || '';
            let token = '';
            const loginres = await user.findOne({
                email: req.body.email,
                password: req.body.password
            });
            if (loginres) {
                token = sign({ _id: loginres.id },
                    privateKey,
                    { expiresIn: '1h' });
            }
            const tokenres = { data: loginres, token: token };
            res.json(tokenres);
        }
        catch (err) {
            res.status(500).send(err);
        }
    }

    static async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const userdata = new user(req.body);
            const loginres = await user.insertMany(userdata);
            res.json(loginres);
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
}
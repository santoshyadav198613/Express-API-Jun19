import { Request, Response, NextFunction } from 'express';
import { user } from "../model/user";
import { sign } from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';

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
            const loginres: any = await user.findOne({
                email: req.body.email
            });
            if (loginres) {
                const isValid = compareSync(req.body.password, loginres.password);
                if (isValid) {
                    token = sign({ _id: loginres.id },
                        privateKey,
                        { expiresIn: '1h' });
                    const tokenres = { data: loginres, token: token };
                    res.json(tokenres);
                } else {
                    res.status(401).json('incorrect username or password');
                }
            } else {
                res.status(401).json('incorrect username or password');
            }
        }
        catch (err) {
            res.status(500).send(err);
        }
    }

    static async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const userdata = new user(req.body);
            const loginres = await user.create(userdata);
            res.json(loginres);
        }
        catch (err) {
            throw err;
        }
    }
}
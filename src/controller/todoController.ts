import { Request, Response, NextFunction } from 'express';

import { todo } from '../model/todo';

export class TodoController {
    static async getTodoList(req: Request, res: Response, next: NextFunction) {
        try {
            const todoList = await todo.find();
            res.json(todoList);
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
    static async addTodo(req: Request, res: Response, next: NextFunction) {
        try {
            const data = new todo(req.body);
            const todoRes = await todo.insertMany(data);
            res.json(todoRes);
        }
        catch (err) {
            res.status(500).send(err);
        }
    }

    static async updateTask(req: Request, res: Response, next: NextFunction) {
        try {
            const data = new todo(req.body);
            const todoRes = await todo.findByIdAndUpdate(data._id, {
                $set: {
                    title: req.body.title,
                    completed: req.body.completed
                }
            });
            res.json(todoRes);
        }
        catch (err) {
            res.status(500).send(err);
        }
    }

}
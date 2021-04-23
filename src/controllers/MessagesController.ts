import { Request, Response } from "express";
import { MessagesService } from "../services/MessagesService";

class MessagesController {
    // private service: MessagesService;

    constructor() {
        // this.service  = new MessagesService();
    }

    async create(request: Request, response: Response ) {
        const service  = new MessagesService();

        try {
            const { text, admin_id, user_id } = request.body;

            const setting =  await service.create({ text, admin_id, user_id });

            return response.json(setting);
        } catch (err) {
            return response.status(400).send({ message: err.message })
        }
    }

    showByUser(request: Request, response: Response) {
        const { id } = request.params;
        const service  = new MessagesService();
        const list = service.listByUser(id);
        return response.json(list);
    }

}

export { MessagesController }

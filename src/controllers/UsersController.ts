import { Request, Response } from "express";
import { UsersService } from "../services/UsersService";

class UsersController {

    async create(request: Request, response: Response ): Promise<Response> {
        const { email } = request.body;
        const service = new UsersService();

        try {
            const setting =  await service.create(email);
            return response.json(setting);
        } catch (err) {
            return response.status(400).send({ message: err.message })
        }
    }

}

export { UsersController }

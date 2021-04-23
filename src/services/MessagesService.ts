import { getCustomRepository, Repository } from "typeorm";
import { IMessageCreate } from "../types";
import { MessagesRepository } from "../repositories/MessagesRepository";
import { Message } from "../entities/Message";

class MessagesService {
    private repository: Repository<Message>;

    constructor() {
        this.repository = getCustomRepository(MessagesRepository)
    }

    async create({ text, admin_id, user_id } : IMessageCreate) {
        const userExists = await this.repository.findOne({ text });
        if (userExists) return userExists;

        const message = this.repository.create({ text, admin_id, user_id });
        return await this.repository.save(message);
    }

    async listByUser(user_id: string) {
        return await this.repository.find({
            where: { user_id },
            relations: ["user"]
        });
    }

}

export { MessagesService }

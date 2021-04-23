import { getCustomRepository, Repository } from "typeorm";
import { IConnectionCreate } from "../types";
import { Connection } from "../entities/Connection";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";

class ConnectionsService {
    private repository: Repository<Connection>;

    constructor() {
        this.repository = getCustomRepository(ConnectionsRepository)
    }

    async create({ id, admin_id, user_id, socket_id } : IConnectionCreate) {
        const connection = this.repository.create({ id, admin_id, user_id, socket_id });
        return await this.repository.save(connection);
    }

    findByUserId = async (user_id: string)  => this.repository.findOne({ user_id });

    findBySocketId = async (socket_id: string)  => this.repository.findOne({ socket_id });

    findAllWithoutAdmin = ()  => this.repository.find({
        where: { admin_id: null },
        relations: ["user"]
    });

}

export { ConnectionsService }

import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";

class UsersService {

    async create(email: string) {
        const repository = getCustomRepository(UsersRepository);

        const userExists = await repository.findOne({ email });
        if (userExists) return userExists;

        const user = repository.create({ email });
        return await repository.save(user);
    }
}

export { UsersService }

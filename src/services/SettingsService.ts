import { ISettingCreate } from "../types";
import { getCustomRepository } from "typeorm";
import { SettingsRepository } from "../repositories/SettingsRepository";
import {stringify} from "uuid";
import {Setting} from "../entities/Setting";

class SettingsService {

    async create({ chat, username } : ISettingCreate) {
        const repository = getCustomRepository(SettingsRepository);

        const alreadyExists = await repository.findOne({ username });
        if (alreadyExists) return Promise.reject('User already exists!')

        const setting = repository.create({ username, chat });
        return await repository.save(setting);
    }

    async findByUsername (username: string) {
        const repository = getCustomRepository(SettingsRepository);
        return await repository.findOne({ username });
    }

    async update(username: string, chat: boolean) {
        const repository = getCustomRepository(SettingsRepository);

        // Uma das formas de atualizar o objeto
        await repository
            .createQueryBuilder()
            .update(Setting)
            .set({ chat })
            .where("username = :username", { username })
    }

}

export { SettingsService }

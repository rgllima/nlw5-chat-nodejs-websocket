import { Request, Response } from "express";
import { SettingsService } from "../services/SettingsService";

class SettingsController {

    async create(request: Request, response: Response ) {
        const { username, chat } = request.body;
        const settingsService = new SettingsService();

        try {
            const setting =  await settingsService.create({ chat, username });
            return response.json(setting);
        } catch (err) {
            return response.status(400).send({ message: err.message })
        }
    }

    async findByUsername(request: Request, response: Response ) {
        const { username } = request.params;
        const settingsService = new SettingsService();

        try {
            const setting =  await settingsService.findByUsername(username);
            return response.json(setting);
        } catch (err) {
            return response.status(400).send({ message: err.message })
        }
    }

    async update(request: Request, response: Response ) {
        const { username } = request.params;
        const { chat } = request.body;
        const settingsService = new SettingsService();

        try {
            const setting =  await settingsService.update(username, chat);
            return response.json(setting);
        } catch (err) {
            return response.status(400).send({ message: err.message })
        }
    }

}

export { SettingsController }

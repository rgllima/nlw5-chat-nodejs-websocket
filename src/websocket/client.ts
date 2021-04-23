import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { UsersService } from "../services/UsersService";
import { MessagesService } from "../services/MessagesService";
import { ISocketParams } from "../types";

io.on("connect", socket => {
    const connectionsService = new ConnectionsService();
    const usersService = new UsersService();
    const messagesService = new MessagesService();

    socket.on("client_first_access", async ({ text, email }: ISocketParams) => {
        const user = await usersService.create(email);
        const connection = await connectionsService.findByUserId(user.id);

        if (!connection) {
            await connectionsService.create({ user_id: user.id, socket_id: socket.id });
        } else {
            connection.socket_id = socket.id
            await connectionsService.create(connection)
        }

        await messagesService.create({ text, user_id: user.id });

        const messages = await messagesService.listByUser(user.id);
        socket.emit("client_list_all_messages", messages);

        const allUsers = await connectionsService.findAllWithoutAdmin();
        io.emit("admin_list_all_users", allUsers)
    })

    socket.on("client_send_to_admin", async ({text, socket_admin_id}) => {
        const socket_id = socket.id;

        const { user_id } = await connectionsService.findBySocketId(socket_id);
        const message = await messagesService.create({ text, user_id});

        io.to(socket_admin_id).emit("admin_receive_message", {
            message,
            socket_id
        })
    })
})

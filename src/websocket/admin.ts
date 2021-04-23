import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
// import { UsersService } from "../services/UsersService";
import { MessagesService } from "../services/MessagesService";
// import { ISocketParams } from "../types";

io.on("connect", async socket => {
    const connectionsService = new ConnectionsService();
    // const usersService = new UsersService();
    const messagesService = new MessagesService();

    const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();

    io.emit("admin_list_all_users", allConnectionsWithoutAdmin);

    socket.on("admin_list_messages_by_user", async ({ user_id }, callback) => {
        const messages = await messagesService.listByUser(user_id);
        callback(messages);
    })

    socket.on("admin_send_message", async ({ user_id, text }) => {
        await messagesService.create({ text, user_id, admin_id: socket.id})

        const { socket_id } = await connectionsService.findByUserId(user_id);

        io.to(socket_id).emit("admin_send_to_client", {
            text,
            socket_id: socket.id
        })
    //     const user = await usersService.create(email);
    //     const connection = await connectionsService.findByUserId(user.id);
    //
    //     if (!connection) {
    //         await connectionsService.create({ user_id: user.id, socket_id: socket.id });
    //     } else {
    //         connection.socket_id = socket.id
    //         await connectionsService.create(connection)
    //     }
    //
    //     await messagesService.create({ text, user_id: user.id });
    //
    //     const messages = await messagesService.listByUser(user.id);
    //     socket.emit("client_list_all_messages", messages);
    })
})

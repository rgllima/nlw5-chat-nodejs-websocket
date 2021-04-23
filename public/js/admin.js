const socket = io();
let userConnections = []

socket.on("admin_list_all_users", connections => {
  userConnections = connections;
  document.getElementById("list_users").innerHTML = "";
  const template = document.getElementById("template").innerHTML;

  connections.forEach(connection => {
    const rendered = Mustache.render(template, {
      email: connection.user.email,
      id: connection.socket_id
    });
    document.getElementById("list_users").innerHTML += rendered;
  })
})

socket.on("admin_receive_message", ({message, socket_id }) => {
  const connection = userConnections.find(connection => connection.socket_id === socket_id)

  const divMessages = document.getElementById(`allMessages${connection.user_id}`)
  const createDiv = document.createElement("div");
  createDiv.className = "admin_message_client";
  createDiv.innerHTML = `<span>${connection.user.email}</span>`
  createDiv.innerHTML += `<span>${message.text}</span>`
  createDiv.innerHTML += `<span class='admin_date'>${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`

  divMessages.appendChild(createDiv);
})

function call(id) {
  const connection = userConnections.find(connection => connection.socket_id === id);
  const template = document.getElementById("admin_template").innerHTML

  const rendered = Mustache.render(template, {
    email: connection.user.email,
    id: connection.user_id
  });

  document.getElementById("supports").innerHTML += rendered

  const params = { user_id: connection.user_id };
  socket.emit("admin_list_messages_by_user", params, messages => {
    const divMessages = document.getElementById(`allMessages${connection.user_id}`)

      messages.forEach(message => {
        const createDiv = document.createElement("div");

        if (!message.admin_id) {
          createDiv.className = "admin_message_client";
          createDiv.innerHTML = `<span>${connection.user.email}</span>`
          createDiv.innerHTML += `<span>${message.text}</span>`
        } else {
          createDiv.className = "admin_message_admin";
          createDiv.innerHTML = `<span>Atendente: ${message.text}</span>`

        }
        createDiv.innerHTML += `<span class='admin_date'>${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`

        divMessages.appendChild(createDiv);
      });
  })
}

function sendMessage(id) {
  const text = document.getElementById(`send_message_${id}`);
  const params = { user_id: id, text: text.value };
  text.value = "";

  socket.emit("admin_send_message", params);

  const divMessages = document.getElementById(`allMessages${id}`)
  const createDiv = document.createElement("div");
  createDiv.className = "admin_message_admin";
  createDiv.innerHTML = `<span>Atendente: ${params.text}</span>`;
  createDiv.innerHTML += `<span class='admin_date'>${dayjs().format("DD/MM/YYYY HH:mm:ss")}</span>`;
  divMessages.appendChild(createDiv);
}

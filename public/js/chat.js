let socket_admin_id = null;
let user_email = null;
let socket = null

document.querySelector("#start_chat").addEventListener("click", (event) => {
  socket = io();

  const chat_help = document.getElementById("chat_help");
  chat_help.style.display = "none";

  const chat_in_support = document.getElementById("chat_in_support");
  chat_in_support.style.display = "block";

  const email = document.getElementById("email").value;
  const text = document.getElementById("txt_help").value;
  user_email = text;

  socket.on("connect", () => {
    const params = { email, text };

    socket.emit("client_first_access", params, (call, err) => {
      if (err) console.error(err);
      else console.log(call);
    })
  });

  socket.on("client_list_all_messages", messages => {
    const template_client = document.getElementById("message-user-template").innerHTML;
    const template_admin = document.getElementById("admin-template").innerHTML;

    messages.forEach(message => {
      if (!message.admin_id) {
        const rendered = Mustache.render(template_client, {
          message: message.text,
          email
        })
        document.getElementById("messages").innerHTML += rendered;
      } else {
        const rendered = Mustache.render(template_admin, {
          message_admin: message.text,
        })
        document.getElementById("messages").innerHTML += rendered;
      }
    })
  });

  socket.on("admin_send_to_client", ({ text, socket_id }) => {
    socket_admin_id = socket_id;

    const template_admin = document.getElementById("admin-template").innerHTML;
    const rendered = Mustache.render(template_admin, { message_admin: text })
    document.getElementById("messages").innerHTML += rendered;
  })
});

document.querySelector("#send_message_button").addEventListener("click", (event) => {
  const text = document.getElementById("message_user");
  const params = { text: text.value, socket_admin_id };
  socket.emit("client_send_to_admin", params);

  text.value = "";

  const template_client = document.getElementById("message-user-template").innerHTML;
  const rendered = Mustache.render(template_client, {
    message: params.text,
    email: user_email
  })

  document.getElementById("messages").innerHTML += rendered;
})



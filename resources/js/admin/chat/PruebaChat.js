// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import io from "socket.io-client";
// import { fetchUsuarioConversacionesMensajes } from "../../redux/features/usuarios/usuariosSlice";

// const socket = io("http://localhost:3009", {
//   auth: { id_usuario: localStorage.getItem("id_usuario"), token_user: "TOKEN" }
// });

// const PruebaChat = ({ receptorId }) => {
//   const dispatch = useDispatch();
//   const [input, setInput] = useState("");
//   const {usuario_conversaciones_mensajes
//   } = useSelector((state) => state.usuarios);

//   useEffect(() => {
//     if (!socket) {
//       console.warn("⚠️ Socket no disponible");
//       return;
//     }

//     const handleNewMessage = (mensaje) => {
//       console.log("📩 Nuevo mensaje recibido en tiempo real:", mensaje);
//       dispatch(fetchUsuarioConversacionesMensajes(receptorId));
//     };

//     socket.on("newMessage", handleNewMessage);

//     return () => {
//       socket.off("newMessage", handleNewMessage);
//     };
//   }, [receptorId, dispatch]);

//   const sendMessage = () => {
//     if (!socket || input.trim() === "") {
//       console.warn("⚠️ Mensaje inválido o conexión no establecida");
//       return;
//     }

//     const id_usuario = localStorage.getItem("id_usuario");

//     socket.emit("createChat", {
//       id_usuario,
//       receptorId,
//       mensaje: input,
//       emisor: "EMISOR",
//     });

//     setInput("");
//   };

//   return (
//     <div>
//       <h2>Chat</h2>
//       <div>
//         {mensajes.map((msg, index) => (
//           <p key={index}>{msg.mensaje}</p>
//         ))}
//       </div>
//       <input 
//         type="text" 
//         value={input} 
//         onChange={(e) => setInput(e.target.value)} 
//       />
//       <button onClick={sendMessage}>Enviar</button>
//     </div>
//   );
// };

// export default PruebaChat;

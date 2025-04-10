import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { fetchUsuariosExceptOne } from "../js/redux/features/usuarios/usuariosSlice";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, fetchConversations, fetchMessages, updateConversations, uploadFile } from "../js/redux/features/mensajes/mensajesSlice";
import WhatsAppChat from "../js/admin/chat/WhatsAppChat";
import { useRef } from "react";

const ChatComponent = () => {
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    const [receptorId, setReceptorId] = useState(null);
    const [socket, setSocket] = useState(null);
    const [fileToSend, setFileToSend] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const id_usuario = localStorage.getItem("id_usuario");
    const { usuarios_except_one } = useSelector((state) => state.usuarios);
    const messages = useSelector((state) => state.chat.messages);
    const conversations = useSelector((state) => state.chat.conversations);
    const messageEndRef = useRef(null);

    useEffect(() => {
        dispatch(fetchUsuariosExceptOne(Number(id_usuario)))
    }, [])

    useEffect(() => {
        if (!id_usuario || !receptorId) return;
        dispatch(fetchMessages({ id_usuario, receptorId }));
    }, [dispatch, receptorId]);

    useEffect(() => {

        dispatch(fetchConversations(Number(id_usuario)));

        const token_user = localStorage.getItem("token_user");

        if (!id_usuario || !token_user) return;

        const newSocket = io("http://localhost:3009", {
            transports: ["websocket"],
            query: { id_usuario },
            auth: { token_user },
        });

        newSocket.on("onMessage", (data) => {
            console.log("📩 Mensaje recibido:", data);
            dispatch(addMessage(data));
        });

        newSocket.on("privateMessage", (message) => {
            console.log("Nuevo mensaje privado recibido:", message);
            
            const audio = new Audio("/sounds/SonidoChat.mp3");
            audio.play().catch((e) => {
                console.warn("No se pudo reproducir el sonido:", e);
                
                if (Notification.permission === "granted") {
                    new Notification("Nuevo mensaje privado", {
                        body: "Necesita interactuar con la pagina" 
                    });
                } else if (Notification.permission !== "denied") {
                    Notification.requestPermission();
                }
            });
        });
        


        newSocket.on("updateConversations", (updatedConversations) => {
            dispatch(updateConversations(updatedConversations));
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect()
            newSocket.off("onMessage");
            newSocket.off("updateConversations");
        };
    }, [dispatch]);

    useEffect(() => {

        if (!socket || !id_usuario || !receptorId) return;

        const chatId = [id_usuario, receptorId].sort().join("_");

        socket.emit("joinChat", { chatId, userId: id_usuario });

        return () => {
            socket.emit("leaveChat", { chatId });
        };
    }, [socket, receptorId]);

    const sendMessage = async () => {
        if (!message.trim() && !fileToSend) {
            console.log("⚠️ Falta mensaje o archivo");
            return;
        }
        socket.emit(
            "createChat",
            {
                id_usuario,
                receptorId,
                mensaje: message,
                archivoUrl: null,
                tipoArchivo: null,
                nombreArchivo: null,
            }
        );

        setMessage("");

        if (fileToSend) {
            try {
                const resultAction = await dispatch(uploadFile(fileToSend));
                if (uploadFile.fulfilled.match(resultAction)) {
                    const fileData = resultAction.payload;
                    socket.emit(
                        "createChat",
                        {
                            id_usuario,
                            receptorId,
                            mensaje: "",
                            archivoUrl: fileData.archivoUrl,
                            tipoArchivo: fileData.tipoArchivo,
                            nombreArchivo: fileData.nombreArchivo,
                        }
                    );
                } else {
                    console.error("🚨 Error subiendo archivo:", resultAction.error);
                }
            } catch (error) {
                console.error("🚨 Error en la subida del archivo:", error);
            }

            setFileToSend(null);
            setFilePreview(null);
        }
    };

    const openFileExplorer = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "*/*";
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                setFileToSend(file);

                if (file.type.startsWith("image/")) {
                    setFilePreview(URL.createObjectURL(file));
                } else if (file.type.startsWith("text/")) {
                    const reader = new FileReader();
                    reader.onload = (e) => setFilePreview(e.target.result);
                    reader.readAsText(file);
                } else {
                    setFilePreview(null);
                }
            }
        };
        input.click();
    };
    return (
        <div>
            <WhatsAppChat
                usuarios={usuarios_except_one}
                setReceptorId={setReceptorId}
                activeChat={receptorId}
                messages={messages}
                message={message}
                setMessage={setMessage}
                messageEndRef={messageEndRef}
                sendMessage={sendMessage}
                openFileExplorer={openFileExplorer}
                fileToSend={fileToSend}
                setFileToSend={setFileToSend}
                conversations={conversations}
            />
        </div>
    );
};

export default ChatComponent;

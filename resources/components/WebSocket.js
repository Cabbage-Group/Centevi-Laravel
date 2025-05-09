import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { fetchUsuariosExceptOne } from "../js/redux/features/usuarios/usuariosSlice";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, clearMessages, fetchConversations, fetchMessages, updateConversations, uploadFile } from "../js/redux/features/mensajes/mensajesSlice";
import WhatsAppChat from "../js/admin/chat/WhatsAppChat";
import { useRef } from "react";

const ChatComponent = () => {
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    const [receptorId, setReceptorId] = useState(null);
    const [socket, setSocket] = useState(null);
    const [fileToSend, setFileToSend] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [searchName, setSearchName] = useState("");
    const id_usuario = localStorage.getItem("id_usuario");
    const { usuarios_except_one } = useSelector((state) => state.usuarios);
    const messages = useSelector((state) => state.chat.messages);
    const status = useSelector((state) => state.chat.status);
    const conversations = useSelector((state) => state.chat.conversations);
    const messageEndRef = useRef(null);


    useEffect(() => {
        dispatch(fetchUsuariosExceptOne(Number(id_usuario)))
    }, [])

    useEffect(() => {
        if (!id_usuario || !receptorId) return;
        dispatch(clearMessages())
        dispatch(fetchMessages({ id_usuario, receptorId }));
    }, [dispatch, receptorId]);

    useEffect(() => {
        dispatch(fetchConversations(
            {
                id_usuario: Number(id_usuario),
                name: searchName
            }));
    }, [searchName])

    useEffect(() => {

        const token_user = localStorage.getItem("token_user");

        if (!id_usuario || !token_user) return;

        const newSocket = io("http://localhost:3001", {
        // const newSocket = io("https://backend-contabilidad.centevi.digital", {
            transports: ["websocket"],
            query: { id_usuario },
            auth: { token_user },
        });

        newSocket.on("onMessage", (data) => {
            console.log("📩 Mensaje recibido:", data);
            dispatch(addMessage({
                ...data,
                estado: "ENVIADO"
            }));
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
        if (message) {
            const tempId = "temp-" + Date.now();

            const tempMessage = {
                id: tempId,
                contenido: message,
                usuarioId: Number(id_usuario),
                conversacionId: null,
                archivoUrl: null,
                tipoArchivo: null,
                nombreArchivo: null,
                estado: "PENDIENTE",
                creadoEn: new Date().toISOString()
            };

            dispatch(addMessage(tempMessage));

            socket.emit(
                "createChat",
                {
                    id_usuario,
                    receptorId,
                    estado: "ENVIADO",
                    mensaje: message,
                    archivoUrl: null,
                    tipoArchivo: null,
                    nombreArchivo: null,
                    tempId
                }
            );

            setMessage("");
        }

        if (fileToSend) {
            try {
                const tempId = "temp-" + Date.now();

                const resultAction = await dispatch(uploadFile(fileToSend));

                const tempMessageFile = {
                    id: tempId,
                    usuarioId: Number(id_usuario),
                    archivoUrl: resultAction.payload.archivoUrl,
                    tipoArchivo: resultAction.payload.tipoArchivo,
                    nombreArchivo: resultAction.payload.nombreArchivo,
                    estado: "PENDIENTE"
                };

                dispatch(addMessage(tempMessageFile));

                if (uploadFile.fulfilled.match(resultAction)) {
                    const fileData = resultAction.payload;
                    socket.emit(
                        "createChat",
                        {
                            id_usuario,
                            receptorId,
                            mensaje: "",
                            estado: "ENVIADO",
                            archivoUrl: fileData.archivoUrl,
                            tipoArchivo: fileData.tipoArchivo,
                            nombreArchivo: fileData.nombreArchivo,
                            tempId
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
                status={status}
                searchName={searchName}
                setSearchName={setSearchName}
            />
        </div>
    );
};

export default ChatComponent;

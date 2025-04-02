import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { fetchUsuarios } from "../js/redux/features/usuarios/usuariosSlice";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, fetchMessages, uploadFile } from "../js/redux/features/mensajes/mensajesSlice";
import WhatsAppChat from "../js/admin/chat/WhatsAppChat";
import { useRef } from "react";

const ChatComponent = () => {
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    const [receptorId, setReceptorId] = useState(null);
    const [socket, setSocket] = useState(null);
    const [fileToSend, setFileToSend] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const { usuarios } = useSelector((state) => state.usuarios);
    const messages = useSelector((state) => state.chat.messages);
    const messageEndRef = useRef(null);

    useEffect(() => {
        dispatch(fetchUsuarios({}));
    }, [dispatch]);

    useEffect(() => {
        const id_usuario = localStorage.getItem("id_usuario");

        if (!id_usuario || !receptorId) return;

        dispatch(fetchMessages({ id_usuario, receptorId }));
    }, [dispatch, receptorId]);

    useEffect(() => {
        const id_usuario = localStorage.getItem("id_usuario");
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

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [dispatch]);

    const sendMessage = async () => {
        if (!message.trim() && !fileToSend) {
            console.log("⚠️ Falta mensaje o archivo");
            return;
        }
        const id_usuario = localStorage.getItem("id_usuario");
        socket.emit(
            "createChat",
            {
                id_usuario,
                receptorId,
                mensaje: message,
                archivoUrl: null,
                tipoArchivo: null,
                nombreArchivo: null,
            },
            (response) => {
                if (response.success) {
                    socket.emit("sendMessage", {
                        id_usuario,
                        receptorId,
                        mensaje: message,
                        archivoUrl: null,
                        tipoArchivo: null,
                        nombreArchivo: null,
                    });
                }
            }
        );

        setMessage("");

        if (fileToSend) {
            try {
                const resultAction = await dispatch(uploadFile(fileToSend));
                console.log('resultAction:',resultAction)
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
                        },
                        (response) => {
                            if (response.success) {
                                socket.emit("sendMessage", {
                                    id_usuario,
                                    receptorId,
                                    mensaje: "",
                                    archivoUrl: fileData.archivoUrl,
                                    tipoArchivo: fileData.tipoArchivo,
                                    nombreArchivo: fileData.nombreArchivo,
                                });
                            }
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

                // Generar previsualización
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

    const clearFile = () => {
        setFileToSend(null);
        setFilePreview(null);
    };


    console.log('fileToSend.................:',fileToSend)
    return (
        <div>
            <WhatsAppChat
                usuarios={usuarios}
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

            />
        </div>
    );
};

export default ChatComponent;

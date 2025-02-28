import { useState, useEffect, useRef } from "react";
import { Row, Col, Input, Avatar, List, Typography, Badge, Divider, Layout } from "antd";
import {
    SendOutlined,
    SearchOutlined,
    EllipsisOutlined,
    PaperClipOutlined,
    SmileOutlined,
    CheckOutlined,
    UserOutlined
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography;

const WhatsAppChat = () => {
    const [activeChat, setActiveChat] = useState(0);
    const [conversations, setConversations] = useState([
        {
            id: 0,
            name: "María García",
            status: "en línea",
            avatar: "M",
            unread: 2,
            lastTime: "12:30",
            lastMessage: "¿Cómo estás hoy?",
            messages: [
                { text: "Hola!", sender: "bot", time: "10:03" },
                { text: "¿Cómo estás?", sender: "bot", time: "10:04" },
                { text: "¿Nos vemos mañana en el café?", sender: "bot", time: "10:10" },
            ]
        },
        {
            id: 1,
            name: "Juan Pérez",
            status: "escribiendo...",
            avatar: "J",
            unread: 0,
            lastTime: "Ayer",
            lastMessage: "Vale, hablamos luego",
            messages: [
                { text: "Hola Juan!", sender: "bot", time: "Ayer" },
                { text: "Te llamé ayer", sender: "user", time: "Ayer" },
                { text: "Vale, hablamos luego", sender: "bot", time: "Ayer" },
            ]
        },
        {
            id: 2,
            name: "Grupo Familia",
            status: "5 participantes",
            avatar: "F",
            unread: 5,
            lastTime: "09:45",
            lastMessage: "Mamá: ¿Quién puede ir a comprar?",
            messages: [
                { text: "¿Alguien va a venir a comer el domingo?", sender: "bot", time: "09:30" },
                { text: "Yo puedo!", sender: "user", time: "09:40" },
                { text: "¿Quién puede ir a comprar?", sender: "bot", time: "09:45" },
            ]
        },
        {
            id: 3,
            name: "Carlos Rodríguez",
            status: "última vez hoy 08:22",
            avatar: "C",
            unread: 0,
            lastTime: "08:20",
            lastMessage: "Voy a llegar tarde a la reunión",
            messages: [
                { text: "Buenos días", sender: "bot", time: "08:10" },
                { text: "Buenos días Carlos", sender: "user", time: "08:15" },
                { text: "Voy a llegar tarde a la reunión", sender: "bot", time: "08:20" },
            ]
        },
        {
            id: 4,
            name: "Laura Martínez",
            status: "última vez ayer 23:11",
            avatar: "L",
            unread: 0,
            lastTime: "Ayer",
            lastMessage: "Gracias por la ayuda!",
            messages: [
                { text: "¿Me puedes ayudar con el proyecto?", sender: "bot", time: "Ayer" },
                { text: "Claro, mándame los detalles", sender: "user", time: "Ayer" },
                { text: "Gracias por la ayuda!", sender: "bot", time: "Ayer" },
            ]
        },
        {
            id: 5,
            name: "Laura Martínez",
            status: "última vez ayer 23:11",
            avatar: "L",
            unread: 0,
            lastTime: "Ayer",
            lastMessage: "Gracias por la ayuda!",
            messages: [
                { text: "¿Me puedes ayudar con el proyecto?", sender: "bot", time: "Ayer" },
                { text: "Claro, mándame los detalles", sender: "user", time: "Ayer" },
                { text: "Gracias por la ayuda!", sender: "bot", time: "Ayer" },
            ]
        },
        {
            id: 6,
            name: "Laura Martínez",
            status: "última vez ayer 23:11",
            avatar: "L",
            unread: 0,
            lastTime: "Ayer",
            lastMessage: "Gracias por la ayuda!",
            messages: [
                { text: "¿Me puedes ayudar con el proyecto?", sender: "bot", time: "Ayer" },
                { text: "Claro, mándame los detalles", sender: "user", time: "Ayer" },
                { text: "Gracias por la ayuda!", sender: "bot", time: "Ayer" },
            ]
        },
        {
            id: 7,
            name: "Laura Martínez",
            status: "última vez ayer 23:11",
            avatar: "L",
            unread: 0,
            lastTime: "Ayer",
            lastMessage: "Gracias por la ayuda!",
            messages: [
                { text: "¿Me puedes ayudar con el proyecto?", sender: "bot", time: "Ayer" },
                { text: "Claro, mándame los detalles", sender: "user", time: "Ayer" },
                { text: "Gracias por la ayuda!", sender: "bot", time: "Ayer" },
            ]
        },
        {
            id: 8,
            name: "Laura Martínez",
            status: "última vez ayer 23:11",
            avatar: "L",
            unread: 0,
            lastTime: "Ayer",
            lastMessage: "Gracias por la ayuda!",
            messages: [
                { text: "¿Me puedes ayudar con el proyecto?", sender: "bot", time: "Ayer" },
                { text: "Claro, mándame los detalles", sender: "user", time: "Ayer" },
                { text: "Gracias por la ayuda!", sender: "bot", time: "Ayer" },
            ]
        },
        {
            id: 9,
            name: "Laura Martínez",
            status: "última vez ayer 23:11",
            avatar: "L",
            unread: 0,
            lastTime: "Ayer",
            lastMessage: "Gracias por la ayuda!",
            messages: [
                { text: "¿Me puedes ayudar con el proyecto?", sender: "bot", time: "Ayer" },
                { text: "Claro, mándame los detalles", sender: "user", time: "Ayer" },
                { text: "Gracias por la ayuda!", sender: "bot", time: "Ayer" },
            ]
        },
        {
            id: 10,
            name: "Laura Martínez",
            status: "última vez ayer 23:11",
            avatar: "L",
            unread: 0,
            lastTime: "Ayer",
            lastMessage: "Gracias por la ayuda!",
            messages: [
                { text: "¿Me puedes ayudar con el proyecto?", sender: "bot", time: "Ayer" },
                { text: "Claro, mándame los detalles", sender: "user", time: "Ayer" },
                { text: "Gracias por la ayuda!", sender: "bot", time: "Ayer" },
            ]
        },
        {
            id: 11,
            name: "Laura Martínez",
            status: "última vez ayer 23:11",
            avatar: "L",
            unread: 0,
            lastTime: "Ayer",
            lastMessage: "Gracias por la ayuda!",
            messages: [
                { text: "¿Me puedes ayudar con el proyecto?", sender: "bot", time: "Ayer" },
                { text: "Claro, mándame los detalles", sender: "user", time: "Ayer" },
                { text: "Gracias por la ayuda!", sender: "bot", time: "Ayer" },
            ]
        },
        {
            id: 12,
            name: "Laura Martínez",
            status: "última vez ayer 23:11",
            avatar: "L",
            unread: 0,
            lastTime: "Ayer",
            lastMessage: "Gracias por la ayuda!",
            messages: [
                { text: "¿Me puedes ayudar con el proyecto?", sender: "bot", time: "Ayer" },
                { text: "Claro, mándame los detalles", sender: "user", time: "Ayer" },
                { text: "Gracias por la ayuda!", sender: "bot", time: "Ayer" },
            ]
        }
    ]);

    const [input, setInput] = useState("");
    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversations[activeChat].messages]);

    const sendMessage = () => {
        if (input.trim() === "") return;
        const now = new Date();
        const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

        console.log('activeChat:', activeChat)
        const updatedConversations = [...conversations];

        // Add new message to the active chat
        updatedConversations[activeChat].messages.push({
            text: input,
            sender: "user",
            time
        });

        // Update last message for the sidebar
        updatedConversations[activeChat].lastMessage = input;
        updatedConversations[activeChat].lastTime = time;

        setConversations(updatedConversations);
        setInput("");

        // Simulate reply after a short delay
        setTimeout(() => {
            const reply = {
                text: "Ok, entendido 👍",
                sender: "bot",
                time: `${now.getHours()}:${(now.getMinutes() + 1).toString().padStart(2, '0')}`
            };

            const conversationsWithReply = [...updatedConversations];
            conversationsWithReply[activeChat].messages.push(reply);
            conversationsWithReply[activeChat].lastMessage = reply.text;
            conversationsWithReply[activeChat].lastTime = reply.time;

            setConversations(conversationsWithReply);
        }, 1500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    // WhatsApp-style timestamp formatter
    const formatDate = () => {
        const today = new Date();
        return `${today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}`;
    };

    const getAvatarColor = (index) => {
        const colors = ['#128C7E', '#075E54', '#25D366', '#34B7F1', '#4FCE5D'];
        return colors[index % colors.length];
    };



    return (
        <Row className="h-screen">
            {/* Left side - Conversations */}
            <Col span={8} className="border-r">
                <Layout className="h-full flex flex-col">
                    {/* Conversations Header */}
                    <Header
                        style={{ background: "#075E54", padding: "0 16px", height: "60px" }}
                        className="flex justify-between items-center"
                    >
                        <div className="flex items-center">
                            <Avatar style={{ backgroundColor: "#128C7E" }} icon={<UserOutlined />} />
                            <span className="text-white ml-3 font-medium">Chat Web</span>
                        </div>
                        <div className="flex gap-5 text-white">
                            <SearchOutlined style={{ fontSize: "18px" }} />
                            <EllipsisOutlined style={{ fontSize: "18px" }} />
                        </div>
                    </Header>

                    {/* Search Bar */}
                    <div style={{ padding: "8px", background: "#F6F6F6" }}>
                        <Input
                            prefix={<SearchOutlined style={{ color: "#919191" }} />}
                            placeholder="Buscar o empezar un nuevo chat"
                            style={{ borderRadius: "20px", backgroundColor: "white" }}
                        />
                    </div>

                    {/* Conversations List con Scroll Interno */}
                    <Content
                        className="flex-1 bg-gray-100 custom-scroll"
                        style={{
                            overflowY: "auto",
                            maxHeight: "calc(100vh - 120px)", // Ajustamos para evitar que la lista crezca demasiado
                        }}
                    >
                        <List
                            dataSource={conversations}
                            renderItem={(item, index) => (
                                <List.Item
                                    className={`cursor-pointer px-3 py-2 ${activeChat === index ? "bg-gray-200" : "hover:bg-gray-100"
                                        }`}
                                    onClick={() => setActiveChat(index)}
                                >
                                    <div className="w-full" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px" }}>
                                        <Avatar style={{ backgroundColor: getAvatarColor(index) }} size={48}>
                                            {item.avatar}
                                        </Avatar>
                                        <div>
                                            <Text strong>{item.name}</Text>
                                            <Text type="secondary" style={{ fontSize: "13px", display: "block", maxWidth: "80%" }} ellipsis>
                                                {item.lastMessage}
                                            </Text>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col border-b border-gray-100 pb-2">
                                        <div className="flex justify-between items-center">
                                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                                {item.lastTime}
                                            </Text>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            {item.unread > 0 && (
                                                <Badge count={item.unread} style={{ backgroundColor: "#25D366" }} />
                                            )}
                                        </div>
                                    </div>

                                </List.Item>
                            )}

                        />
                    </Content>
                    <style jsx>{`
    .custom-scroll::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scroll::-webkit-scrollbar-thumb {
        background-color: rgba(90, 81, 81, 0.3);
        border-radius: 6px;
    }
    .custom-scroll::-webkit-scrollbar-track {
        background: transparent;
    }
`}</style>
                </Layout>
            </Col>


            {/* Right side - Active Chat */}
            <Col span={16}>
                <Layout className="h-full flex flex-col">
                    {/* Chat Header */}
                    <Header
                        style={{ background: "#075E54", padding: "0 16px", height: "60px" }}
                        className="flex justify-between items-center"
                    >
                        <div className="flex items-center">
                            <Avatar
                                style={{ backgroundColor: getAvatarColor(activeChat) }}
                                size={40}
                            >
                                {conversations[activeChat].avatar}
                            </Avatar>
                            <div className="ml-3">
                                <div className="text-white font-medium">{conversations[activeChat].name}</div>
                                <div className="text-xs text-gray-300">{conversations[activeChat].status}</div>
                            </div>
                        </div>
                        <div className="flex gap-5 text-white">
                            <SearchOutlined style={{ fontSize: "18px" }} />
                            <EllipsisOutlined style={{ fontSize: "18px" }} />
                        </div>
                    </Header>

                    <div
                        style={{
                            flexGrow: 1,
                            overflowY: "auto",
                            height: "calc(100vh - 100px)",
                            background: "#E5DDD5",
                            backgroundImage: "url('/img/fondo_whatsapp.jpg')",
                            backgroundRepeat: "repeat",
                            backgroundSize: "contain",
                        }}
                        className="custom-scroll"
                    >
                        <Content
                            className="p-4 relative"
                            style={{
                                background: "transparent",
                                display: "flex",
                                flexDirection: "column",
                                minHeight: "100%",
                            }}
                        >
                            <div
                                style={{
                                    flexGrow: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {conversations[activeChat].messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className="flex mb-2"
                                        style={{
                                            justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                                            display: "flex",
                                            alignItems: "flex-end",
                                        }}
                                    >
                                        <div
                                            className="relative px-3 py-2 rounded-lg shadow-sm flex items-center"
                                            style={{
                                                backgroundColor: msg.sender === "user" ? "#DCF8C6" : "#FFFFFF",
                                                color: "#333",
                                                maxWidth: "75%",
                                                wordWrap: "break-word",
                                                textAlign: "left",
                                                borderRadius: "8px",
                                                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)",
                                            }}
                                        >
                                            <div className="flex-1">
                                                {msg.text} {msg.time} {" "}
                                                {msg.sender === "user" && (
                                                    <span style={{ color: "#4FC3F7" }}>
                                                        <CheckOutlined style={{ fontSize: "12px" }} />
                                                        <CheckOutlined style={{ fontSize: "12px", marginLeft: "-4px" }} />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messageEndRef} />
                            </div>
                        </Content>
                    </div>

                    <style jsx>{`
            .custom-scroll::-webkit-scrollbar {
                width: 6px;
            }
            .custom-scroll::-webkit-scrollbar-thumb {
                background-color: rgba(90, 81, 81, 0.3);
                border-radius: 6px;
            }
            .custom-scroll::-webkit-scrollbar-track {
                background: transparent;
            }
        `}</style>





                    {/* Input Area - Footer Fijo */}
                    <Footer
                        style={{
                            padding: "10px 16px",
                            background: "#EDEDED",
                            position: "sticky",
                            bottom: 0,
                            width: "100%",
                        }}
                    >
                        <Row gutter={8} align="middle">

                            <Col flex="auto">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Escribe un mensaje"
                                    style={{
                                        borderRadius: "20px",
                                        padding: "8px 12px",
                                        backgroundColor: "white",
                                    }}
                                    bordered
                                />
                            </Col>
                            <Col>
                                <div
                                    onClick={sendMessage}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        backgroundColor: "#128C7E",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: input.trim() ? "pointer" : "default",
                                        opacity: input.trim() ? 1 : 0.5,
                                    }}
                                >
                                    <SendOutlined style={{ color: "white" }} />
                                </div>
                            </Col>
                        </Row>
                    </Footer>
                </Layout>
            </Col>
        </Row >
    );
};

export default WhatsAppChat;
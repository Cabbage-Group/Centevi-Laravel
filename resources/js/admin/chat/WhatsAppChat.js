import { useState, useEffect, useRef } from "react";
import { Row, Col, Input, Avatar, List, Button, Radio, Typography, Badge, Layout, Modal, Popconfirm, DatePicker, Tooltip, FloatButton } from "antd";
import {
  SendOutlined,
  SearchOutlined,
  EllipsisOutlined,
  CalendarOutlined,
  CheckOutlined,

} from '@ant-design/icons';
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography;

dayjs.locale("es");

const WhatsAppChat = () => {

  const [activeChat, setActiveChat] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventBadge, setEventBadge] = useState("Trabajo");
  const [eventDates, setEventDates] = useState([dayjs(), dayjs().add(1, "day")]);
  const [eventDescription, setEventDescription] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [conversations, setConversations] = useState([
    {
      id: 0,
      name: "María García",
      status: "en línea",
      avatar: "M",
      unread: 2,
      calendar: 4,
      lastTimeCalendar: "2024-05-10 06:05:30",
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
      calendar: 8,
      lastTimeCalendar: "2024-10-11 13:10:30",
      lastTime: "Ayer",
      lastMessage: "Vale, hablamos luego",
      messages: [
        { text: "Hola Juan!", sender: "bot", time: "Ayer" },
        { text: "Te llamé ayer", sender: "user", time: "Ayer" },
        { text: "Vale, hablamos luego", sender: "bot", time: "Ayer" },
      ]
    },
    // {
    //   id: 2,
    //   name: "Grupo Familia",
    //   status: "5 participantes",
    //   avatar: "F",
    //   unread: 5,
    //   calendar: 10,
    //   lastTimeCalendar: "2025-01-13 18:10:30",
    //   lastTime: "09:45",
    //   lastMessage: "Mamá: ¿Quién puede ir a comprar?",
    //   messages: [
    //     { text: "¿Alguien va a venir a comer el domingo?", sender: "bot", time: "09:30" },
    //     { text: "Yo puedo!", sender: "user", time: "09:40" },
    //     { text: "¿Quién puede ir a comprar?", sender: "bot", time: "09:45" },
    //   ]
    // },
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
      name: "+507 7456-3201",
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
      name: "Jose Saul",
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
      name: "+507 6723-4589",
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
      name: "+507 7123-9876",
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
      name: "+507 6789-6543",
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

  const resetForm = () => {
    setEventTitle("");
    // setEventDescription("");
    // setEventDates([dayjs(), dayjs().add(1, "day")]);
    // setEventBadge("Trabajo");
    // setCurrentEventId(null);
    setIsEditMode(false);
  };

  const openNewEventModal = () => {
    setIsEditMode(false);
    // setCurrentEventId(null);
    // setEventTitle("");
    // setEventDescription("");
    // setEventDates([dayjs(), dayjs().add(1, "day")]);
    // setEventBadge("Trabajo");
    setIsModalOpen(true);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (

    <Row
      className="h-screen"
      gutter={[32, 16]}
    >
      {/* Left side - Conversations */}
      <Col xxl={8} xl={8} md={8} className="border-r">
        <Layout className="h-full flex flex-col" style={{ height: '90vh' }}>
          {/* Conversations Header */}
          <Header
            style={{ padding: "0 20px", marginBottom: '10px', borderRadius: '6px', background: 'white' }}
            className="flex justify-between shadow-md"
          >
            <div className="flex">
              <span className="font-extrabold text-2xl tracking-wide"
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#202C33 !important",
                  letterSpacing: "1px"
                }}
              >
                Chats
              </span>
            </div>
            <div className="flex gap-6 text-white">
              <SearchOutlined style={{ fontSize: "20px", cursor: "pointer", transition: "0.3s" }} className="hover:text-gray-400" />
              <EllipsisOutlined style={{ fontSize: "20px", cursor: "pointer", transition: "0.3s" }} className="hover:text-gray-400" />
            </div>
          </Header>

          {/* Conversations List con Scroll Interno */}
          <Content
            className="flex-1 custom-scroll"
            style={{
              overflowY: "auto",
              backgroundColor: "white",
              borderRadius: '6px'
            }}
          >
            {/* Search Bar */}
            <div style={{ padding: "8px", background: "white" }}>
              <Input
                prefix={<SearchOutlined
                  style={{ color: "#919191" }}
                />}
                placeholder="Buscar un nuevo chat"
                className="custom-input"
                style={{
                  borderRadius: "20px",
                  padding: "8px 12px",
                  background: "#eaeaea",
                  color: "#919191",
                  border: "none",
                }}
              />
            </div>
            <List
              dataSource={conversations}
              renderItem={(item, index) => (
                <List.Item
                  className={`cursor-pointer px-3 py-2 transition-colors`}
                  style={{
                    backgroundColor: activeChat === index ? "#eaeaea" : "white",
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveChat(index)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#eaeaea")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = activeChat === index ? "#eaeaea" : "white")}
                >
                  <div className="w-full" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px" }}>
                    <Avatar style={{ backgroundColor: getAvatarColor(index) }} size={48}>
                      {item.avatar}
                    </Avatar>
                    <div>
                      <Text strong style={{ color: "black" }}>{item.name}</Text>
                      <Text type="secondary" style={{ fontSize: "13px", display: "block", maxWidth: "80%", color: "#8696A0" }} ellipsis>
                        {item.lastMessage}
                      </Text>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col border-b border-gray-400 pb-2">
                    <div className="flex justify-between items-center">
                      <Text type="secondary" style={{ fontSize: "12px", color: "#8696A0" }}>
                        {item.lastTime}
                      </Text>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.unread > 0 && (
                        <Badge
                          count={item.unread}
                          style={{
                            backgroundColor: "#00A884",
                            color: "white",
                            boxShadow: "none",
                          }}
                        />
                      )}
                      {item.calendar > 0 && (
                        <Tooltip title={item.calendar}>
                          <Badge
                            count={
                              <CalendarOutlined
                                style={{ color: "white" }}
                              />
                            }
                            style={{
                              backgroundColor: "#00A884",
                              color: "#000",
                              boxShadow: "none",
                              borderRadius: "50%",
                              width: "24px",
                              height: "24px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginLeft: "4px",
                            }}
                          />
                        </Tooltip>
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
         height: 2px;
    }
   input::placeholder, 
    textarea::placeholder {
        color: rgba(255, 255, 255, 0.7) !important;
    }
`}</style>

        </Layout>
      </Col>


      {/* Right side - Active Chat */}
      <Col xxl={16} xl={16} md={16} style={{ position: 'relative' }}>
        <Layout
          className="h-full flex flex-col"
          style={{ borderRadius: '6px', position: 'relative', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px', height: '90vh' }}
        >
          {/* Chat Header */}
          <Header
            style={{
              background: "white", padding: "0 14px", position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between",
              borderTopLeftRadius: '6px', borderTopRightRadius: '6px', color: 'black'
            }}
          >
            <div style={{ display: "table" }}>
              <Avatar
                style={{ backgroundColor: getAvatarColor(activeChat), verticalAlign: "middle" }}
                size={40}
              >
                {conversations[activeChat]?.avatar}
              </Avatar>
              <div style={{ display: "table-cell", verticalAlign: "middle", paddingLeft: "10px" }}>
                <div style={{ color: "black", fontWeight: "500", whiteSpace: "nowrap" }}>
                  {conversations[activeChat]?.name}
                </div>
              </div>
            </div>

            {conversations[activeChat]?.lastTimeCalendar && (
              <Button
                type="primary"
                style={{ background: "#00A682", border: "none", borderRadius: "20px", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <CalendarOutlined style={{ color: "white", fontSize: "16px" }} />
                <span style={{ color: "white", fontWeight: "500" }}>{conversations[activeChat]?.lastTimeCalendar}</span>
              </Button>
            )}
          </Header>

          <div
            style={{
              flexGrow: 1,
              overflowY: "auto",
              // height: "calc(90vh - 125px)",
              background: "white",
              backgroundImage: "url('/img/fondo_wsp_blanco.jpg')",
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
                    className="flex mb-1"
                    style={{
                      justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                      display: "flex",
                      alignItems: "flex-end",
                    }}
                  >
                    <div
                      className="relative px-2 py-1 rounded-lg shadow-sm"
                      style={{
                        backgroundColor: msg.sender === "user" ? "#005C4B" : "#202C33",
                        color: "#FFFFFF",
                        maxWidth: "75%",
                        textAlign: "left",
                        borderRadius: "8px",
                        boxShadow: "0px 1px 2px rgba(150, 35, 35, 0.2)",
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                    >
                      <div style={{ wordBreak: "break-word" }}>{msg.text}</div>

                      {/* Contenedor de la hora y los check */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignSelf: "flex-end",
                          marginLeft: "5px",
                          marginBottom: "-2px",
                        }}
                      >
                        <span
                          className="text-xs"
                          style={{
                            fontSize: "10px",
                            whiteSpace: "nowrap",
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {msg.time} {new Date().getHours() >= 12 ? "p.m." : "a.m."}
                        </span>
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
              padding: "8px 12px",
              background: "white",
              bottom: "0px",
              width: "100%",
              position: 'absolute',
              borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px'
            }}
          >
            <Row gutter={8} align="middle">
              <Col>
                <div
                  onClick={openNewEventModal}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#128C7E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <CalendarOutlined style={{ color: "white" }} />
                </div>
              </Col>
              <Col flex="auto">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe un mensaje"
                  // className="custom-input"
                  style={{
                    borderRadius: "20px",
                    padding: "8px 12px",
                    backgroundColor: "#EAEAEA",
                    color: "black",
                    border: "none",
                  }}
                  bordered={false} // Oculta el borde
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


            <style jsx>{`   
              input::placeholder, 
                textarea::placeholder {
                    color: rgba(255, 255, 255, 0.7) !important;
                }
            `}</style>

          </Footer>

        </Layout>
      </Col>
      <Modal
        title={isEditMode ? "Editar Evento" : "Crear Evento"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        footer={[
          isEditMode && (
            <Popconfirm
              key="delete"
              title="¿Está seguro de eliminar este evento?"
              // onConfirm={handleDeleteEvent}
              okText="Sí"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />}>
                Eliminar
              </Button>
            </Popconfirm>
          ),
          <Button
            key="cancel"
            onClick={() => {
              setIsModalOpen(false);
              resetForm();
            }}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
          // onClick={handleCreateOrUpdateEvent}
          >
            {isEditMode ? "Actualizar" : "Crear"}
          </Button>,
        ]}
      >
        <Input
          placeholder="Título del Evento"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Input.TextArea
          placeholder="Descripción del Evento"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <DatePicker.RangePicker
          showTime
          value={[eventDates[0], eventDates[1]]}
          onChange={(dates) => setEventDates(dates)}
          style={{ marginBottom: "10px", width: "100%" }}
          placeholder={["Fecha inicio", "Fecha fin"]}
        />
        <Radio.Group
          value={eventBadge}
          onChange={(e) => setEventBadge(e.target.value)}
        >
          <Radio value="Trabajo">Trabajo</Radio>
          <Radio value="Personal">Personal</Radio>
          <Radio value="Importante">Importante</Radio>
        </Radio.Group>
      </Modal>
    </Row >

  );
};

export default WhatsAppChat;
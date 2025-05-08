import { useState, useEffect, useRef } from "react";
import { Row, Col, Input, Avatar, List, Button, Radio, Typography, Badge, Layout, Modal, Popconfirm, DatePicker, Tooltip, FloatButton, Dropdown, Menu } from "antd";
import {
  SendOutlined,
  SearchOutlined,
  CalendarOutlined,
  DeleteOutlined,
  DiffOutlined,
  CloseOutlined

} from '@ant-design/icons';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsuarios } from "../../redux/features/usuarios/usuariosSlice";
import { MentionsInput, Mention } from "react-mentions";
import { Link } from "react-router-dom";
import { fetchMentionUsers, fetchPacientesMenciones } from "../../redux/features/pacientes/pacientesSlice";
import '../../../css/chatMentions/styles.css'
import { fetchOrdenesMenciones } from "../../redux/features/ordenes/ordenesSlice";
import PdfThumbnail from "./PdfImage";
import FilePreview from "./FilePreview";
import SearchUsersChat from "./SearchUsersChat";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

dayjs.locale("es");
dayjs.extend(utc);
dayjs.extend(timezone);

const WhatsAppChat = ({
  usuarios,
  setReceptorId,
  activeChat,
  messages,
  message,
  setMessage,
  messageEndRef,
  sendMessage,
  openFileExplorer = { openFileExplorer },
  fileToSend,
  setFileToSend,
  conversations
}) => {

  const dispatch = useDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventBadge, setEventBadge] = useState("Trabajo");
  const [eventDates, setEventDates] = useState([dayjs(), dayjs().add(1, "day")]);
  const [eventDescription, setEventDescription] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [receptorName, setReceptorName] = useState("")
  const id_usuario = localStorage.getItem("id_usuario");
  const [allMenciones, setAllMenciones] = useState();
  const [bus, setBus] = useState();

  const {
    doctores_menciones
  } = useSelector((state) => state.usuarios);

  useEffect(() => {
    dispatch(fetchUsuarios({ search: bus }))
  }, [bus])

  useEffect(() => {
    if (messageEndRef && messageEndRef?.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages])


  const formatMessage = (message) => {
    if (!message) return [""];

    if (typeof message === "object" && message.type === "file") {
      return [`📎 Archivo adjunto: `, message.fileName];
    }

    if (typeof message !== "string") return [""];

    return message.split(/(@\[[^\]]+\]\(\d+\)|#\[\d+\]\(\d+\))/g).map((part, index) => {
      if (!part) return null;

      const mentionMatch = part.match(/@\[(.*?)\]\((\d+)\)/);
      if (mentionMatch) {
        const name = mentionMatch[1];
        const id = mentionMatch[2];

        // const isDoctor = doctores_menciones.some((doc) => doc.id.toString() === id);
        return (
          <a
            key={`mention-${index}`}
            href={`/historia-paciente/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#ffffff",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            @{name}
          </a>
        );
      }

      const orderMatch = part.match(/#\[(\d+)\]\((\d+)\|(\d+)\)/);

      if (orderMatch) {
        const display = orderMatch[1];
        const id = orderMatch[2];
        const idPaciente = orderMatch[3];

        return (
          <a
            key={`order-${index}`}
            href={`/orden-receta/${id}/${display}/${idPaciente}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fa8c16",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            #{display}
          </a>

        );
      }

      return part;
    });
  };

  const getAvatarColor = (index) => {
    const colors = ['#128C7E', '#075E54', '#25D366', '#34B7F1', '#4FCE5D'];
    return colors[index % colors.length];
  };

  const fetchData = async (search, callback) => {
    try {
      const response = await dispatch(fetchMentionUsers(search));
      const data = response.payload;

      const allMenciones = [
        ...doctores_menciones.map((doc) => ({
          id: doc.id.toString(),
          display: doc.display,
          type: "doctor",
        })),
        ...data.map((pac) => ({
          id: pac.id.toString(),
          display: pac.display,
          type: "paciente",
        }))
      ]
      callback(allMenciones);
      setAllMenciones(allMenciones)
      setBus(search)
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      callback([]);
    }
  };

  const fetchDataNroOrden = async (search, callback) => {
    try {
      const response = await dispatch(fetchOrdenesMenciones(search));
      const data = response.payload;
      const dataConPaciente = data.map((orden) => ({
        id: `${orden.id}|${orden.id_paciente}`,
        display: orden.display,
        id_paciente: orden.id_paciente,
      }));
      callback(dataConPaciente);
    } catch (error) {
      console.error('Error al buscar nro orden:', error);
      callback([]);
    }
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
      <Col xxl={8} xl={8} md={8} className="border-r">
        <Layout className="h-full flex flex-col" style={{ height: '90vh' }}>
          <SearchUsersChat
            users={usuarios}
            setReceptorId={setReceptorId}
            setReceptorName={setReceptorName}
          >
          </SearchUsersChat>

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
                    backgroundColor: activeChat === item?.userId ? "#eaeaea" : "white",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setReceptorId(item?.userId)
                    setReceptorName(item?.name)
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#eaeaea")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = activeChat === item?.userId ? "#eaeaea" : "white")}
                >
                  <div className="w-full" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px" }}>
                    <Avatar style={{ backgroundColor: getAvatarColor(index) }} size={48}>
                      {item.avatar}
                    </Avatar>
                    <div>
                      <Text strong style={{ color: "black" }}>{item?.name}</Text>
                      <Text type="secondary" style={{ fontSize: "13px", display: "block", maxWidth: "80%", color: "#8696A0" }} ellipsis>
                        {item?.lastMessage}
                      </Text>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col border-b border-gray-400 pb-2">
                    <div className="flex justify-between items-center">
                      <Text type="secondary" style={{ fontSize: "12px", color: "#8696A0" }}>
                        {item?.lastTime}
                      </Text>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.unreadMessages > 0 && (
                        <Badge
                          count={item?.unreadMessages}
                          style={{
                            backgroundColor: "#00A884",
                            color: "white",
                            boxShadow: "none",
                          }}
                        />
                      )}
                      {item?.calendar > 0 && (
                        <Tooltip title={item?.calendar}>
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
      <Col xxl={16} xl={16} md={16} style={{ position: 'relative' }}>
        <Layout
          className="h-full flex flex-col"
          style={{
            borderRadius: '6px',
            position: 'relative',
            borderBottomLeftRadius: '6px',
            borderBottomRightRadius: '6px',
            height: '90vh'
          }}
        >

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
                  {receptorName}
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
          {fileToSend ? (
            <div
              style={{
                background: "#E9EDEF",
                height: "80vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",

              }}
            >
              <CloseOutlined
                onClick={() => setFileToSend(null)}
                style={{
                  position: "absolute",
                  top: "8px",
                  left: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#555"
                }}
              />
              <h3 style={{ textAlign: "center", marginBottom: "20px" }}>{fileToSend.name}</h3>
              <div
                style={{
                  display: "flex",
                  overflow: "hidden",
                  justifyContent: "center",
                  alignItems: "center",
                  maxWidth: "100%",
                  maxHeight: "80vh"
                }}
              >
                <PdfThumbnail fileToSend={fileToSend} />
              </div>
            </div>
          ) : (
            <div
              style={{
                flexGrow: 1,
                overflowY: "auto",
                background: "white",
                backgroundImage: "url('/img/fondo_wsp_blanco.jpg')",
                backgroundRepeat: "repeat",
                backgroundSize: "contain",
                maxHeight: "calc(90vh - 120px)",
              }}
              className="custom-scroll"
            >
              <div className="p-4" style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
                <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  {messages?.map((msg, index) => (
                    <div
                      key={index}
                      className="flex mb-1"
                      style={{
                        justifyContent: msg.usuarioId == id_usuario ? "flex-end" : "flex-start",
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                    >
                      <div
                        className="relative px-2 py-1 rounded-lg shadow-sm"
                        style={{
                          backgroundColor: msg.usuarioId == id_usuario ? "#005C4B" : "#202C33",
                          color: "#FFFFFF",
                          maxWidth: "75%",
                          textAlign: "left",
                          borderRadius: "8px",
                          boxShadow: "0px 1px 2px rgba(150, 35, 35, 0.2)",
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                      >
                        <div style={{ wordBreak: "break-word" }}>
                          {msg.tipoArchivo ? (
                            <FilePreview msg={msg} />
                          ) : (
                            formatMessage(msg.contenido)
                          )}
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", alignSelf: "flex-end", marginLeft: "5px", marginBottom: "-2px" }}>
                          <span style={{ fontSize: "10px", whiteSpace: "nowrap", color: "rgba(255, 255, 255, 0.6)" }}>
                            {dayjs(msg.creadoEn).tz(dayjs.tz.guess()).format("h:mm a")}
                          </span>
                        
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", alignSelf: "flex-end", marginLeft: "5px", marginBottom: "-2px" }}>
                          <span style={{ fontSize: "12px", color: "#d1d1d1", marginRight: "12px" }} title={msg.estado === "PENDIENTE" ? "Pendiente" : "Enviado"}>
                            {msg.estado === "PENDIENTE" ? "✓" : msg.estado === "ENVIADO" ? "✓✓" : null}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>
              </div>
            </div>
          )}
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

          {fileToSend ? (
            <Footer
              style={{
                padding: "16px 24px",
                background: "#E9EDEF",
                bottom: "0px",
                width: "100%",
                position: "absolute",
                borderBottomLeftRadius: "6px",
                borderBottomRightRadius: "6px",
                zIndex: 10,
              }}
            >
              <Row gutter={8} align="middle" justify="center">
                <Col>
                  <div
                    onClick={sendMessage}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor: "#128C7E",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <SendOutlined style={{ color: "white", fontSize: "24px" }} />
                  </div>
                </Col>
              </Row>
            </Footer>
          ) : (
            <Footer
              style={{
                padding: "8px 12px",
                background: "white",
                bottom: "0px",
                width: "100%",
                position: 'absolute',
                borderBottomLeftRadius: '6px',
                borderBottomRightRadius: '6px',

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
                <Col>
                  <div
                    onClick={openFileExplorer}
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
                    <DiffOutlined style={{ color: "white" }} />
                  </div>
                </Col>
                <Col flex="auto">
                  <MentionsInput
                    className="mentions-input"
                    value={message}
                    allowSpaceInQuery={true}
                    placeholder="Escribe @ para mencionar a alguien o # para una orden"
                    onChange={(e) => {
                      const value = e.target.value;
                      setMessage(value)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage()
                      }
                    }}
                    style={{
                      suggestions: {
                        list: {
                          position: 'absolute',
                          bottom: '100%',
                          marginBottom: '5px',
                          backgroundColor: 'white',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                          zIndex: 10,
                          maxHeight: '200px',
                          overflowY: 'auto',
                          width: '300px',
                        }
                      },
                      control: {
                        borderRadius: "10px",
                        backgroundColor: "#EAEAEA",
                        color: "black",
                        border: "none",
                        width: "100%",
                        fontSize: "14px",
                      },
                      highlighter: {
                        padding: "4px 10px",
                      },
                      input: {
                        borderRadius: "10px",
                        outline: "none",
                        borderColor: "#EAEAEA",
                        padding: "4px 10px",
                      },
                    }}
                  >
                    <Mention
                      trigger="@"
                      data={fetchData}
                      displayTransform={(id, display) => {
                        const mention = allMenciones.find((item) => item.id === id);
                        const icon = mention?.type === "doctor" ? "🧑‍⚕️" : "🏥";
                        return `@${display} ${icon}`;
                      }}
                      renderSuggestion={(suggestion) => (
                        <div style={{ padding: "5px", cursor: "pointer" }}>
                          {suggestion.display} {suggestion.type === 'doctor' ? '🧑‍⚕️' : '🏥'}
                        </div>
                      )}
                      appendSpaceOnAdd
                    />
                    <Mention
                      trigger="#"
                      data={fetchDataNroOrden}
                      markup="#[__display__](__id__)"
                      displayTransform={(id, display) => `#${display}`}
                      renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
                        <div className={`orden-item ${focused ? 'focused' : ''}`}>
                          Orden #{suggestion.display} 📄
                        </div>
                      )}
                    >
                    </Mention>
                  </MentionsInput>
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
                      cursor: message?.trim() ? "pointer" : "default",
                      opacity: message?.trim() ? 1 : 0.5,
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
          )}

        </Layout>
      </Col >
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
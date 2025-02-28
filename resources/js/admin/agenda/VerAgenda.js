import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { Modal, Input, DatePicker, Radio, Button, Space, Popconfirm, Tag } from "antd";
import { LeftOutlined, RightOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/es";

// Configurar dayjs para usar español
dayjs.locale("es");

const VerAgenda = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventDates, setEventDates] = useState([dayjs(), dayjs().add(1, "day")]);
    const [eventBadge, setEventBadge] = useState("Trabajo");
    const [currentView, setCurrentView] = useState("dayGridMonth");
    const [currentEventId, setCurrentEventId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentDate, setCurrentDate] = useState(dayjs().format("MMMM YYYY"));
    const calendarRef = useRef(null);

    const handleDateClick = (info) => {
        setIsEditMode(false);
        setCurrentEventId(null);
        setEventTitle("");
        setEventDescription("");
        setEventDates([dayjs(info.dateStr), dayjs(info.dateStr).add(1, "day")]);
        setEventBadge("Trabajo");
        setIsModalOpen(true);
    };

    const handleEventClick = (info) => {
        const clickedEvent = events.find(event => event.id === info.event.id);
        if (clickedEvent) {
            setIsEditMode(true);
            setCurrentEventId(clickedEvent.id);
            setEventTitle(clickedEvent.title);
            setEventDescription(clickedEvent.description || "");
            setEventDates([
                dayjs(clickedEvent.start),
                dayjs(clickedEvent.end)
            ]);
            setEventBadge(clickedEvent.badge || "Trabajo");
            setIsModalOpen(true);
        }
    };

    const openNewEventModal = () => {
        setIsEditMode(false);
        setCurrentEventId(null);
        setEventTitle("");
        setEventDescription("");
        setEventDates([dayjs(), dayjs().add(1, "day")]);
        setEventBadge("Trabajo");
        setIsModalOpen(true);
    };

    const handleCreateOrUpdateEvent = () => {
        if (!eventTitle.trim()) return;

        if (isEditMode && currentEventId) {
            setEvents(events.map(event =>
                event.id === currentEventId
                    ? {
                        ...event,
                        title: eventTitle,
                        start: eventDates[0].format("YYYY-MM-DD HH:mm"),
                        end: eventDates[1].format("YYYY-MM-DD HH:mm"),
                        description: eventDescription,
                        badge: eventBadge,
                    }
                    : event
            ));
        } else {
            setEvents([
                ...events,
                {
                    id: Date.now().toString(),
                    title: eventTitle,
                    start: eventDates[0].format("YYYY-MM-DD HH:mm"),
                    end: eventDates[1].format("YYYY-MM-DD HH:mm"),
                    description: eventDescription,
                    badge: eventBadge,
                },
            ]);
        }

        setIsModalOpen(false);
        resetForm();
    };

    const handleDeleteEvent = () => {
        if (currentEventId) {
            setEvents(events.filter(event => event.id !== currentEventId));
            setIsModalOpen(false);
            resetForm();
        }
    };

    const resetForm = () => {
        setEventTitle("");
        setEventDescription("");
        setEventDates([dayjs(), dayjs().add(1, "day")]);
        setEventBadge("Trabajo");
        setCurrentEventId(null);
        setIsEditMode(false);
    };

    const changeView = (viewName) => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.changeView(viewName);
            setCurrentView(viewName);
        }
    };

    const goToToday = () => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.today();
        }
    };

    const goToPrev = () => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.prev();
        }
    };

    const goToNext = () => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.next();
        }
    };

    const categories = [
        { name: "Trabajo", color: "#1677ff" },
        { name: "Personal", color: "#52c41a" },
        { name: "Importante", color: "#ff4d4f" },
    ];

    return (
        <div style={{ width: "90%", margin: "auto", padding: "20px" }}>
            <h2>Calendario</h2>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openNewEventModal}
                >
                    Nuevo Evento
                </Button>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px", fontSize: "18px", fontWeight: "bold" }}>
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>{currentDate}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "10px" }}>
                <Space size="middle">
                    {categories.map((category) => (
                        <div key={category.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div
                                style={{
                                    width: 12,
                                    height: 12,
                                    backgroundColor: category.color,
                                    borderRadius: 3,
                                }}
                            />
                            <span>{category.name}</span>
                        </div>
                    ))}
                </Space>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <Space>
                    <Button onClick={goToPrev} icon={<LeftOutlined />} />
                    <Button onClick={goToNext} icon={<RightOutlined />} />
                    <Button onClick={goToToday}>
                        Hoy
                    </Button>
                </Space>

                <Space>
                    <Button
                        onClick={() => changeView("dayGridMonth")}
                        type={currentView === "dayGridMonth" ? "primary" : "default"}
                    >
                        Mes
                    </Button>
                    <Button
                        onClick={() => changeView("timeGridWeek")}
                        type={currentView === "timeGridWeek" ? "primary" : "default"}
                    >
                        Semana
                    </Button>
                    <Button
                        onClick={() => changeView("timeGridDay")}
                        type={currentView === "timeGridDay" ? "primary" : "default"}
                    >
                        Día
                    </Button>
                </Space>
            </div>

            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={currentView}
                headerToolbar={false}
                locale={esLocale}
                editable
                selectable
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                events={events}
                datesSet={(dateInfo) => setCurrentView(dateInfo.view.type)}
                buttonText={{
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día'
                }}
                eventContent={(eventInfo) => {
                    const eventData = events.find(e => e.id === eventInfo.event.id);
                    const badgeColor =
                        eventData && eventData.badge === "Importante" ? "#ff4d4f" :
                            eventData && eventData.badge === "Personal" ? "#52c41a" : "#1890ff";

                    return (
                        <div style={{
                            backgroundColor: badgeColor,
                            color: 'white',
                            padding: '2px 4px',
                            borderRadius: '3px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%',
                            height: '100%'
                        }}>
                            {eventInfo.event.title}
                        </div>
                    );
                }}
            />

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
                            onConfirm={handleDeleteEvent}
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
                        onClick={handleCreateOrUpdateEvent}
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
        </div>
    );
};

export default VerAgenda;
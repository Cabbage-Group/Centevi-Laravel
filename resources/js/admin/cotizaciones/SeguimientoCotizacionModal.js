import { Row, Col, Modal, Button, Form, Input, Divider, Select, DatePicker, Empty, 
  Card, Skeleton, Spin, Grid, message, Tooltip  } from 'antd';
import React, { useEffect, useState, useMemo  } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createQuoteTimeline, fetchQuotesTimelinesByQuoteId, updateQuoteTimeline, resetQuotesTimelinesState } from '../../redux/features/quotesTimelines/quotesTimelinesSlice';
import CotizacionesHistoria from '../../components/pages/admin/cotizaciones/cotizacionesHistoria';
import { PlusCircleOutlined, CloseOutlined  } from "@ant-design/icons"; 
import dayjs from 'dayjs';
import { generateLighterPalette, getColorByIdWithHash } from '../../utils/colorUtils';
import styled from '@emotion/styled';
import { css, Global } from '@emotion/react';

const { useBreakpoint } = Grid;

const spinStyles = css`
    .custom-col-for-spin .ant-spin-nested-loading {
      height: 100% !important;
    }
    
    .custom-full-height-spin .ant-spin-container {
      height: 100% !important;
    }
  `;


const SeguimientoCotizacionModal = ({
  quoteId,
  usuario_id,
  open,
  onClose
}) => {

  const dispatch = useDispatch();
  
  const { 
    quotes_timelines,
    fetch_status,
    fetch_error,
    create_status,
    create_error,
    update_status,
    update_error,
    delete_status,
    delete_error,
  } = useSelector((state) => state.quotesTimelines);

  const baseIntenseOptions = [
    '#3456A1',
    '#2F4CAF',
    '#0B63A5',
    '#6B2E8A',
    '#0E7AC4',
    '#274690'
  ];

  const [formAction, setFormAction] = useState('create');
  const [idSelected, setIdSelected] = useState(null);
  const [quoteTimelineSelected, setQuoteTimelineSelected] = useState(null);
  const [expandModalBody, setExpandModalBody] = useState(false);
  const [form] = Form.useForm();
  const [baseIntense, setBaseIntense] = useState(() => {
    // valor inicial aleatorio (por si el modal ya viene abierto)
    return baseIntenseOptions[Math.floor(Math.random() * baseIntenseOptions.length)];
  });

  const breakPoint = useBreakpoint();

  const [messageApi, contextHolder] = message.useMessage();

  
  const optionsPalette = { stepAmount: 6, maxSteps: 6, strategy: 'clamp' };
  
  const communicationChannelOptions = [
    {label: 'WhatsApp', value: 'whatsapp'},
    {label: 'Celular/Telefono', value: 'phone'},
    {label: 'Correo electónico', value: 'email'},
    {label: 'Presencial', value: 'presential'},
    {label: 'Otro', value: 'other'},
  ]

  const modalBodyStyle = expandModalBody
  // ? { height: '75vh', overflowY: 'auto', padding: 16 } // puedes ajustar padding si quieres
  ? { height: '75vh'}
  : {};

  // colores de los puntos del historial
  const colors = useMemo(() => {
    if (!quotes_timelines || quotes_timelines.length === 0) return [];
    return generateLighterPalette(quotes_timelines, baseIntense, optionsPalette);
  }, [quotes_timelines, baseIntense]);


  // carga de quoteTimelines para el quoteId pasado
  useEffect(() => {
    dispatch(fetchQuotesTimelinesByQuoteId(quoteId));
  }, [])

  useEffect(() => {
    const len = quotes_timelines?.length ?? 0;

    // Si quieres esperar a que termine la carga, descomenta la siguiente línea:
    // if (fetch_status !== 'succeeded') { setExpandModalBody(false); return; }

    let shouldExpand = false;

    // Prioriza breakpoints mayores primero
    if ( breakPoint.md || breakPoint.lg || breakPoint.xl || breakPoint.xxl) {
      // pantallas mayores a lg
      shouldExpand = len > 4;
    } else if ( breakPoint.sm) {
      // entre md y lg (incluye sm aquí según tu petición): umbral = 3
      shouldExpand = len > 3;
    } else {
      // xs o no detectado: no expandir
      shouldExpand = false;
    }

    setExpandModalBody(Boolean(shouldExpand));
  }, [
    breakPoint.xxl,
    breakPoint.xl,
    breakPoint.lg,
    breakPoint.md,
    breakPoint.sm,
    quotes_timelines?.length,
    // fetch_status, // opcional: añadir si quieres esperar a que termine la carga
  ]);

  useEffect(() => {
    if (create_status === 'succeeded') {
      messageApi.success('Seguimiento creado correctamente.');
      form.resetFields()
    }
    if (create_error) {
      messageApi.error('Error. No se creó el seguimiento.');
    }
  }, [create_status, create_error]);

  useEffect(() => {
    if (update_status === 'succeeded') {
      messageApi.success('Seguimiento actualizado correctamente.');
    }
    if (update_error) {
      messageApi.error('Error. No se actualizó el seguimiento.');
      form.setFieldsValue({
        context_title: quoteTimelineSelected.context_title,
        details: quoteTimelineSelected.details,
        communication_channel: quoteTimelineSelected.communication_channel,
        communication_info: quoteTimelineSelected.communication_info,
        occurred_at: quoteTimelineSelected.occurred_at ? dayjs(quoteTimelineSelected.occurred_at) : null, // DatePicker necesita dayjs
        usuario_id: usuario_id,
        quote_id: quoteId,
      });
    }
  }, [update_status, update_error]);

  // elige un baseIntense nuevo cada vez que se abre el modal (evita repetir el mismo)
  useEffect(() => {
    if (!open) return;
    if (!baseIntenseOptions || baseIntenseOptions.length === 0) return;
    const pickRandomBase = (prev) => {
      if (baseIntenseOptions.length === 1) return baseIntenseOptions[0];
      let candidate;
      let attempts = 0;
      do {
        candidate = baseIntenseOptions[Math.floor(Math.random() * baseIntenseOptions.length)];
        attempts++;
      } while (candidate === prev && attempts < 10);
      return candidate;
    };
    setBaseIntense(prev => pickRandomBase(prev));
  }, [open]); // sólo cuando modal abre

  const onFinish = async (values) => {
    // console.log(values);
    const data = {
      ...values
    }
    if(formAction === "create"){
      await dispatch(createQuoteTimeline(data));
    } else if (formAction === "update"){
      await dispatch(updateQuoteTimeline({id:idSelected, data}));
    }
    //reiniciar data
    await dispatch(fetchQuotesTimelinesByQuoteId(quoteId));
  }

  const handleFormActionChange = () => {
    setFormAction('create');
    form.resetFields();
  }

  const handleSeguimientoEditTouched = (data) => {
    // console.log(data);
    setQuoteTimelineSelected(data)
    setFormAction('update');
    setIdSelected(data.id);
    console.log(data);
    form.setFieldsValue({
      context_title: data.context_title,
      details: data.details,
      communication_channel: data.communication_channel,
      communication_info: data.communication_info,
      occurred_at: data.occurred_at ? dayjs(data.occurred_at) : null, // DatePicker necesita dayjs
      usuario_id: usuario_id,
      quote_id: quoteId,
    });
    
  }

  const handleClose = () => {
    dispatch(resetQuotesTimelinesState()); // limpia redux
    form.resetFields(); // limpia formulario
    setFormAction('create');
    setIdSelected(null);
    setQuoteTimelineSelected(null);
    onClose(); // cierra el modal (padre maneja "open")
  };

  const getButtonLabel = () => {
    if (formAction === 'create') {
      return create_status === 'loading' ? 'Creando...' : 'Crear';
    }
    if (formAction === 'update') {
      return update_status === 'loading' ? 'Actualizando...' : 'Actualizar';
    }
    return 'Guardar';
  };


  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={{
        xs: '95%',
        sm: '95%',
        md: '90%',
        lg: '80%',
        xl: '70%',
        xxl: '60%',
      }}
      styles={{body: modalBodyStyle}}
      destroyOnHidden={true}
      // closable={false}
    >
      <Global styles={spinStyles} />
      {contextHolder}
      {/* Contenedor principal */}
      <Row gutter={[16, 16]} style={{width: '100%', height: '100%'}}>

        {/* Title Header container */}
        <Col xs={24} sm={24} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '32px'}}>

          <div style={{fontSize: '16px', fontWeight: 'bold', }}>
            Seguimientos de cotizacion {quoteId}
          </div>

          <Button
            onClick={handleFormActionChange}
            type="primary"
            style={{
              borderRadius: "8px",
              transition: "background-color 0.3s ease",
              marginRight: "24px",
              backgroundColor: "#1ABC9C",
              borderColor: "#1ABC9C",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#48C9B0"; // un tono más claro
              e.currentTarget.style.borderColor = "#48C9B0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1ABC9C";
              e.currentTarget.style.borderColor = "#1ABC9C";
            }}
            icon={<PlusCircleOutlined />}
          >
            {breakPoint.sm ? 'Seguimiento': ''}
          </Button>

        </Col>

        {/* Body content */}
        <Col xs={24} sm={24} style={{height: 'calc(100% - 32px - 16px)',}}>
          <Row style={{width: '100%', height: '100%'}}>

            {/* Formulario container */}
            <Col xs={24} sm={11} style={{height: '100%'}}>
              {/* Grid manager */}
              <Row gutter={[12, 12]} style={{height: '100%'}}>
                {/* Titulo del formulario */}
                <Col xs={24} sm={24} style={{height: '25px'}}>
                  <div style={{fontSize: '16px', fontWeight: 'bold'}}>
                    {formAction === 'create' ? 'Nuevo seguimiento' : 'Actualizar seguimiento...'}
                  </div>
                </Col>

                {/* Cuerpo del formulario */}
                <Col xs={24} sm={24} style={{height: 'calc(100% - 25px - 12px)'}} className='custom-col-for-spin'>
                  <Spin
                    spinning={create_status === 'loading' || update_status === 'loading'}
                    tip="Cargando..."
                    size="large"
                    rootClassName="custom-full-height-spin"
                    wrapperClassName='custom-full-height-spin'
                    className='custom-full-height-spin'
                  >
                    <Form
                      form={form}
                      onFinish={onFinish}
                      style={{height: '100%'}}
                    >
                      <Row style={{maxHeight: '100%', overflowY: 'auto'}}>

                        <Col xs={24} sm={24}>
                          <Form.Item
                            label='Titulo contextual'
                            name='context_title'
                            layout='vertical'
                            required
                            rules={[{ required: true, message: 'El título contextual es obligatorio' }]}
                          >
                            <Input/>
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={24}>
                          <Form.Item
                            label='Detalles'
                            name='details'
                            layout='vertical'
                            tooltip="Este campo es opcional"
                          >
                            <Input.TextArea/>
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={24}>
                          <Form.Item
                            label='Medio de comunicación'
                            name='communication_channel'
                            layout='vertical'
                            required
                            rules={[{ required: true, message: 'Seleccione un medio de comunicación' }]}
                          >
                            <Select
                              onChange={()=>{}}
                              options={communicationChannelOptions}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={24}>
                          <Form.Item
                            label='Información de la comunicación'
                            name='communication_info'
                            layout='vertical'
                            tooltip="Este campo es opcional"
                          >
                            <Input/>
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={24}>
                          <Form.Item
                            label='Ocurrido en'
                            name='occurred_at'
                            layout='vertical'
                            required
                            rules={[{ required: true, message: 'Debe seleccionar la fecha y hora' }]}
                          >
                            <DatePicker
                              format="DD-MM-YYYY HH:mm:ss"
                              showTime={true}
                              style={{width: '100%'}}
                            />
                          </Form.Item>
                        </Col>

                        {/* Campos invisibles */}
                        <Form.Item name="usuario_id" initialValue={usuario_id} hidden>
                          <Input />
                        </Form.Item>
                        <Form.Item name="quote_id" initialValue={quoteId} hidden>
                          <Input />
                        </Form.Item>

                        {/* boton para enviar */}
                        <Col xs={24} sm={24} 
                          style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}
                        >
                        
                          <Button 
                            type="primary" 
                            htmlType="submit"
                            disabled={create_status === 'loading' || update_status === 'loading' || fetch_status === 'loading'}
                            style={breakPoint.md ? {
                              borderRadius: "8px",
                              fontWeight: "bold",
                              transition: "all 0.3s ease",
                              width: "200px"
                            } : {
                              borderRadius: "8px",
                              fontWeight: "bold",
                              transition: "all 0.3s ease",
                              width: "100%"
                            }}
                          >
                            {getButtonLabel()}
                          </Button>
                          
                        </Col>
                      </Row>
                    </Form>
                  </Spin>
                </Col>
              </Row>
            </Col>
                          
            {/* divisor */}
            <Col xs={24} sm={1} style={breakPoint.sm ? {display: 'flex', flexDirection: 'row', justifyContent: 'center', height: '100%'} 
                : {display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: '15px 0 15px 0', height:'4px'}}
            >
              <Divider 
                type={breakPoint.sm ? 'vertical' : 'horizontal'} 
                style={breakPoint.sm ? {margin: '0 0 0 0', height: '100%', borderInlineWidth: '2px',} : 
                {margin: '0 0 0 0', width: '100%', borderInlineWidth: '2px',}}
              />
            </Col>
                          
            {/* Seguimiento cotizacion container */}
            <Col xs={24} sm={12} style={{height: '100%'}}>
              {/* Grid manager */}
              <Row gutter={[12, 12]} style={{width: '100%', height: '100%'}}>
                {/* Titulo seguimiento */}
                <Col xs={24} sm={24} 
                  style={{ height: '25px'}}
                >
                  <div style={{fontSize: '16px', fontWeight: 'bold'}}>
                    Historial de seguimientos
                  </div>
                </Col>
                          
                {/* Cuerpo de seguimiento */}
                <Col xs={24} sm={24} style={{width: '100%', height: 'calc(100% - 25px - 12px)', overflowY: 'auto'}}>
                  <Row gutter={[12, 12]}>
                    {fetch_status === 'loading' ? (
                      <Col xs={24} sm={24}>
                      {/* Cargando... */}
                        <Card style={{ width: '100%' }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
                            <Spin size="large" style={{ marginBottom: "20px" }} />
                            <Skeleton active paragraph={{ rows: 3 }} style={{ width: "100%" }} />
                          </div>
                        </Card>
                      </Col>
                    ) : quotes_timelines && quotes_timelines.length > 0 ? (
                      <Col xs={24} sm={24}>
                        {quotes_timelines.map((qt, idx) => (
                          <CotizacionesHistoria
                            key={qt.id}
                            data={qt}
                            color={colors[idx] || baseIntense}
                            onClick={handleSeguimientoEditTouched}
                          />
                        ))}

                      </Col>
                    ) : (
                      <Col xs={24} sm={24} style={{display: 'flex', justifyContent: 'center'}}>
                        {/* Sin data */}
                        <Empty description="Sin datos" />
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
            </Col>

          </Row>
        </Col>

      </Row>
    </Modal>
  );
};

export default SeguimientoCotizacionModal;


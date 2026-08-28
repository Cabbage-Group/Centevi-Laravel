import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    DatePicker,
    message,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
    createAnticipo,
    updateAnticipo,
} from "../../../redux/features/anticipos/anticiposSlice.js";

const CrearAnticipoModal = ({
    open,
    onClose,
    onSuccess,
    record = null,
}) => {
    const [form] = Form.useForm();
    const [guardando, setGuardando] = useState(false);

    const dispatch = useDispatch();

    const { sucursales_option_selects } = useSelector(
        (state) => state.sucursales
    );

    const { pacientes_options_selecteds } = useSelector(
        (state) => state.pacientes
    );

    const editando = !!record;

    const tieneOrdenAnticipo =
        record?.ordenAnticipos?.length > 0;

    useEffect(() => {
        if (!open) {
            return;
        }

        if (record) {
            form.setFieldsValue({
                id_paciente: record.id_paciente,
                id_sucursal: record.id_sucursal,
                referencia: record.referencia,
                tipo: record.tipo,
                monto: Number(record.monto),
                estado: record.estado,
                fecha: record.fecha
                    ? dayjs(record.fecha)
                    : dayjs(),
            });
        } else {
            form.resetFields();

            form.setFieldsValue({
                fecha: dayjs(),
                estado: 1,
            });
        }
    }, [open, record, form]);

    const handleGuardar = async () => {
        try {
            const values = await form.validateFields();

            setGuardando(true);

            const data = {
                id_paciente: values.id_paciente,
                id_sucursal: values.id_sucursal,
                referencia: values.referencia || null,
                tipo: values.tipo,
                estado: values.estado,
                fecha: values.fecha.format("YYYY-MM-DD"),
            };

            if (!editando || !tieneOrdenAnticipo) {
                data.monto = values.monto;
            }

            let result;

            if (editando) {
                result = await dispatch(
                    updateAnticipo({
                        id: record.id_anticipo,
                        data,
                    })
                );
            } else {
                result = await dispatch(
                    createAnticipo(data)
                );
            }

            if (
                createAnticipo.fulfilled.match(result) ||
                updateAnticipo.fulfilled.match(result)
            ) {
                message.success(
                    result.payload?.message ||
                    (
                        editando
                            ? "Anticipo actualizado correctamente"
                            : "Anticipo creado correctamente"
                    )
                );

                form.resetFields();
                onClose();

                if (onSuccess) {
                    onSuccess();
                }
            } else {
                message.error(
                    result.payload?.message ||
                    (
                        editando
                            ? "No se pudo actualizar el anticipo"
                            : "No se pudo crear el anticipo"
                    )
                );
            }
        } catch (error) {
            if (error?.errorFields) {
                return;
            }

            message.error(
                editando
                    ? "Error al actualizar el anticipo"
                    : "Error al crear el anticipo"
            );
        } finally {
            setGuardando(false);
        }
    };

    return (
        <Modal
            title={
                editando
                    ? "Actualizar Anticipo"
                    : "Agregar Anticipo"
            }
            open={open}
            onCancel={onClose}
            onOk={handleGuardar}
            okText={
                editando
                    ? "Actualizar"
                    : "Guardar"
            }
            cancelText="Cancelar"
            confirmLoading={guardando}
            destroyOnClose
        >
            {editando && tieneOrdenAnticipo && (
                <div
                    style={{
                        background: "#fff7e6",
                        border: "1px solid #ffd591",
                        borderRadius: 6,
                        padding: "10px 12px",
                        marginBottom: 16,
                    }}
                >
                    <strong>Anticipo aplicado</strong>

                    <div style={{ marginTop: 4 }}>
                        Este anticipo ya está relacionado con
                        una orden. El monto no puede ser
                        modificado.
                    </div>
                </div>
            )}

            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="id_paciente"
                    label="Paciente"
                    rules={[
                        {
                            required: true,
                            message: "Ingrese el paciente",
                        },
                    ]}
                >
                    <Select
                        placeholder="Seleccione un paciente"
                        options={pacientes_options_selecteds}
                        filterOption={(input, option) => {
                            const searchTerms =
                                input
                                    .toLowerCase()
                                    .split(" ");

                            return searchTerms.every(
                                (term) =>
                                    (
                                        option?.label ?? ""
                                    )
                                        .toLowerCase()
                                        .includes(term)
                            );
                        }}
                        showSearch
                        optionFilterProp="label"
                    />
                </Form.Item>

                <Form.Item
                    name="id_sucursal"
                    label="Sucursal"
                    rules={[
                        {
                            required: true,
                            message:
                                "Seleccione una sucursal",
                        },
                    ]}
                >
                    <Select
                        placeholder="Seleccione una sucursal"
                        options={sucursales_option_selects}
                        showSearch
                        optionFilterProp="label"
                    />
                </Form.Item>

                <Form.Item
                    name="referencia"
                    label="Referencia"
                >
                    <Input
                        placeholder="Ingrese la referencia"
                        maxLength={255}
                    />
                </Form.Item>

                <Form.Item
                    name="tipo"
                    label="Tipo"
                    rules={[
                        {
                            required: true,
                            message:
                                "Seleccione el tipo",
                        },
                    ]}
                >
                    <Select
                        placeholder="Seleccione el tipo"
                        options={[
                            {
                                value: "Efectivo",
                                label: "Efectivo",
                            },
                            {
                                value: "Transferencia",
                                label: "Transferencia",
                            },
                            {
                                value: "Tarjeta",
                                label: "Tarjeta",
                            },
                            {
                                value: "Otro",
                                label: "Otro",
                            },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="monto"
                    label="Monto"
                    rules={[
                        {
                            required: true,
                            message:
                                "Ingrese el monto",
                        },
                    ]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        placeholder="0.00"
                        min={0.01}
                        precision={2}
                        disabled={
                            editando &&
                            tieneOrdenAnticipo
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="estado"
                    label="Estado"
                    rules={[
                        {
                            required: true,
                            message:
                                "Seleccione el estado",
                        },
                    ]}
                >
                    <Select
                        options={[
                            {
                                value: 1,
                                label: "Activo",
                            },
                            {
                                value: 0,
                                label: "Inactivo",
                            },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="fecha"
                    label="Fecha"
                    rules={[
                        {
                            required: true,
                            message:
                                "Seleccione la fecha",
                        },
                    ]}
                >
                    <DatePicker
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CrearAnticipoModal;
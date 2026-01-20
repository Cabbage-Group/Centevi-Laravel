import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    DatePicker,
    InputNumber,
    Select,
    Space,
    Table,
    Typography,
    Divider,
    Row,
    Col,
    Switch
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { useDispatch, useSelector } from 'react-redux';
import { fetchPacientes } from '../../redux/features/pacientes/pacientesSlice';
import { fetchExchangeRate, updateQuote, VerUnaQuote } from '../../redux/features/quotes/quotesSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchWareHouses } from '../../redux/features/warehouses/warehousesSlice';
import { fetchProductsInterfuerza } from '../../redux/features/productsInterfuerza/ProductsInterfuerza';
import { update } from 'lodash';
import { getMaxDiscountFromPermisos } from '../../utils/ValidarPermisos';
import Swal from 'sweetalert2';

const { Option } = Select;
const { Title } = Typography;
const TAX_RATE = 0.07;

const UpdateCotizacion = () => {

    const dispatch = useDispatch();
    const { permisos } = useSelector(({ auth }) => auth);
    const [form] = Form.useForm();
    const { exchangeRate, quote } = useSelector((state) => state.quotes);
    const nombre = localStorage.getItem('nombre');
    const [lines, setLines] = useState([]);
    const { id } = useParams();
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [maxAbono, setMaxAbono] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const maxDiscount = getMaxDiscountFromPermisos(permisos);
    const [tempDiscount, setTempDiscount] = useState('');
    const [selectedBodega, setSelectedBodega] = useState(null);
    const [tempRowDiscounts, setTempRowDiscounts] = useState({}); // { [index]: '12.34' }
    const [editingRows, setEditingRows] = useState({});

    const {
        productsInterfuerza,
    } = useSelector((state) => state.productsInterfuerza);

    const {
        pacientes_options_cotizacion,
        status_pacientes
    } = useSelector((state) => state.pacientes);
    const { warehouses, status_warehouses } = useSelector((state) => state.warehousesSlice);

    const navigate = useNavigate();

    const handleAbonoChange = (value) => {
        const numeric = value === null || value === undefined ? 0 : Number(value);
        if (isNaN(numeric)) return;
        // Actualiza el saldo usando el total actual del form
        const totalActual = Number(form.getFieldValue('Total')) || 0;
        updateSaldoPendiente(numeric, totalActual);
    };

    const currentBodega = warehouses.find(
        (w) => w.nombre === selectedBodega
    );

    const handleBodegaChange = (value) => {
        setSelectedBodega(value);
    };


    const handleTotalDiscountChange = (value) => {
        setTotalDiscount(value);

        const updatedLines = lines.map((line) => {
            const unidades = parseFloat(line.Unidades || 0);
            const precio = parseFloat(line.Precio_Unitario || 0);
            const discountFactor = value / 100;

            const subtotal = unidades * precio;
            const descuento = precio * unidades * discountFactor;
            const taxableAmount = subtotal - descuento;
            const impuesto = taxableAmount * TAX_RATE;
            const total = subtotal - descuento;

            return {
                ...line,
                DiscountFactor: discountFactor,
                Discount: descuento,
                TaxValue: impuesto.toFixed(2),
                subTotal: subtotal,
                Total: total.toFixed(2)
            };
        });

        setLines(updatedLines);
        calculateTotals(updatedLines);
    };

    useEffect(() => {
        dispatch(fetchPacientes({ page: 1, limit: 50000 }))
    }, []);

    useEffect(() => {
        dispatch(fetchExchangeRate());
        dispatch(fetchWareHouses({}))
        dispatch(fetchProductsInterfuerza({}))
    }, []);


    useEffect(() => {
        if (id) {
            dispatch(VerUnaQuote(id));
        }
    }, [id]);

    const updateSaldoPendiente = (abonoValue = null, totalValue = null) => {
        const abono = abonoValue !== null
            ? Number(abonoValue || 0)
            : (Number(form.getFieldValue('Abono')) || 0);

        const total = totalValue !== null
            ? Number(totalValue || 0)
            : (Number(form.getFieldValue('Total')) || 0);

        let saldo = total - abono;
        if (saldo < 0) saldo = 0;

        // Guardamos como número con 2 decimales
        const saldoFixed = Number(saldo.toFixed(2));
        const abonoFixed = Number(abono.toFixed(2));

        form.setFieldsValue({
            SaldoPendiente: saldoFixed,
            Abono: abonoFixed,
            Total: Number(total), // asegurar que Total sea number
        });

        setMaxAbono(Number(total));
    };


    useEffect(() => {
        if (exchangeRate || quote) {
            form.setFieldsValue({
                Vendedor: nombre || '',
                Currency_Rate: exchangeRate,
                Cliente: quote?.Cliente,
                Status: quote?.Status,
                Type: quote?.Type,
                Date: quote?.Date ? dayjs(quote.Date) : null,
                Expira: quote?.Expira ? dayjs(quote.Expira) : null,
                Bodega: quote?.Bodega,
                Vendedor: quote?.Vendedor,
                Reservar_Productos: quote?.Reservar_Productos === 'SI',
                Comentario: quote?.Comentario,
                Taxes: quote?.Taxes,
                SubTotal: quote?.SubTotal,
                Total: quote?.Total,
                Abono: quote?.Abono,
                Discount: quote?.Discount,
                SubTotalMenosDescuentos: quote?.SubTotal - quote?.Discount

            });

            if (quote?.lines && Array.isArray(quote.lines)) {
                setLines(quote.lines.map((line, index) => ({
                    key: index,
                    ...line
                })));
            }
        }
    }, [form, nombre, exchangeRate, quote]);


    const addLine = () => {
        setLines([
            ...lines,
            {
                key: Date.now(),
                Codigo: '',
                Descripcion: '',
                Item_Number: '',
                Nombre: '',
                Marca: '',
                Category_L1: '',
                Category_L2: '',
                Category_L3: '',
                Unidades: 0,
                Precio_Unitario: 0,
                Discount: 0,
                DiscountFactor: totalDiscount / 100 || 0,
                TaxID: '6',
                TaxName: 'ITBMS',
                TaxFactor: 0.07,
                TaxValue: 0,
                Total: 0,
            }
        ]);
    };

    const onFinish = async (values) => {

        console.log('entered onFinish with values:', values);
        const formattedValues = {
            ...values,
            Date: values.Date?.format('YYYY-MM-DD'),
            Expira: values.Expira?.format('YYYY-MM-DD'),
            Reservar_Productos: values.Reservar_Productos ? 'YES' : 'NO',
            Abono: String(values.Abono),
            Lines: currentBodega?.send_discount
                ? lines
                : lines.map((line) => ({
                    ...line,
                    Discount: 0,
                    DiscountFactor: 0,
                })),
        };

        console.log('Submitting updated quote with values:', formattedValues);
        try {
            Swal.fire({
                title: 'Guardando cotización...',
                text: 'Procesando datos en el sistema principal',
                icon: 'info',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            await dispatch(updateQuote({ id: id, data: formattedValues })).unwrap();

            Swal.close();

            await Swal.fire({
                icon: 'success',
                title: 'Cotización guardada correctamente',
                text: 'Se guardó en el sistema principal.',
                confirmButtonText: 'Continuar'
            });
        } catch (error) {
            console.error('Error en Laravel:', error);
            Swal.close();

            await Swal.fire({
                icon: 'error',
                title: 'Error al guardar en el sistema',
                text: error?.message || 'Ocurrió un error al guardar la cotización.',
                confirmButtonText: 'Entendido'
            });

            return;
        }

    };

    const removeLine = (index) => {
        const newLines = [...lines];
        newLines.splice(index, 1);
        setLines(newLines);

        calculateTotals(newLines);
    };

    const calculateTotals = (currentLines) => {
        console.log('Calculating totals with lines:', currentLines);

        const linesArray = currentLines || lines;

        // === SUBTOTAL POR LÍNEAS ===
        const subtotal = linesArray.reduce((sum, line) => {
            const valor = parseFloat(line.subTotal || 0);
            console.log(`subTotal línea [${line.id || 'new'}]:`, valor);
            return sum + valor;
        }, 0);
        console.log("SUBTOTAL (sumatoria subTotal):", subtotal);

        // === DESCUENTOS TOTAL ===
        const discount_total = linesArray.reduce((sum, line) => {
            const valor = parseFloat(line.Discount || 0);
            console.log(`Descuento línea [${line.id || 'new'}]:`, valor);
            return sum + valor;
        }, 0);
        console.log("DESCUENTO TOTAL:", discount_total);

        // === SUBTOTAL MENOS DESCUENTO ===
        const subTotalMenosDescuento = subtotal - discount_total;
        console.log("SUBTOTAL - DESCUENTOS:", subTotalMenosDescuento);

        // === IMPUESTO ===
        const impuesto_total = subTotalMenosDescuento * TAX_RATE;
        console.log("IMPUESTO TOTAL:", impuesto_total);

        // === TOTAL FINAL ===
        const totalNumber = Number((impuesto_total + subTotalMenosDescuento).toFixed(2));
        console.log("TOTAL FINAL:", totalNumber);

        form.setFieldsValue({
            Taxes: Number(impuesto_total.toFixed(2)),
            SubTotal: Number(subtotal.toFixed(2)),
            Discount: Number(discount_total.toFixed(2)),
            Total: totalNumber,
            SubTotalMenosDescuentos: Number(subTotalMenosDescuento.toFixed(2)),
        });

        // maxAbono y saldo pendiente
        setMaxAbono(totalNumber);

        // Actualizamos saldo pendiente respetando el Abono actual del formulario
        updateSaldoPendiente(null, totalNumber);

        console.log(linesArray);
    };


    const handleSelectProduct = (index, value) => {
        const selectedWrapper = productsInterfuerza.find(p => p.item_number === value);
        const selectedProduct = selectedWrapper;

        if (selectedProduct) {
            updateLine(index, 'Codigo', selectedProduct.codigo);
            updateLine(index, 'Item_Number', selectedProduct.item_number);
            updateLine(index, 'Nombre', selectedProduct.nombre || '');
            updateLine(index, 'Descripcion', selectedProduct.nombre || '');
            updateLine(index, 'Marca', selectedProduct.marca || '');
            updateLine(index, 'Precio_Unitario', parseFloat(selectedProduct.ultimo_costo_unidad) || 0);
            updateLine(index, 'Unidades', 1);
        }
    };


    const updateLine = (index, field, value) => {
        const newLines = [...lines];
        newLines[index][field] = value;

        const line = newLines[index];
        const unidades = parseFloat(line.Unidades || 0);
        const precio = parseFloat(line.Precio_Unitario || 0);
        const discountFactor = parseFloat(line.DiscountFactor || 0);

        if (['Unidades', 'Precio_Unitario', 'DiscountFactor'].includes(field)) {
            const subtotal = unidades * precio;
            const descuento = precio * unidades * discountFactor;


            const taxableAmount = subtotal - descuento;
            const impuesto = taxableAmount * TAX_RATE;
            const total = (precio * unidades) - descuento;

            newLines[index].Discount = descuento;
            newLines[index].TaxValue = impuesto.toFixed(2);
            newLines[index].subTotal = subtotal;
            newLines[index].Total = total.toFixed(2);
        }

        setLines(newLines);
        calculateTotals(newLines);

        if (field === 'DiscountFactor') {
            setTotalDiscount(0);
        }
    };

    const handleRowDiscountFocus = (index) => {
        setEditingRows(prev => ({ ...prev, [index]: true }));
        const current = lines[index]?.DiscountFactor;
        setTempRowDiscounts(prev => ({
            ...prev,
            [index]: current !== undefined && current !== null ? String(Number(current * 100)) : ''
        }));
    };

    const handleRowDiscountChange = (index, value) => {
        // Permitir escribir libremente, solo validar negativos
        if (value === null || value === undefined || value === '') {
            setTempRowDiscounts(prev => ({ ...prev, [index]: '' }));
            return;
        }
        const numeric = Number(value);
        if (isNaN(numeric)) {
            setTempRowDiscounts(prev => ({ ...prev, [index]: '' }));
            return;
        }

        if (numeric < 0) {
            setTempRowDiscounts(prev => ({ ...prev, [index]: '0' }));
        } else {
            // No limitar por máximo aquí, permitir escribir
            setTempRowDiscounts(prev => ({ ...prev, [index]: String(numeric) }));
        }
    };

    const handleRowDiscountBlur = (index, e) => {
        // Obtener el valor real del input DOM
        const inputValue = e.target.value;
        let normalized;

        if (inputValue === '' || inputValue == null) {
            normalized = 0;
        } else {
            const numericValue = Number(inputValue);
            if (isNaN(numericValue)) {
                normalized = 0;
            } else {
                normalized = numericValue;
                if (normalized < 0) normalized = 0;
                if (normalized > maxDiscount) normalized = maxDiscount;
            }
        }

        normalized = Number(normalized.toFixed(2));

        // actualizamos la línea usando tu updateLine (espera DiscountFactor en decimal 0..1)
        updateLine(index, 'DiscountFactor', normalized / 100);

        // sincronizamos estados temporales y salimos de edición
        setTempRowDiscounts(prev => ({ ...prev, [index]: String(normalized) }));
        setEditingRows(prev => ({ ...prev, [index]: false }));
    };



    const columns = [
        {
            title: 'Código',
            dataIndex: 'Item_Number',
            key: 'Item_Number',
            width: "100px",
            render: (text, record, index) => {
                return (
                    <Select
                        showSearch
                        style={{ width: '100px' }}
                        value={record.Item_Number}
                        placeholder="Selecciona un producto"
                        optionFilterProp="children"
                        title={record.Item_Number}
                        onChange={(value) => {
                            console.log('Seleccionado:', value);
                            handleSelectProduct(index, value)
                        }}
                        filterOption={(input, option) => {
                            const normalizedInput = input.toLowerCase().trim();
                            const normalizedLabel = (option?.children ?? '').toString().toLowerCase();
                            return normalizedLabel.includes(normalizedInput);
                        }}
                    >
                        {
                            productsInterfuerza.map((item) => (
                                <Option
                                    key={item?.id} value={item?.item_number}>
                                    {item?.item_number}
                                </Option>
                            ))
                        }
                    </Select >
                )
            }
        },
        {
            title: 'Nombre',
            dataIndex: 'Nombre',
            key: 'Nombre',
            width: "150px",
            render: (text, record, index) => (
                <Select
                    showSearch
                    style={{ width: '150px', color: 'black' }}
                    placeholder="Selecciona un producto"
                    value={record.Nombre}
                    optionFilterProp="children"
                    title={record.Nombre}
                    onChange={(value) => {
                        handleSelectProduct(index, value)
                    }}
                    filterOption={(input, option) => {
                        const normalizedInput = input.toLowerCase().trim();
                        const normalizedLabel = (option?.children ?? '').toString().toLowerCase();
                        return normalizedLabel.includes(normalizedInput);
                    }}
                >
                    {
                        productsInterfuerza.map((item) => (
                            <Option
                                key={item?.id} value={item?.item_number}>
                                {item?.nombre}
                            </Option>
                        ))
                    }
                </Select>
            )
        },
        {
            title: 'Unidades',
            dataIndex: 'Unidades',
            key: 'Unidades',
            render: (text, record, index) => (
                <InputNumber
                    style={{ width: '100%', color: 'black' }}
                    value={text}
                    onChange={(value) => updateLine(index, 'Unidades', value)}
                    precision={2}
                    min={0}
                    title={parseFloat(text)}
                />
            )
        },
        {
            title: 'P. Unitario',
            dataIndex: 'Precio_Unitario',
            key: 'Precio_Unitario',
            render: (text, record, index) => (
                <InputNumber
                    style={{ width: '100%', color: 'black' }}
                    value={text}
                    onChange={(value) => updateLine(index, 'Precio_Unitario', value)}
                    precision={2}
                    min={0}
                    title={parseFloat(text)}
                />
            )
        },

        {
            title: 'SubTotal',
            dataIndex: 'SubTotal',
            key: 'SubTotal',
            render: (text, record) => (
                <InputNumber
                    value={parseFloat(record.subTotal)}
                    disabled
                    precision={2}
                    style={{ width: '100%', color: 'black' }}
                    title={parseFloat(record.subTotal)}
                    onClick={() => console.log(record)}
                />
            )
        },

        {
            title: '% Descuento',
            dataIndex: 'DiscountFactor',
            key: 'DiscountFactor',
            render: (text, record, index) => {
                const parsed = parseFloat(text || 0);
                const displayValue = !isNaN(parsed) ? Number((parsed * 100).toFixed(2)) : null;
                return (
                    <InputNumber
                        style={{ width: '100%' }}
                        value={
                            editingRows[index]
                                ? (tempRowDiscounts[index] === '' ? null : Number(tempRowDiscounts[index]))
                                : (displayValue !== null ? displayValue : null)
                        }
                        onFocus={() => handleRowDiscountFocus(index)}
                        onChange={(value) => handleRowDiscountChange(index, value)}
                        onBlur={(e) => handleRowDiscountBlur(index, e)} // Pasar el evento aquí
                        min={0}
                        max={maxDiscount}
                        precision={2}
                        formatter={(value) => {
                            // Solo mostrar "%" cuando NO estamos editando
                            if (editingRows[index] || value === '' || value == null) return value;
                            return `${Number(value).toFixed(2)}%`;
                        }}
                        parser={(value) => (value ? value.toString().replace('%', '') : '')}
                        placeholder='0.00%'
                    />
                );
            }
        },
        {
            title: 'Descuento ($)',
            dataIndex: 'Discount',
            key: 'Discount',
            render: (text) => (
                <InputNumber
                    style={{ width: '100%', color: 'black' }}
                    value={parseFloat(text)}
                    precision={2}

                    title={parseFloat(text)}
                />
            )
        },
        {
            title: 'Total',
            dataIndex: 'Total',
            key: 'Total',
            render: (text) => (
                <InputNumber
                    style={{ width: '100%', color: 'black' }}
                    value={parseFloat(text)}

                    precision={2}
                    title={parseFloat(text)}
                />
            )
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record, index) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeLine(index)}
                />
            )
        }
    ];

    return (
        <Card title={<Title level={2}>Cotizaciones</Title>}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Row gutter={16}>
                    <Col span={6}>
                        {/* <Button
                            onClick={() => {
                                console.log('Clicked', quote);
                                console.log('lines', lines);
                            }}>

                        </Button> */}
                        <Form.Item
                            name="Cliente"
                            label="Cliente"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <Select
                                placeholder="Seleccione un cliente"
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    const searchTerms = input.toLowerCase().split(' ');
                                    return searchTerms.every(term =>
                                        (option?.label ?? '').toLowerCase().includes(term)
                                    );
                                }}
                                options={pacientes_options_cotizacion}
                                notFoundContent={status_pacientes === 'loading' ? <Spin size="small" /> : null}
                                style={{ color: 'black !important' }}
                            >
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item
                            name="Status"
                            label="Estado"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <Select>
                                <Option value="ACTIVE">ACTIVO</Option>
                                <Option value="BILLED">FACTURADA</Option>
                                <Option value="APROVED">APROVADA</Option>
                                <Option value="EXPIRED">EXPIRADA</Option>
                                <Option value="CANCELLED">CANCELADA</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="Type"
                            label="Tipo"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <Select>
                                <Option value="SALES-TEAM">EQUIPO DE VENTAS</Option>
                                <Option value="CUSTOMER">CLIENTE</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="Vendedor"
                            label="Vendedor"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <Input
                                disabled
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            name="Date"
                            label="Fecha Inicio"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }} format="YYYY-MM-DD"
                                onChange={(date) => {
                                    if (date) {
                                        const expirationDate = dayjs(date).add(30, 'day');
                                        form.setFieldsValue({
                                            Expira: expirationDate,
                                        });
                                    } else {
                                        form.setFieldsValue({ Expira: null });
                                    }
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="Expira"
                            label="Fecha de Expiración"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="Bodega"
                            label="Bodega"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <Select
                                placeholder="Seleccione una Bodega"
                                showSearch
                                optionFilterProp='children'
                                loading={status_warehouses === 'loading'}
                                disabled={status_warehouses === 'loading'}

                            >
                                {warehouses?.map((wareHouse) => (
                                    <Option key={wareHouse.nombre} value={wareHouse.nombre}>
                                        {wareHouse.nombre}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="Vendedor"
                            label="Vendedor"
                            initialValue="USD"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            name="Currency"
                            label="Moneda"
                            initialValue="USD"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="Currency_Rate"
                            label="Tasa de Cambio"
                            rules={[{ required: true, message: 'Campo requerido' }]}
                        >
                            <InputNumber style={{ width: '100%' }} precision={9} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="Reservar_Productos"
                            label="Reservar Productos"
                            valuePropName="checked"
                        >
                            <Switch

                                checkedChildren="SI" unCheckedChildren="NO"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="Comentario"
                    label="Comentario"
                >
                    <Input.TextArea
                        rows={4}
                    />
                </Form.Item>

                <Divider>Líneas de Factura</Divider>

                <Row style={{ marginBottom: 16 }} justify={'space-between'}>
                    <Col style={{ display: 'flex', flexDirection: 'row', alignItems: 'end' }}>
                        <Button
                            type="dashed"
                            onClick={addLine}
                            icon={<PlusOutlined />}
                        >
                            Agregar Línea
                        </Button>
                    </Col>
                    <Col>
                        <Row gutter={[16, 16]}>
                            <Col style={{ display: 'flex', flexDirection: 'column' }} sm={12} xs={12}>
                                <label style={{ paddingBottom: 8, margin: '0 0 0 0', fontWeight: "500", fontSize: '14px', fontFamily: 'Segoe UI' }}>
                                    Aplicar Descuento Total:
                                </label>

                                {/* <InputNumber
                               value={totalDiscount}
                               min={0}
                               max={maxDiscount}
                               precision={2}
                               // formatter={(value) => `${Number(value).toFixed(2)}%`}
                               // parser={(value) => value.replace('%', '')}
                               step={0.5}
                               onChange={handleTotalDiscountChange}
                               addonAfter="%"
                             /> */}

                                <InputNumber
                                    // Mientras editas mostramos tempDiscount; fuera de edición mostramos totalDiscount
                                    value={
                                        isEditing
                                            ? (tempDiscount === '' ? null : Number(tempDiscount))
                                            : (totalDiscount === '' ? null : Number(totalDiscount))
                                    }
                                    min={0}
                                    max={maxDiscount}
                                    precision={2}
                                    // Solo aplicamos formato con % cuando NO estamos editando
                                    formatter={(value) => {
                                        if (isEditing || value === '' || value == null) return value;
                                        return `${Number(value).toFixed(2)}%`;
                                    }}
                                    parser={(value) => (value ? value.toString().replace('%', '') : '')}
                                    onFocus={() => {
                                        setIsEditing(true);
                                        // al abrir el input ponemos el valor actual en temp para editar
                                        setTempDiscount(
                                            totalDiscount !== null && totalDiscount !== undefined
                                                ? String(totalDiscount)
                                                : ''
                                        );
                                    }}
                                    onChange={(value) => {
                                        // Permitir escribir cualquier valor durante la edición
                                        if (value === null || value === undefined || value === '') {
                                            setTempDiscount('');
                                            return;
                                        }
                                        const numeric = Number(value);
                                        if (isNaN(numeric)) {
                                            setTempDiscount('');
                                            return;
                                        }

                                        // Solo validar que no sea negativo, pero permitir exceder máximo temporalmente
                                        if (numeric < 0) {
                                            setTempDiscount('0');
                                        } else {
                                            // Guardar el valor tal como viene, sin limitar por maxDiscount
                                            setTempDiscount(String(Number(numeric.toFixed(2))));
                                        }
                                    }}

                                    onBlur={(e) => {
                                        // Obtener el valor real del input DOM
                                        const inputValue = e.target.value;
                                        let normalized;

                                        if (inputValue === '' || inputValue == null) {
                                            normalized = 0;
                                        } else {
                                            const numericValue = Number(inputValue);
                                            if (isNaN(numericValue)) {
                                                normalized = 0;
                                            } else {
                                                normalized = numericValue;
                                                if (normalized < 0) normalized = 0;
                                                if (normalized > maxDiscount) normalized = maxDiscount;
                                            }
                                        }

                                        normalized = Number(normalized.toFixed(2));
                                        setTotalDiscount(normalized);
                                        setTempDiscount(String(normalized));
                                        handleTotalDiscountChange(normalized);
                                        setIsEditing(false);
                                    }}
                                    placeholder="0.00%"
                                    style={{ width: '100%' }}
                                />

                            </Col>

                            <Col style={{ display: 'flex', flexDirection: 'column' }} sm={12} xs={12}>
                                <Form.Item name="Abono" label="Abono:" style={{ marginBottom: 5, fontWeight: "bold", fontSize: '12px' }}>
                                    <InputNumber
                                        precision={2}
                                        min={0}
                                        max={maxAbono}
                                        style={{ width: '100%' }}
                                        onChange={handleAbonoChange}
                                    />
                                </Form.Item>
                            </Col>

                        </Row>
                    </Col>
                </Row>



                <Table
                    columns={columns}
                    dataSource={lines.map((line, index) => ({ ...line, key: index }))}
                    pagination={false}
                    bordered
                    size="small"
                />

                <Divider />

                <Row>
                    <Col xxl={14} xl={14} md={14}></Col>
                    <Col xxl={10} xl={10} md={10}>
                        <Row gutter={16}>
                            <Col xxl={12} xl={12} md={12}>
                                SubTotal
                            </Col>
                            <Col xxl={12} xl={12} md={12} style={{ textAlignLast: 'right' }}>
                                <Form.Item
                                    name="SubTotal"
                                // label="Subtotal"
                                >
                                    <InputNumber
                                        style={{ width: '100%', color: 'black', textAlign: 'right' }}

                                        precision={2}
                                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/*  */}

                        <Row gutter={16}>
                            <Col xxl={12} xl={12} md={12}>
                                Descuento Total
                            </Col>
                            <Col xxl={12} xl={12} md={12} style={{ textAlignLast: 'right' }}>
                                <Form.Item
                                    name="Discount"
                                // label="Discount"
                                >
                                    <InputNumber
                                        style={{ width: '100%', color: 'black', textAlign: 'right' }}

                                        precision={2}
                                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xxl={12} xl={12} md={12}>
                                Subtotal menos descuento
                            </Col>
                            <Col xxl={12} xl={12} md={12} style={{ textAlignLast: 'right' }}>
                                <Form.Item
                                    name="SubTotalMenosDescuentos"
                                // label="SubTotalMenosDescuentos"
                                >
                                    <InputNumber
                                        style={{ width: '100%', color: 'black', textAlign: 'right' }}

                                        precision={2}
                                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/*  */}

                        <Row gutter={16}>
                            <Col xxl={12} xl={12} md={12}>
                                Impuesto
                            </Col>
                            <Col xxl={12} xl={12} md={12} style={{ textAlignLast: 'right' }}>
                                <Form.Item
                                    name="Taxes"
                                // label="Impuesto"
                                >
                                    <InputNumber
                                        style={{ width: '100%', color: 'black', textAlign: 'right' }}

                                        precision={2}
                                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xxl={12} xl={12} md={12}>
                                Total
                            </Col>
                            <Col xxl={12} xl={12} md={12} style={{ textAlignLast: 'right' }}>
                                <Form.Item
                                    name="Total"
                                // label="Total"
                                >
                                    <InputNumber
                                        style={{ width: '100%', color: 'black', textAlign: 'right' }}

                                        precision={2}
                                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xxl={12} xl={12} md={12}>
                                Abono
                            </Col>
                            <Col xxl={12} xl={12} md={12} style={{ textAlignLast: 'right' }}>
                                <Form.Item
                                    name="Abono"
                                    // label="Abono"
                                    layout="horizontal"
                                >
                                    <InputNumber
                                        style={{ width: '100%', color: 'black', textAlign: 'right' }}
                                        disabled
                                        max={maxAbono}
                                        precision={2}
                                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>


                        <Row gutter={16}>
                            <Col xxl={12} xl={12} md={12}>
                                Saldo pendiente
                            </Col>
                            <Col xxl={12} xl={12} md={12} style={{ textAlignLast: 'right' }}>
                                <Form.Item
                                    name="SaldoPendiente"
                                    // label="Abono"
                                    layout="horizontal"
                                >
                                    <InputNumber
                                        style={{ width: '100%', color: 'black', textAlign: 'right' }}
                                        disabled
                                        precision={2}
                                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>


                    </Col>
                </Row>

                <Form.Item>
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"

                        >
                            Guardar Cotización
                        </Button>
                        <Button
                        // onClick={() => navigate('/table-cotizaciones')}
                        >
                            Cancelar
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default UpdateCotizacion;
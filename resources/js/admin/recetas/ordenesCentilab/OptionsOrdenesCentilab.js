import { AutoComplete, Button, Col, Row, Select } from "antd"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSucursales } from "../../../redux/features/sucursales/sucursalesSlice";
import { fetchProveedorMaterial } from "../../../redux/features/proveedor-material/proveedorMaterialSlice";
import { fetchCristales } from "../../../redux/features/cristales/cristalesSlice";
import DateRangePicker from "../../reportes/DateRangePicker";
import { EyeOutlined, FilePdfOutlined, EditOutlined, CloseOutlined, CheckOutlined } from "@ant-design/icons";
import DateRangePickerCentilab from "./DatePickerCentilab";
import { setSearch, setStatusLoading } from "../../../redux/features/ordenes/ordenesCentilab/ordenesCentilabSlice";
import { fetchTotalUsuariosDoctor } from "../../../redux/features/usuarios/usuariosDoctorSlice";
import { fetchUsuarios } from "../../../redux/features/usuarios/usuariosSlice";

const { Option } = Select;

const OptionsOrdenesCentilab = ({
    sucursalFilter,
    doctorFilter,
    setSucursalFilter,
    setDoctorFilter,
    setFechaRange
}) => {
    const dispatch = useDispatch();
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const {
        sucursales_option_selects
    } = useSelector((state) => state.sucursales);
    
    const {
        usuarios_doctores_options_selecteds
    } = useSelector((state) => state.usuarios);

    useEffect(() => {
        dispatch(fetchSucursales({}))
    }, [])

    useEffect(() => {
        dispatch(fetchUsuarios({}))
    }, [])

    useEffect(() => {
        if (debouncedSearch === '') {
            dispatch(setSearch(''));
            return;
        }

        const timeoutId = setTimeout(() => {
            dispatch(setSearch(debouncedSearch));
        }, 1250);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [debouncedSearch, dispatch]);

    const handleSucursalChange = (value) => {
        setSucursalFilter(value);
    };

    const handleDoctorChange = (value) => {
        setDoctorFilter(value);
    };

    const handleDateChange = (start, end) => {
        dispatch(setFechaRange({ startDate: start, endDate: end }));
    };

    const handleSearchChange = (value) => {
        dispatch(setStatusLoading());
        setDebouncedSearch(value);
    };


    return (
        <div style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
                <Col
                    xxl={6}
                    xl={6}
                    lg={8}
                    md={12}
                    sm={24}
                    xs={24}
                >
                    <div>
                        <label className="mb-2 font-weight-bold d-block">
                            Sucursal:
                        </label>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Seleccione la sucursal"
                            onChange={handleSucursalChange}
                            value={sucursalFilter}
                            allowClear
                        >
                            {sucursales_option_selects.map((sucursal) => (
                                <Option key={sucursal.value} value={sucursal.value}>
                                    {sucursal.label}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </Col>

                <Col
                    xxl={6}
                    xl={6}
                    lg={8}
                    md={12}
                    sm={24}
                    xs={24}
                >
                    <div>
                        <label className="mb-2 font-weight-bold d-block">
                            Doctor:
                        </label>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Seleccione el doctor"
                            onChange={handleDoctorChange}
                            value={doctorFilter}
                            allowClear
                        >
                            {usuarios_doctores_options_selecteds.map((doctor) => (
                                <Option key={doctor.value} value={doctor.label}>
                                    {doctor.label}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </Col>

                <Col
                    xxl={6}
                    xl={6}
                    lg={8}
                    md={12}
                    sm={24}
                    xs={24}
                >
                    <div>
                        <label className="mb-2 font-weight-bold d-block">
                            Buscar por Fecha:
                        </label>
                        <DateRangePickerCentilab
                            onChange={handleDateChange}
                            skipReset={true}
                            onReset={() => {
                                dispatch(setFechaRange({ startDate: '', endDate: '' }));
                            }}
                        />
                    </div>
                </Col>

                <Col
                    xxl={6}
                    xl={6}
                    lg={8}
                    md={12}
                    sm={24}
                    xs={24}
                >
                    <div>
                        <label className="mb-2 font-weight-bold d-block">
                            Buscar:
                        </label>
                        <AutoComplete
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Buscar"
                            value={debouncedSearch}
                            onChange={handleSearchChange}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default OptionsOrdenesCentilab;
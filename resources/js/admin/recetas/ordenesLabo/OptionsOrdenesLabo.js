import { Col, Row, Select } from "antd"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSucursales } from "../../../redux/features/sucursales/sucursalesSlice";
import { fetchProveedorMaterial } from "../../../redux/features/proveedor-material/proveedorMaterialSlice";
import { fetchCristales } from "../../../redux/features/cristales/cristalesSlice";

const OptionsOrdenesLabo = ({
  laboratorioFilter,
  sucursalFilter,
  lenteContactoFilter,
  statusFilter,
  faseFilter,
  proveedorFilter,
  setLaboratorioFilter,
  setSucursalFilter,
  setLenteContactoFilter,
  setStatusFilter,
  setFaseFilter,
  setProveedorFilter,
  setServiciosFiltrados,
  serviciosFiltrados
}) => {
  const dispatch = useDispatch();
  const laboratorio = useSelector((state) => state.fasesOrdenes.laboratorio);
  const [currentPage, setCurrentPage] = useState(1);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);

  const { cristales_options_selecteds } = useSelector((state) => state.cristales)

  const {
    sucursales_option_selects
  } = useSelector((state) => state.sucursales);

  const {
    proveedor_material_options_selecteds
  } = useSelector((state) => state.proveedorMaterial);

  const handleLaboratorioChange = (value) => {
    setLaboratorioFilter(value);
  };

  useEffect(() => {
    dispatch(fetchSucursales({}))
    dispatch(fetchCristales({}))
  }, [])

  useEffect(() => {
    dispatch(fetchProveedorMaterial({}))
  }, [])


  const handleSucursalChange = (value) => {
    setSucursalFilter(value);
  };

  const handleFaseChange = (value) => {
    setFaseFilter(value);
  };


  const handleLenteContactoChange = (value) => {
    setLenteContactoFilter(value);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const handleProveedorChange = (value) => {
    setProveedorFilter(value);
  };

  const handleSelectChangeCristales = (value, option) => {
    const cristales = option.map(op => op.label)
    setServiciosFiltrados(cristales)
    setServiciosSeleccionados(value)
    // setServiciosFiltrados(value)
  };

  return (
    <div style={{ width: '65%' }}>
      {/* <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}
      > */}
      <Row gutter={[16, 16]}>
        <Col xxl={6} xl={6} md={6}>
          <div>
            <div className="mb-4">
              <label className="mb-2 font-weight-bold d-block">
                {"Tipo Cristal:"}
              </label>
              <Select
                mode="multiple"
                placeholder="por Laboratorio"
                showSearch
                value={serviciosSeleccionados}
                style={{
                  width: '100%'
                }}
                optionFilterProp="label"
                onChange={handleSelectChangeCristales}
                options={cristales_options_selecteds.map(servicio => ({
                  value: servicio.value,
                  label: servicio.label
                }))}
              >
              </Select>
            </div>
          </div>

        </Col>
        <Col xxl={4} xl={4} md={4}>
          <div>
            <div className="mb-4">
              <label className="mb-2 font-weight-bold d-block">
                {"Laboratorio:"}
              </label>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="por Laboratorio"
                onChange={handleLaboratorioChange}
                value={laboratorioFilter}
                allowClear
              >
                <Select.Option value="Ping">Ping</Select.Option>
                <Select.Option value="Centilab">Centilab</Select.Option>
                <Select.Option value="Optilab">Optilab</Select.Option>
                <Select.Option value="Vista Pro">Vista Pro</Select.Option>
                <Select.Option value="Haseth J&J">Haseth J&J</Select.Option>
                <Select.Option value="Alcon">Alcon</Select.Option>
                <Select.Option value="B+L">B+L</Select.Option>
              </Select>
            </div>

            <div className="mb-4">
              <label className="mb-2 font-weight-bold d-block">
                {"Tipo de lente:"}
              </label>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Selecciona el tipo de lente"
                onChange={handleLenteContactoChange}
                value={lenteContactoFilter}
                allowClear
              >
                <Select.Option value="1">
                  <div style={{ width: '30px', height: '30px' }}>
                    <img
                      src="assets/img/recetas/lentesdecontacto.png"
                      alt="Lente On"
                      style={{ width: '50%', height: '50%' }}
                    />
                  </div>
                </Select.Option>
                <Select.Option value="0">
                  <div style={{ width: '30px', height: '30px' }}>
                    <img
                      src="assets/img/recetas/lentenormal.png"
                      alt="Lente Off"
                      style={{ width: '50%', height: '50%' }}
                    />
                  </div>
                </Select.Option>
              </Select>
            </div>

          </div>
        </Col>

        <Col xxl={6} xl={6} md={6}>
          <div>
            <div className="mb-4">
              <label className="mb-2 font-weight-bold d-block">
                {"Fase:"}
              </label>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="por Fase"
                onChange={handleFaseChange}
                value={faseFilter}
                allowClear
              >
                <Select.Option value="Nuevo">Nuevo</Select.Option>
                <Select.Option value="Nuevo">Enviado</Select.Option>
                <Select.Option value="Listo">Listo</Select.Option>
                <Select.Option value="En Confección">En confeccion</Select.Option>
                <Select.Option value="Retirado">Retirado</Select.Option>
              </Select>
            </div>
            <div>
              <label className="mb-2 font-weight-bold d-block">
                {"Status:"}
              </label>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="por Status"
                onChange={handleStatusChange}
                value={statusFilter}
                allowClear
              >
                <Select.Option value="OK">OK</Select.Option>
                <Select.Option value="Advertencia">Advertencia</Select.Option>
                <Select.Option value="Crítico">Crítico</Select.Option>
                <Select.Option value="Completado">Completado</Select.Option>
              </Select>
            </div>
          </div>
        </Col>
        <Col xxl={8} xl={8} md={8}>
          <div>
            <div className="mb-4">
              <label className="mb-2 font-weight-bold d-block">
                {"Sucursal:"}
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

            <div>
              <label className="mb-2 font-weight-bold d-block">
                {"Proveedor:"}
              </label>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Seleccione estado de pago"
                onChange={handleProveedorChange}
                value={proveedorFilter}
                allowClear
              >
                {proveedor_material_options_selecteds.map((proveedor) => (
                  <Option key={proveedor.value} value={proveedor.label}>
                    {proveedor.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </Col>
      </Row>
      {/* </div> */}
    </div>
  )
}

export default OptionsOrdenesLabo;
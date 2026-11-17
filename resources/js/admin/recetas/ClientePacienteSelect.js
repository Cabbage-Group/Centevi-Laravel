import React, { useCallback, useMemo, useRef } from 'react';
import { Select } from 'antd';
import { ErrorMessage } from 'formik';

const TIPOS_CLIENTE = ['cliente', 'cliente/paciente'];
const TIPOS_PACIENTE = ['paciente', 'cliente/paciente'];

export const esCliente = (opcion) => !!opcion && TIPOS_CLIENTE.includes(opcion.tipo_registro);
export const esPaciente = (opcion) => !!opcion && TIPOS_PACIENTE.includes(opcion.tipo_registro);

// Sucursales que trabajan con cotización de Interfuerza: solo ellas manejan cliente y paciente por separado
const SUCURSALES_CON_COTIZACION = ['paitilla', 'villa lucre', 'san judas tadeo', 'dorado'];

export const esSucursalConCotizacion = (sucursales = [], idSucursal) => {
  const sucursal = sucursales.find((s) => Number(s.id_sucursal) === Number(idSucursal));
  const nombre = sucursal?.nombre?.toLowerCase() ?? '';
  return SUCURSALES_CON_COTIZACION.some((n) => nombre.includes(n));
};

/**
 * Sincroniza cliente y paciente:
 * - El primer campo que se mueve manda: mientras se siga cambiando ese campo, el otro lo copia.
 * - En cuanto se cambia el otro campo, ambos quedan independientes.
 */
export const useSyncClientePaciente = () => {
  const origen = useRef(null); // null | 'cliente' | 'paciente' | 'libre'

  const inicializar = useCallback((idCliente, idPaciente) => {
    origen.current = idCliente && idPaciente && Number(idCliente) !== Number(idPaciente) ? 'libre' : null;
  }, []);

  const debeSincronizar = useCallback((campo) => {
    if (origen.current === null || origen.current === campo) {
      origen.current = campo;
      return true;
    }
    origen.current = 'libre';
    return false;
  }, []);

  return { inicializar, debeSincronizar };
};

const filtrar = (input, option) =>
  input.toLowerCase().split(' ').every((t) => (option?.label ?? '').toLowerCase().includes(t));

const labelStyle = { fontSize: 12, marginBottom: 2 };
const selectStyle = { width: '100%', fontSize: 12, color: 'black' };
const popupStyles = { popup: { root: { fontSize: 12 } } };

const ClientePacienteSelect = ({
  options = [],
  cliente,
  paciente,
  onClienteChange,
  onPacienteChange,
  disabled = false,
  loading = false,
  mostrarCliente = true,
  className = 'form-group col-md-4',
}) => {
  const opcionesClientes = useMemo(() => options.filter(esCliente), [options]);
  const opcionesPacientes = useMemo(() => options.filter(esPaciente), [options]);
  const hayOpciones = options.length > 0;

  // Sin cliente: solo el selector de pacientes, del mismo tamaño que el de sucursal
  if (!mostrarCliente) {
    return (
      <div className={className}>
        <label htmlFor="pacientes">Pacientes*</label>
        <Select
          id="pacientes"
          size="large"
          showSearch
          value={hayOpciones ? paciente || undefined : undefined}
          onChange={onPacienteChange}
          placeholder="Seleccione el paciente"
          loading={loading}
          disabled={disabled || loading}
          filterOption={filtrar}
          options={opcionesPacientes}
          style={{ width: '100%', height: 48, color: 'black' }}
        />
        <ErrorMessage name="id_paciente" component="div" className="text-danger" />
      </div>
    );
  }

  return (
    <div className={className}>
      <label htmlFor="clientes" style={labelStyle}>Cliente</label>
      <Select
        id="clientes"
        size="small"
        showSearch
        value={hayOpciones ? cliente || undefined : undefined}
        onChange={onClienteChange}
        placeholder="Seleccione el cliente"
        loading={loading}
        disabled={disabled || loading}
        filterOption={filtrar}
        options={opcionesClientes}
        style={{ ...selectStyle, marginBottom: 6 }}
        styles={popupStyles}
      />

      <label htmlFor="pacientes" style={labelStyle}>Pacientes*</label>
      <Select
        id="pacientes"
        size="small"
        showSearch
        value={hayOpciones ? paciente || undefined : undefined}
        onChange={onPacienteChange}
        placeholder="Seleccione el paciente"
        loading={loading}
        disabled={disabled || loading}
        filterOption={filtrar}
        options={opcionesPacientes}
        style={selectStyle}
        styles={popupStyles}
      />

      <ErrorMessage name="id_paciente" component="div" className="text-danger" />
    </div>
  );
};

export default ClientePacienteSelect;

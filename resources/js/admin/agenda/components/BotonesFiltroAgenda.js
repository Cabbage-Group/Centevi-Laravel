import React from 'react';
import { setCurrentTypeAgenda } from '../../../redux/features/citas/CitasAgendaSlice';
import { useDispatch } from 'react-redux';

const estilos_btn_seleccionado = {
  paddingBottom: '5px',
  paddingTop: '5px',
  paddingLeft: '15px',
  paddingRight: '15px',
  background: '#3BAEA3',
  color: 'white',
  textAlign: 'center',
  borderRadius: '8px',
  marginLeft: '10px',
  cursor: 'pointer'
};

const estilos_btn = {
  paddingBottom: '5px',
  paddingTop: '5px',
  paddingLeft: '15px',
  paddingRight: '15px',
  textAlign: 'center',
  borderRadius: '8px',
  marginLeft: '10px',
  border: '.5px solid #889CCC',
  cursor: 'pointer'
};

const BotonesFiltroAgenda = ({ lista_botones, selectedIndex, setSelectedIndex }) => {
  const dispatch = useDispatch();

  const toggleSelection = (i) => {
    let updatedSelections;

    if (selectedIndex.includes(i)) {
      updatedSelections = selectedIndex.filter(index => index !== i);
    } else {
      updatedSelections = [...selectedIndex, i];
    }

    setSelectedIndex(updatedSelections);
    dispatch(setCurrentTypeAgenda(updatedSelections));
  };

  return (
    <div
      style={{
        position: 'absolute',
        right: '15px',
        top: '15px',
        display: 'flex'
      }}
    >
      {lista_botones.map((boton, i) => (
        <div
          key={i}
          style={selectedIndex.includes(i) ? estilos_btn_seleccionado : estilos_btn}
          onClick={() => toggleSelection(i)}
        >
          {boton}
        </div>
      ))}
    </div>
  );
};

export default BotonesFiltroAgenda;

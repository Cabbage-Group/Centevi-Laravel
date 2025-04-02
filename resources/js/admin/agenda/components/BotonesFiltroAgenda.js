import React, { useState } from 'react'
import { setCurrentTypeAgenda } from '../../../redux/features/citas/CitasAgendaSlice'
import { useDispatch } from 'react-redux'

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
}

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
}

const BotonesFiltroAgenda = (props) => {
  const dispatch = useDispatch();
  const {
    lista_botones,
    setSelectedIndex
  } = props

  const [index, setIndex] = useState(0)
  return (

    <div
      style={{
        position: 'absolute',
        right: '15px',
        top: '15px',
        display: 'flex'
      }}
      onClick={() => console.log(lista_botones)}
    >
      {
        lista_botones.map((boton, i) => {
          return (
            <div
              key={i}
              style={index === i ? estilos_btn_seleccionado : estilos_btn}
              onClick={() => {
                console.log('Cambiando a:', i);
                setIndex(i);
                setSelectedIndex(i);
                dispatch(setCurrentTypeAgenda(i))
              }}
            >
              {boton}
            </div>
          )
        })
      }
    </div>
  )
}

export default BotonesFiltroAgenda
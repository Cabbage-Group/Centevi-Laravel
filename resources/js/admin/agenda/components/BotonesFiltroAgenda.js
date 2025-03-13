import React, { useState } from 'react'

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

  const {
    lista_botones
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
              style={
                index == i
                  ? estilos_btn_seleccionado
                  : estilos_btn
              }
              onClick={() => setIndex(i)}
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
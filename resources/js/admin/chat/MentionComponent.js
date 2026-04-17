import React, { useEffect, useState } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import API from '../../config/config';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMentionUsers } from '../../redux/features/pacientes/pacientesSlice';
import { fetchOrdenesMenciones } from '../../redux/features/ordenes/ordenesSlice';
import { fetchUsuarios } from '../../redux/features/usuarios/usuariosSlice';

function MentionComponent() {
    const dispatch = useDispatch();
    const [value, setValue] = useState('');
    const [allMenciones, setAllMenciones] = useState();
    const [ordenes_menciones, setOrdenesMeciones] = useState();

    const users = useSelector((state) => state.pacientes.users);
    console.log('ordenes_menciones', ordenes_menciones)

    const {
        doctores_menciones
    } = useSelector((state) => state.usuarios);


    useEffect(() => {
        dispatch(fetchUsuarios({}))
    }, [])


    const fetchData = async (search, callback) => {
        try {
            const response = await dispatch(fetchMentionUsers(search));
            const data = response.payload;

            const allMenciones = [
                ...doctores_menciones.map((doc) => ({
                    id: doc.id.toString(),
                    display: doc.display,
                    type: "doctor",
                })),
                ...data.map((pac) => ({
                    id: pac.id.toString(),
                    display: pac.display,
                    type: "paciente",
                }))
            ]
            callback(allMenciones);
            setAllMenciones(allMenciones)
        } catch (error) {
            console.error('Error al buscar usuarios:', error);
            callback([]);
        }
    };

    const fetchDataNroOrden = async (search, callback) => {
        try {
            console.log('Término de búsqueda recibido:', search);
            const response = await dispatch(fetchOrdenesMenciones(search));
            const data = response.payload;
            setOrdenesMeciones(data)
            callback(data); // importante: react-mentions necesita esto
        } catch (error) {
            console.error('Error al buscar nro orden:', error);
            callback([]);
        }
    };

    const handleChange = (event, newValue, newPlainTextValue, mentions) => {
        setValue(newValue);
        console.log('Valor actual:', newValue);
        console.log('Menciones:', mentions);
    };

    return (
        <div className="mention-component">
            <MentionsInput
                value={value}
                onChange={handleChange}
                allowSpaceInQuery={true}
                placeholder="Escribe @ para mencionar a alguien o # para una orden"
                className="mentions-input"
                a11ySuggestionsListLabel="Usuarios sugeridos"
            >
                <Mention
                    trigger="@"
                    data={fetchData}
                    displayTransform={(id, display) => {
                        const mention = allMenciones.find((item) => item.id === id);
                        const icon = mention?.type === "doctor" ? "🧑‍⚕" : "🏥";
                        return `@${display} ${icon}`;
                    }}
                    renderSuggestion={(suggestion) => (
                        <div style={{ padding: "5px", cursor: "pointer" }}>
                            {suggestion.display} {suggestion.type === 'doctor' ? '🧑‍⚕️' : '🏥'}
                        </div>
                    )}
                    style={{ backgroundColor: '#cceeff' }}
                />
                <Mention
                    trigger="#"
                    data={fetchDataNroOrden}
                    markup="#[__display__](__id__)"
                    displayTransform={(id, display) => `#${display}`}
                    renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
                        <div className={`orden-item ${focused ? 'focused' : ''}`}>
                            Orden #{suggestion.display} 📄
                        </div>
                    )}
                    style={{ backgroundColor: '#d3ffd3' }}
                >

                </Mention>
            </MentionsInput>

            <style jsx>{`
        .mention-component {
          width: 100%;
          max-width: 600px;
        }
        
        .mentions-input {
          font-size: 16px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        /* Estilo para las menciones en el texto */
        :global(.mentions__mention) {
          background-color: #cceeff;
          border-radius: 2px;
          padding: 0 2px;
        }
      `}</style>
        </div>
    );
}

export default MentionComponent;
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmail } from '../../redux/features/email/emailSlice';


const Email = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const { status, error } = useSelector((state) => state.email);

  const handleSendEmail = () => {
    if (email.trim() === '') {
      alert('Por favor, ingresa un correo válido');
      return;
    }
    dispatch(fetchEmail({ email }));
  };

  return (
    <div>
      <h2>Enviar Correo de Verificación</h2>
      <input
        type="email"
        placeholder="Escribe tu correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendEmail} disabled={status === 'loading'}>
        {status === 'loading' ? 'Enviando...' : 'Enviar'}
      </button>
      {status === 'succeeded' && <p>Correo enviado con éxito</p>}
      {status === 'failed' && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default Email;

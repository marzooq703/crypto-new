'use client';

import React, { useState } from 'react';
import axios from 'axios';

function ForgotPinButton() {
  const [fid, setFid] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    try {
      const response = await axios.get(
        'https://api.faceio.net/setfacialidpincode',
        {
          fid: 'c1b1777604da49899accf04d54bf5feffioab44a',
          pin: '1111',
          key: '528a47e0a05dc3a24c52548e61ae5cdb',
        },
        {
          params: {
            key: '528a47e0a05dc3a24c52548e61ae5cdb',
          },
        },
      );

      if (response.status !== 200) {
        setError(response.data.error);
        setSuccess('');
        console.log(response.data.error);
      } else {
        console.log('PIN Code successfully changed!');
        setSuccess('PIN Code successfully changed!');
        setError('');
      }
    } catch (error) {
      console.log(error);
      setError('Error occurred while processing your request.');
      setSuccess('');
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="fid">Facial ID:</label>
        <input
          type="text"
          id="fid"
          value={fid}
          onChange={(e) => setFid(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="pin">New PIN:</label>
        <input
          type="text"
          id="pin"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit}>Forgot Pin</button>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
}

export default ForgotPinButton;

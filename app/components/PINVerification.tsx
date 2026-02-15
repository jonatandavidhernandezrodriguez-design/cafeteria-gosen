'use client';

import React, { useState } from 'react';
import { guardarClaveConExpiracion } from '@/app/lib/auth-utils';

interface PINVerificationProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

const ADMIN_PIN = '2026@gosen'; // PIN administrador

export default function PINVerification({ 
  isOpen, 
  onSuccess, 
  onCancel,
  title = 'Verificación de PIN',
  description = 'Ingresa el PIN administrativo'
}: PINVerificationProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = () => {
    if (pin === ADMIN_PIN) {
      // Guardar la clave con expiración de 24h
      guardarClaveConExpiracion();
      
      setPin('');
      setError('');
      setAttempts(0);
      onSuccess();
    } else {
      setError('❌ PIN incorrecto');
      setAttempts(prev => prev + 1);
      setPin('');
      
      if (attempts >= 2) {
        setError('❌ Demasiados intentos fallidos. Acceso denegado.');
        setTimeout(() => {
          handleCancel();
        }, 2000);
      }
    }
  };

  const handleCancel = () => {
    setPin('');
    setError('');
    setAttempts(0);
    onCancel();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>

        {/* PIN Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            PIN Administrativo
          </label>
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="Ingresa el PIN"
            maxLength={50}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-center text-lg font-semibold"
            autoFocus
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Attempts */}
        {attempts > 0 && attempts < 3 && (
          <div className="mb-4 text-xs text-gray-500">
            Intentos restantes: {3 - attempts}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={pin.length === 0}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition"
          >
            Verificar
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';

interface Operator {
  id: string;
  nome_completo?: string;
  matricula?: string;
  email?: string;
  foto_url?: string;
  ativo?: boolean;
}

export default function OperatorCard({ operator }: { operator: Operator }) {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-black/5">
      <div className="flex items-center gap-4 p-4">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-3xl overflow-hidden bg-gray-100 flex items-center justify-center">
            {operator.foto_url ? (
              <img src={operator.foto_url} alt={operator.nome_completo || 'Operador'} className="w-full h-full object-cover" />
            ) : (
              <div className="text-3xl">👤</div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{operator.nome_completo || '—'}</h3>
              <p className="text-sm text-gray-500">Matrícula: {operator.matricula || '—'}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${operator.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                {operator.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <div className="truncate">{operator.email || 'sem email'}</div>
            <div className="ml-4 text-right text-xs text-gray-400">ID: {operator.id.slice(0, 8)}</div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 p-3 bg-gradient-to-r from-white to-gray-50">
        <div className="flex gap-3">
          <button className="flex-1 rounded-lg bg-blue-600 text-white py-2 text-sm font-medium hover:bg-blue-700">Ver perfil</button>
          <button className="rounded-lg bg-white border border-gray-200 py-2 px-3 text-sm font-medium hover:bg-gray-50">Mensagem</button>
        </div>
      </div>
    </div>
  );
}

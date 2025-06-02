
import React from 'react';
import ChecklistForm from '../components/ChecklistForm';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Checklist de Plataforma de Lançamento MSV 
          </h1>
          <p className="text-gray-600">
            Versão de teste V3 01/06/2025 atuli - produção Jonathan Gomes 
          </p>
        </div>
        <ChecklistForm />
      </div>
    </div>
  );
};

export default Index;

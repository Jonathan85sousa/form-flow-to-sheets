
import React from 'react';
import { Button } from '../components/ui/button';
import { FileText } from 'lucide-react';
import ChecklistForm from '../components/ChecklistForm';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <h1 className="text-4xl font-bold text-gray-800 flex-1">
              Checklist de Plataforma de Lançamento MSV 
            </h1>
            <div className="flex-1 flex justify-end">
              <Button
                onClick={() => navigate('/formularios')}
                variant="outline"
                className="flex items-center gap-2 bg-white/80 hover:bg-white border-blue-300 text-blue-700"
              >
                <FileText className="h-4 w-4" />
                Gerenciar Formulários
              </Button>
            </div>
          </div>
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

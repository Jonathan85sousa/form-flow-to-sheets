import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import CategorySection from './CategorySection';
import SignatureCanvas from './SignatureCanvas';
import { Plus, Send, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ChecklistItem {
  id: string;
  code: string;
  description: string;
  evaluation: string;
  repair: string;
}

interface Category {
  id: string;
  name: string;
  items: ChecklistItem[];
}

const ChecklistForm = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'POSTES',
      items: [
        { id: '1-1', code: '1.1', description: 'Poste deteriorado', evaluation: 'SIM', repair: 'SIM' },
        { id: '1-2', code: '1.2', description: 'Presença de Cupins', evaluation: 'SIM', repair: 'SIM' },
        { id: '1-3', code: '1.3', description: 'Rachadura no Poste', evaluation: 'SIM', repair: 'SIM' },
        { id: '1-4', code: '1.4', description: 'Poste com desgaste', evaluation: 'SIM', repair: 'SIM' },
        { id: '1-5', code: '1.5', description: 'Pintura desgastada', evaluation: 'SIM', repair: 'SIM' },
      ]
    },
    {
      id: '2',
      name: 'VIGAS DE MADEIRA',
      items: [
        { id: '2-1', code: '2.1', description: 'Deck deteriorado', evaluation: 'SIM', repair: 'SIM' },
        { id: '2-2', code: '2.2', description: 'Rachadura no Deck', evaluation: 'SIM', repair: 'SIM' },
        { id: '2-3', code: '2.3', description: 'Presença de Cupins', evaluation: 'SIM', repair: 'SIM' },
        { id: '2-4', code: '2.4', description: 'Pintura desgastada', evaluation: 'SIM', repair: 'SIM' },
        { id: '2-5', code: '2.5', description: 'Barra roscadas tortas', evaluation: 'SIM', repair: 'SIM' },
        { id: '2-6', code: '2.6', description: 'Barra roscada com oxidação', evaluation: 'SIM', repair: 'SIM' },
      ]
    }
  ]);
  const [signature, setSignature] = useState<string>('');

  const addCategory = () => {
    const newId = (categories.length + 1).toString();
    const newCategory: Category = {
      id: newId,
      name: `NOVA CATEGORIA ${newId}`,
      items: []
    };
    setCategories([...categories, newCategory]);
    toast.success('Categoria adicionada com sucesso!');
  };

  const updateCategory = (categoryId: string, updatedCategory: Category) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? updatedCategory : cat
    ));
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast.success('Categoria removida com sucesso!');
  };

  const generateGoogleSheetsUrl = (data: any) => {
    // Esta é a URL do seu Google Apps Script Web App
    // Substitua pela URL real do seu script
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzLqYj93bizgpCZKMKDdHs7n0GflUOmfAVW3amdKKbSjpMP2SeuQQl6e4mSHrudU69i/exec';
    
    const params = new URLSearchParams();
    params.append('data', JSON.stringify(data));
    
    return `${scriptUrl}?${params.toString()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      date,
      categories,
      signature,
      timestamp: new Date().toISOString()
    };

    console.log('Enviando dados para Google Sheets:', formData);

    try {
      // URL do seu Google Apps Script Web App
      // SUBSTITUA pela URL real do seu script
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbzLqYj93bizgpCZKMKDdHs7n0GflUOmfAVW3amdKKbSjpMP2SeuQQl6e4mSHrudU69i/exec';
      
      // Criar FormData para envio
      const formDataToSend = new FormData();
      formDataToSend.append('data', JSON.stringify(formData));

      console.log('URL do script:', scriptUrl);
      console.log('Dados sendo enviados:', JSON.stringify(formData));

      // Enviar para Google Sheets usando POST
      const response = await fetch(scriptUrl, {
        method: 'POST',
        body: formDataToSend,
        mode: 'no-cors'
      });

      console.log('Resposta do Google Apps Script:', response);
      
      toast.success('Formulário enviado com sucesso para o Google Sheets!');
      
    } catch (error) {
      console.error('Erro ao enviar para Google Sheets:', error);
      toast.error('Erro ao enviar formulário. Verifique a URL do script e tente novamente.');
    }
  };

  const exportToJson = () => {
    const formData = {
      date,
      categories,
      signature,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `checklist-${date}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Arquivo JSON exportado com sucesso!');
  };

  return (
    <Card className="max-w-6xl mx-auto shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardTitle className="text-2xl text-center">
          Checklist de Plataforma de Lançamento
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                Data da Inspeção
              </Label>
              <Input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="space-y-6">
            {categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                onUpdate={(updatedCategory) => updateCategory(category.id, updatedCategory)}
                onDelete={() => deleteCategory(category.id)}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              onClick={addCategory}
              variant="outline"
              className="flex items-center gap-2 hover:bg-blue-50 border-blue-300 text-blue-600"
            >
              <Plus className="h-4 w-4" />
              Adicionar Nova Categoria
            </Button>
          </div>

          <div className="mt-8">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Assinatura Digital
            </Label>
            <SignatureCanvas
              signature={signature}
              onSignatureChange={setSignature}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              type="button"
              onClick={exportToJson}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar JSON
            </Button>
            
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Enviar para Google Sheets
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChecklistForm;

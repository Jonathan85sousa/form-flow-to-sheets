import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
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
  const [localName, setLocalName] = useState('');
  const [collaboratorName, setCollaboratorName] = useState('');
  const [serviceOrderNumber, setServiceOrderNumber] = useState('');
  const [description, setDescription] = useState('');
  const [observation, setObservation] = useState('');
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'POSTES',
      items: [
        { id: '1-1', code: '1.1', description: 'Poste deteriorado', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '1-2', code: '1.2', description: 'Presença de Cupins', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '1-3', code: '1.3', description: 'Rachadura no Poste', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '1-4', code: '1.4', description: 'Poste com desgaste', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '1-5', code: '1.5', description: 'Pintura desgastada', evaluation: 'NÃO', repair: 'NÃO' },
      ]
    },
    {
      id: '2',
      name: 'VIGAS DE MADEIRA',
      items: [
        { id: '2-1', code: '2.1', description: 'Deck deteriorado', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '2-2', code: '2.2', description: 'Rachadura no Deck', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '2-3', code: '2.3', description: 'Presença de Cupins', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '2-4', code: '2.4', description: 'Pintura desgastada', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '2-5', code: '2.5', description: 'Barra roscadas tortas', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '2-6', code: '2.6', description: 'Barra roscada com oxidação', evaluation: 'NÃO', repair: 'NÃO' },
      ]
    },
     {
      id: '3',
      name: 'DECK GARAPEIRA',
      items: [
        { id: '3-1', code: '3.1', description: 'Deck deteriorado', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '3-2', code: '3.2', description: 'Rachadura no Deck', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '3-3', code: '3.3', description: 'Presença de Cupins', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '3-4', code: '3.4', description: 'Pintura desgastada', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '3-5', code: '3.5', description: 'Barra roscadas tortas', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '3-6', code: '3.6', description: 'Barra roscada com oxidação', evaluation: 'NÃO', repair: 'NÃO' },
      ]
    },
    {
      id: '4',
      name: 'GUARDA CORPO',
      items: [
        { id: '4-1', code: '4.1', description: 'Madeiramento deteriorado', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '4-2', code: '4.2', description: 'Presençade Cupins, evaluation: 'NÃO', repair: 'NÃO' },
        { id: '4-3', code: '4.3', description: 'Rachadura no Madeiramento, evaluation: 'NÃO', repair: 'NÃO' },
        { id: '4-4', code: '4.4', description: 'Pintura Desgastada', evaluation: 'NÃO', repair: 'NÃO' },
      ]
    },
    {
      id: '5',
      name: 'VIGAS DE SUSTENTAÇÃO DA TRAVE',
      items: [
        { id: '5-1', code: '5.1', description: 'Madeira deteriorada', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '5-2', code: '5.2', description: 'Rachadura na trave', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '5-3', code: '5.3', description: 'Presença de Cupins', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '5-4', code: '5.4', description: 'Barra roscadas tortas', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '5-5', code: '5.5', description: 'Barra roscada com oxidação Superficial', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '5-6', code: '5.6', description: 'Barra roscada com oxidação corrosiva', evaluation: 'NÃO', repair: 'NÃO' },
      ]
    },
    {
      id: '6',
      name: 'TÍTULO PARA NOVO TÓPICO,
      items: [
        { id: '6-1', code: '6.1', description: 'Madeira deteriorada', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '6-2', code: '6.2', description: 'Rachadura na trave', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '6-3', code: '6.3', description: 'Presença de Cupins', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '6-4', code: '6.4', description: 'Barra roscadas tortas', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '6-5', code: '6.5', description: 'Barra roscada com oxidação Superficial', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '6-6', code: '6.6', description: 'Barra roscada com oxidação corrosiva', evaluation: 'NÃO', repair: 'NÃO' },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação dos campos obrigatórios
    if (!localName || !collaboratorName || !serviceOrderNumber) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const formData = {
      date,
      localName,
      collaboratorName,
      serviceOrderNumber,
      description,
      observation,
      categories,
      signature,
      timestamp: new Date().toISOString()
    };

    console.log('Enviando dados para Google Docs:', formData);

    try {
      // IMPORTANTE: Substitua pela sua URL do Google Apps Script
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbxWDfAyYC8eEPoGNThP04RECWcKdZ8DhbQRA5PKVwWYX55zzhE09Sko9RXgdFhRvkFL/exec';
      
      console.log('URL do script:', scriptUrl);
      console.log('Dados sendo enviados:', JSON.stringify(formData));

      // Criar FormData para envio
      const submitData = new FormData();
      submitData.append('data', JSON.stringify(formData));

      // Enviar usando POST
      const response = await fetch(scriptUrl, {
        method: 'POST',
        body: submitData,
        redirect: 'follow'
      });

      console.log('Status da resposta:', response.status);
      console.log('Response OK:', response.ok);

      if (response.ok) {
        try {
          const result = await response.text();
          console.log('Resposta do Google Apps Script:', result);
          
          const parsedResult = JSON.parse(result);
          if (parsedResult.status === 'success') {
            toast.success('Formulário enviado com sucesso para o Google Docs!');
            console.log('URL do documento:', parsedResult.docUrl);
          } else {
            console.error('Erro na resposta:', parsedResult);
            toast.error(`Erro: ${parsedResult.message || 'Erro desconhecido'}`);
          }
        } catch (parseError) {
          console.error('Erro ao processar resposta:', parseError);
          toast.success('Formulário enviado! (Não foi possível verificar o status)');
        }
      } else {
        console.error('Erro HTTP:', response.status, response.statusText);
        toast.error(`Erro HTTP: ${response.status} - Verifique a URL do script`);
      }
      
    } catch (error) {
      console.error('Erro ao enviar para Google Docs:', error);
      toast.error('Formulário enviado!');
    }
  };

  const exportToJson = () => {
    const formData = {
      date,
      localName,
      collaboratorName,
      serviceOrderNumber,
      description,
      observation,
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
            <div>
              <Label htmlFor="localName" className="text-sm font-medium text-gray-700">
                Nome do Local *
              </Label>
              <Input
                type="text"
                id="localName"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                className="mt-1"
                placeholder="Digite o nome do local"
                required
              />
            </div>
            <div>
              <Label htmlFor="collaboratorName" className="text-sm font-medium text-gray-700">
                Nome do Colaborador(es) *
              </Label>
              <Input
                type="text"
                id="collaboratorName"
                value={collaboratorName}
                onChange={(e) => setCollaboratorName(e.target.value)}
                className="mt-1"
                placeholder="Digite o nome do colaborador"
                required
              />
            </div>
            <div>
              <Label htmlFor="serviceOrderNumber" className="text-sm font-medium text-gray-700">
                Número da Ordem de Serviço *
              </Label>
              <Input
                type="text"
                id="serviceOrderNumber"
                value={serviceOrderNumber}
                onChange={(e) => setServiceOrderNumber(e.target.value)}
                className="mt-1"
                placeholder="Digite o número da OS"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
                placeholder="Digite a descrição detalhada..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="observation" className="text-sm font-medium text-gray-700">
                Materiais ultilizados
              </Label>
              <Textarea
                id="observation"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="mt-1"
                placeholder="Digite os materiais ultilizados nos reparos..."
                rows={4}
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
              Enviar para Engenharia
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChecklistForm;

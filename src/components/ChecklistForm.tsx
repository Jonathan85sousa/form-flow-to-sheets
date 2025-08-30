
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import CategorySection from './CategorySection';
import SignatureCanvas from './SignatureCanvas';
import { Plus, Download, FileText, Save, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ChecklistItem {
  id: string;
  code: string;
  description: string;
  evaluation: string;
  repair: string;
  photo?: string;
  materiaisUtilizados?: string;
  descricaoRealizada?: string;
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
        { id: '4-2', code: '4.2', description: 'Presença de Cupins', evaluation: 'NÃO', repair: 'NÃO' },
        { id: '4-3', code: '4.3', description: 'Rachadura no Madeiramento', evaluation: 'NÃO', repair: 'NÃO' },
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
      name: 'TÍTULO PARA NOVO TÓPICO',
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

  // Função para salvar dados localmente
  const saveToLocalStorage = () => {
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

    const savedData = JSON.parse(localStorage.getItem('checklistData') || '[]');
    savedData.push(formData);
    localStorage.setItem('checklistData', JSON.stringify(savedData));
    
    toast.success('Checklist salvo localmente com sucesso!');
    return formData;
  };

  // Função para carregar dados salvos
  const loadSavedData = () => {
    const savedData = JSON.parse(localStorage.getItem('checklistData') || '[]');
    console.log('Dados salvos:', savedData);
    toast.success(`${savedData.length} checklists encontrados no armazenamento local`);
  };

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

    // Salvar localmente
    saveToLocalStorage();
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
    
    const exportFileDefaultName = `checklist-${date}-${serviceOrderNumber}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Arquivo JSON exportado com sucesso!');
  };

  const exportToHtml = () => {
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

    let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Checklist de Plataforma - ${formData.localName}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .category { margin-bottom: 30px; }
            .category h3 { background: #f0f0f0; padding: 10px; margin: 0; }
            .item { border-bottom: 1px solid #ddd; padding: 10px; }
            .item-photo { max-width: 300px; margin-top: 10px; border: 1px solid #ccc; border-radius: 5px; }
            .signature { margin-top: 30px; text-align: center; }
            .signature img { max-width: 300px; border: 1px solid #ddd; }
            @media print { body { margin: 0; } }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Checklist de Plataforma de Lançamento</h1>
            <p>Data: ${formData.date}</p>
        </div>
        
        <div class="info-grid">
            <div><strong>Local:</strong> ${formData.localName}</div>
            <div><strong>Colaborador(es):</strong> ${formData.collaboratorName}</div>
            <div><strong>OS:</strong> ${formData.serviceOrderNumber}</div>
            <div><strong>Data/Hora:</strong> ${new Date(formData.timestamp).toLocaleString('pt-BR')}</div>
        </div>

        ${formData.description ? `<div><strong>Descrição:</strong><br>${formData.description}</div><br>` : ''}
        ${formData.observation ? `<div><strong>Materiais Utilizados:</strong><br>${formData.observation}</div><br>` : ''}

        ${formData.categories.map(category => `
            <div class="category">
                <h3>${category.name}</h3>
                 ${category.items.map(item => `
                     <div class="item">
                         <strong>${item.code}</strong> - ${item.description}<br>
                         <small>Avaliação: ${item.evaluation} | Reparo: ${item.repair}</small>
                          ${item.materiaisUtilizados ? `<br><small><strong>Materiais utilizados:</strong> ${item.materiaisUtilizados}</small>` : ''}
                          ${item.descricaoRealizada ? `<br><small><strong>Descrição do que foi realizado:</strong> ${item.descricaoRealizada}</small>` : ''}
                          ${item.photo ? `<br><img src="${item.photo}" alt="Foto do item ${item.code}" class="item-photo" />` : ''}
                     </div>
                 `).join('')}
            </div>
        `).join('')}

        ${formData.signature ? `
            <div class="signature">
                <h3>Assinatura Digital</h3>
                <img src="${formData.signature}" alt="Assinatura" />
            </div>
        ` : ''}
    </body>
    </html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `checklist-${formData.date}-${formData.serviceOrderNumber}.html`;
    link.click();
    
    toast.success('Relatório HTML exportado com sucesso!');
  };

  const sendToWhatsApp = () => {
    // Validação dos campos obrigatórios
    if (!localName || !collaboratorName || !serviceOrderNumber) {
      toast.error('Por favor, preencha todos os campos obrigatórios antes de enviar');
      return;
    }

    // Criar resumo dos itens com problemas
    const problematicItems = categories.flatMap(category => 
      category.items.filter(item => item.evaluation === 'SIM' || item.repair === 'SIM')
        .map(item => ({
          category: category.name,
          code: item.code,
          description: item.description,
          evaluation: item.evaluation,
          repair: item.repair,
          materiaisUtilizados: item.materiaisUtilizados,
          descricaoRealizada: item.descricaoRealizada,
          hasPhoto: !!item.photo
        }))
    );

    // Criar mensagem formatada
    let message = `🔧 *CHECKLIST DE PLATAFORMA DE LANÇAMENTO*\n\n`;
    message += `📅 *Data:* ${new Date(date).toLocaleDateString('pt-BR')}\n`;
    message += `📍 *Local:* ${localName}\n`;
    message += `👷 *Colaborador(es):* ${collaboratorName}\n`;
    message += `🎫 *OS:* ${serviceOrderNumber}\n\n`;

    if (description) {
      message += `📋 *Descrição:* ${description}\n\n`;
    }

    if (observation) {
      message += `🔨 *Materiais Utilizados:* ${observation}\n\n`;
    }

    // Resumo dos problemas encontrados
    if (problematicItems.length > 0) {
      message += `⚠️ *ITENS COM PROBLEMAS OU REPAROS:*\n\n`;
      
      const groupedByCategory = problematicItems.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, typeof problematicItems>);

      Object.entries(groupedByCategory).forEach(([categoryName, items]) => {
        message += `🏗️ *${categoryName}:*\n`;
        items.forEach(item => {
          message += `• ${item.code} - ${item.description}\n`;
          message += `  ✓ Avaliação: ${item.evaluation} | Reparo: ${item.repair}\n`;
          
          if (item.materiaisUtilizados) {
            message += `  🔧 Materiais: ${item.materiaisUtilizados}\n`;
          }
          
          if (item.descricaoRealizada) {
            message += `  📝 Realizado: ${item.descricaoRealizada}\n`;
          }
          
          if (item.hasPhoto) {
            message += `  📷 Foto anexada no relatório\n`;
          }
          
          message += `\n`;
        });
        message += `\n`;
      });
    } else {
      message += `✅ *RESULTADO:* Nenhum problema encontrado - Plataforma em perfeitas condições!\n\n`;
    }

    // Informação sobre documentos completos
    message += `📄 *Documentação completa (com fotos e assinatura) disponível nos arquivos exportados*\n\n`;
    message += `✍️ *Assinatura digital:* ${signature ? 'Coletada ✓' : 'Não coletada'}\n\n`;
    message += `🕐 *Relatório gerado em:* ${new Date().toLocaleString('pt-BR')}`;

    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Abrir WhatsApp com a mensagem
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    toast.success('Mensagem preparada para WhatsApp! Selecione o grupo ou contato.');
  };

  return (
    <Card className="max-w-6xl mx-auto shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardTitle className="text-2xl text-center">
          Checklist de Plataforma de Lançamento
        </CardTitle>
        <p className="text-center text-blue-100 text-sm">
          Funciona completamente offline
        </p>
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
                Materiais utilizados
              </Label>
              <Textarea
                id="observation"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="mt-1"
                placeholder="Digite os materiais utilizados nos reparos..."
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

          <div className="mt-8 bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-blue-800 mb-2">
                Assinatura do Cliente
              </h3>
              <p className="text-sm text-blue-600">
                Por favor, assine abaixo para confirmar a realização dos serviços
              </p>
            </div>
            <SignatureCanvas
              signature={signature}
              onSignatureChange={setSignature}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              type="button"
              onClick={loadSavedData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Ver Salvos
            </Button>

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
              type="button"
              onClick={exportToHtml}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Exportar HTML
            </Button>

            <Button
              type="button"
              onClick={sendToWhatsApp}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Enviar para WhatsApp
            </Button>
            
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Salvar Checklist
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChecklistForm;

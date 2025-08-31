
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import CategorySection from './CategorySection';
import SignatureCanvas from './SignatureCanvas';
import { Plus, Download, FileText, Save, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [showSavedData, setShowSavedData] = useState(false);
  const [savedChecklists, setSavedChecklists] = useState<any[]>([]);

  // Função para salvar dados localmente
  const saveToLocalStorage = () => {
    const formData = {
      date,
      localName,
      collaboratorName,
      serviceOrderNumber,
      description,
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
    setSavedChecklists(savedData);
    setShowSavedData(true);
    toast.success(`${savedData.length} checklists encontrados no armazenamento local`);
  };

  const deleteSavedChecklist = (index: number) => {
    const savedData = JSON.parse(localStorage.getItem('checklistData') || '[]');
    savedData.splice(index, 1);
    localStorage.setItem('checklistData', JSON.stringify(savedData));
    setSavedChecklists(savedData);
    toast.success('Checklist removido com sucesso!');
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

  const exportToPdf = async () => {
    const formData = {
      date,
      localName,
      collaboratorName,
      serviceOrderNumber,
      description,
      categories,
      signature,
      timestamp: new Date().toISOString()
    };

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = margin;

    // Função para adicionar nova página
    const addNewPage = () => {
      pdf.addPage();
      currentY = margin;
    };

    // Função para verificar se precisa de nova página
    const checkPageBreak = (neededHeight: number) => {
      if (currentY + neededHeight > pageHeight - margin) {
        addNewPage();
      }
    };

    // Função para renderizar seção e retornar altura
    const renderSection = async (htmlContent: string, minHeight = 30) => {
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '750px';
      tempDiv.style.padding = '15px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.innerHTML = htmlContent;
      
      document.body.appendChild(tempDiv);
      
      try {
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Verificar se precisa quebrar página
        checkPageBreak(Math.max(imgHeight, minHeight));
        
        pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 5; // pequeno espaço entre seções
        
        return imgHeight;
      } finally {
        document.body.removeChild(tempDiv);
      }
    };

    try {
      // 1. Cabeçalho
      await renderSection(`
        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 24px; color: #333;">Checklist de Plataforma de Lançamento</h1>
          <p style="margin: 10px 0; color: #666;">Data: ${formData.date}</p>
        </div>
      `);

      // 2. Informações do formulário
      await renderSection(`
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div><strong>Local:</strong> ${formData.localName}</div>
          <div><strong>Colaborador(es):</strong> ${formData.collaboratorName}</div>
          <div><strong>OS:</strong> ${formData.serviceOrderNumber}</div>
          <div><strong>Data/Hora:</strong> ${new Date(formData.timestamp).toLocaleString('pt-BR')}</div>
        </div>
        ${formData.description ? `<div style="margin-bottom: 15px;"><strong>Descrição:</strong><br>${formData.description}</div>` : ''}
      `);

      // 3. Cada categoria separadamente
      for (const category of formData.categories) {
        // Verificar se a categoria tem itens
        if (category.items.length === 0) continue;

        // Cabeçalho da categoria
        checkPageBreak(40);
        await renderSection(`
          <div style="margin-bottom: 15px;">
            <h3 style="background: #f0f0f0; padding: 12px; margin: 0; font-size: 18px; border-radius: 5px;">${category.name}</h3>
          </div>
        `, 40);

        // Processar itens da categoria em pequenos grupos para evitar quebras no meio
        const itemsPerGroup = 3;
        for (let i = 0; i < category.items.length; i += itemsPerGroup) {
          const itemGroup = category.items.slice(i, i + itemsPerGroup);
          
          const groupHtml = `
            <div style="margin-bottom: 15px;">
              ${itemGroup.map(item => `
                <div style="border: 1px solid #e0e0e0; border-radius: 5px; padding: 12px; margin-bottom: 10px; background: #fafafa;">
                  <div style="margin-bottom: 8px;">
                    <strong style="color: #333;">${item.code}</strong> - ${item.description}
                  </div>
                  <div style="margin-bottom: 5px;">
                    <small style="color: #666; background: #e8f4f8; padding: 2px 8px; border-radius: 3px; margin-right: 10px;">
                      Avaliação: ${item.evaluation}
                    </small>
                    <small style="color: #666; background: #f0f8e8; padding: 2px 8px; border-radius: 3px;">
                      Reparo: ${item.repair}
                    </small>
                  </div>
                  ${item.descricaoRealizada ? `
                    <div style="margin: 8px 0; padding: 8px; background: #fff; border-left: 3px solid #4CAF50; border-radius: 3px;">
                      <small style="color: #555;"><strong>Descrição realizada:</strong> ${item.descricaoRealizada}</small>
                    </div>
                  ` : ''}
                  ${item.photo ? `
                    <div style="margin-top: 10px; text-align: center;">
                      <img src="${item.photo}" alt="Foto do item ${item.code}" 
                           style="max-width: 280px; max-height: 200px; border: 2px solid #ddd; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          `;

          // Estimar altura mínima baseada no conteúdo
          const hasPhotos = itemGroup.some(item => item.photo);
          const minHeight = hasPhotos ? 150 : 80;
          
          await renderSection(groupHtml, minHeight);
        }
      }

      // 4. Assinatura (se existe)
      if (formData.signature) {
        // Garantir que a assinatura não seja cortada
        checkPageBreak(120);
        await renderSection(`
          <div style="margin-top: 30px; text-align: center; page-break-inside: avoid;">
            <h3 style="margin-bottom: 15px; color: #333;">Assinatura Digital</h3>
            <div style="border: 2px solid #ddd; border-radius: 8px; padding: 15px; background: #fafafa;">
              <img src="${formData.signature}" alt="Assinatura" 
                   style="max-width: 280px; max-height: 100px; border: 1px solid #ccc; border-radius: 5px;" />
            </div>
          </div>
        `, 120);
      }

      pdf.save(`checklist-${formData.date}-${formData.serviceOrderNumber}.pdf`);
      toast.success('Relatório PDF exportado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF. Tente novamente.');
    }
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

          <div className="mb-6">
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
              <Eye className="h-4 w-4" />
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
              onClick={exportToPdf}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar PDF
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

        {showSavedData && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Checklists Salvos ({savedChecklists.length})
              </h3>
              <Button
                type="button"
                onClick={() => setShowSavedData(false)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Fechar
              </Button>
            </div>
            
            {savedChecklists.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhum checklist salvo encontrado
              </p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {savedChecklists.map((checklist, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {checklist.localName} - OS: {checklist.serviceOrderNumber}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Data: {new Date(checklist.date).toLocaleDateString('pt-BR')} | 
                          Colaborador: {checklist.collaboratorName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Salvo em: {new Date(checklist.timestamp).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => deleteSavedChecklist(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {checklist.description && (
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Descrição:</strong> {checklist.description}
                      </p>
                    )}
                    
                    
                    <div className="text-sm text-gray-600">
                      <strong>Categorias:</strong> {checklist.categories.length} |
                      <strong> Itens com fotos:</strong> {
                        checklist.categories.flatMap(cat => cat.items).filter(item => item.photo).length
                      } |
                      <strong> Assinatura:</strong> {checklist.signature ? 'Sim' : 'Não'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChecklistForm;

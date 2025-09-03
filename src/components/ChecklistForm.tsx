
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
  evaluationPhoto?: string;
  materiaisUtilizados?: string;
  descricaoRealizada?: string;
}

interface Category {
  id: string;
  name: string;
  items: ChecklistItem[];
}

const ChecklistForm = () => {
  // Force cache refresh by adding comment
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
                         ${item.evaluationPhoto ? `<br><img src="${item.evaluationPhoto}" alt="Foto da avaliação ${item.code}" class="item-photo" />` : ''}
                         ${item.photo ? `<br><img src="${item.photo}" alt="Foto do reparo ${item.code}" class="item-photo" />` : ''}
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
    try {
      toast.info('Iniciando geração do PDF...');
      
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

      // Validar dados obrigatórios
      if (!formData.localName || !formData.collaboratorName || !formData.serviceOrderNumber) {
        toast.error('Preencha todos os campos obrigatórios antes de exportar');
        return;
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      let yPosition = 20;

      // Função para adicionar texto ao PDF com estilos aprimorados
      const addText = (text: string, x: number, y: number, options: any = {}) => {
        const fontSize = options.fontSize || 12;
        const style = options.style || 'normal';
        
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', style);
        
        if (options.color && Array.isArray(options.color)) {
          pdf.setTextColor(options.color[0], options.color[1], options.color[2]);
        } else if (options.color) {
          pdf.setTextColor(options.color);
        } else {
          pdf.setTextColor(0, 0, 0);
        }
        
        // Adicionar fundo colorido para títulos principais
        if (options.highlight) {
          pdf.setFillColor(230, 240, 255); // Azul claro
          pdf.rect(x - 2, y - fontSize * 0.7, 170, fontSize * 1.2, 'F');
        }
        
        pdf.text(text, x, y);
        return y + (fontSize * 0.6);
      };

      // Função para verificar quebra de página
      const checkPageBreak = (neededSpace: number) => {
        if (yPosition + neededSpace > 270) {
          pdf.addPage();
          yPosition = 20;
        }
      };

      // Cabeçalho com destaque
      pdf.setFillColor(41, 98, 255); // Azul escuro
      pdf.rect(15, 12, 180, 18, 'F');
      pdf.setTextColor(255, 255, 255); // Texto branco
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CHECKLIST DE PLATAFORMA DE LANÇAMENTO', 105, 24, { align: 'center' });
      
      yPosition = 40;
      pdf.setTextColor(0, 0, 0); // Voltar ao preto
      pdf.line(20, yPosition, 190, yPosition);
      yPosition += 15;

      // Informações básicas com melhor formatação
      yPosition = addText(`Data: ${formData.date}`, 20, yPosition, { fontSize: 13, style: 'bold' });
      yPosition += 6;
      yPosition = addText(`Local: ${formData.localName}`, 20, yPosition, { fontSize: 13, style: 'bold' });
      yPosition += 6;
      yPosition = addText(`Colaborador(es): ${formData.collaboratorName}`, 20, yPosition, { fontSize: 13, style: 'bold' });
      yPosition += 6;
      yPosition = addText(`OS: ${formData.serviceOrderNumber}`, 20, yPosition, { fontSize: 13, style: 'bold' });
      yPosition += 8;
      
      if (formData.description) {
        yPosition += 5;
        yPosition = addText('DESCRIÇÃO:', 20, yPosition, { fontSize: 14, style: 'bold', highlight: true });
        yPosition += 8;
        // Dividir texto longo em múltiplas linhas
        const descLines = pdf.splitTextToSize(formData.description, 170);
        for (const line of descLines) {
          checkPageBreak(15);
          yPosition = addText(line, 20, yPosition, { fontSize: 11 });
          yPosition += 5;
        }
      }

      yPosition += 15;

      // Processar categorias com destaque aprimorado
      for (const category of formData.categories) {
        if (category.items.length === 0) continue;

        checkPageBreak(40);
        
        // Nome da categoria com destaque
        yPosition = addText(category.name.toUpperCase(), 20, yPosition, {
          fontSize: 16,
          style: 'bold',
          highlight: true,
          color: [0, 60, 180]
        });
        yPosition += 15;

        // Itens da categoria
        for (const item of category.items) {
          const itemHeight = item.photo ? 90 : 25;
          checkPageBreak(itemHeight);
          
          yPosition = addText(`${item.code} - ${item.description}`, 25, yPosition, { 
            fontSize: 12, 
            style: 'bold' 
          });
          yPosition += 6;
          
          yPosition = addText(`Avaliação: ${item.evaluation} | Reparo: ${item.repair}`, 30, yPosition, {
            fontSize: 11,
            color: item.evaluation === 'SIM' ? [200, 0, 0] : [0, 120, 0]
          });
          yPosition += 6;
          
          if (item.materiaisUtilizados) {
            const matLines = pdf.splitTextToSize(`Materiais: ${item.materiaisUtilizados}`, 160);
            for (const line of matLines) {
              checkPageBreak(15);
              yPosition = addText(line, 30, yPosition, { fontSize: 10, color: [100, 100, 100] });
              yPosition += 5;
            }
          }
          
          if (item.descricaoRealizada) {
            const descLines = pdf.splitTextToSize(`Descrição realizada: ${item.descricaoRealizada}`, 160);
            for (const line of descLines) {
              checkPageBreak(15);
              yPosition = addText(line, 30, yPosition, { fontSize: 10, color: [100, 100, 100] });
              yPosition += 5;
            }
          }
          
          if (item.evaluationPhoto) {
            try {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              
              await new Promise((resolve) => {
                img.onload = () => {
                  try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Dimensões maiores (em mm) e melhor qualidade
                    const targetMaxWidthMm = 150; // largura maior
                    const targetMaxHeightMm = 100; // altura maior

                    const naturalW = (img as HTMLImageElement).naturalWidth || img.width;
                    const naturalH = (img as HTMLImageElement).naturalHeight || img.height;
                    const ratio = naturalW && naturalH ? naturalW / naturalH : 1;

                    let drawWidthMm = targetMaxWidthMm;
                    let drawHeightMm = drawWidthMm / ratio;
                    if (drawHeightMm > targetMaxHeightMm) {
                      drawHeightMm = targetMaxHeightMm;
                      drawWidthMm = drawHeightMm * ratio;
                    }

                    const mmToPx = (mm: number, dpi = 300) => Math.round((mm * dpi) / 25.4);

                    const canvasWidth = mmToPx(drawWidthMm);
                    const canvasHeight = mmToPx(drawHeightMm);

                    canvas.width = canvasWidth;
                    canvas.height = canvasHeight;

                    if (ctx) {
                      ctx.imageSmoothingEnabled = true;
                      ctx.imageSmoothingQuality = 'high';
                      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                    }

                    const imgData = canvas.toDataURL('image/png'); // PNG para nitidez

                    // Garante espaço suficiente na página para a imagem calculada
                    checkPageBreak(drawHeightMm + 20);

                    // Label para foto de avaliação
                    yPosition = addText('Foto da Avaliação:', 30, yPosition, { 
                      fontSize: 11, 
                      style: 'bold',
                      color: [0, 120, 0]
                    });
                    yPosition += 8;

                    // Adiciona borda e imagem no PDF usando dimensões em mm
                    pdf.setDrawColor(200, 200, 200);
                    pdf.rect(30, yPosition, drawWidthMm, drawHeightMm);
                    pdf.addImage(imgData, 'PNG', 30, yPosition, drawWidthMm, drawHeightMm);

                    // Avança a posição Y conforme altura real da imagem
                    yPosition += drawHeightMm + 10;

                    resolve(true);
                  } catch (error) {
                    console.warn('Erro ao processar imagem de avaliação:', error);
                    resolve(false);
                  }
                };
                img.onerror = () => {
                  console.warn('Erro ao carregar imagem de avaliação');
                  resolve(false);
                };
                img.src = item.evaluationPhoto!;
              });
            } catch (error) {
              console.warn('Erro ao adicionar imagem de avaliação ao PDF:', error);
            }
          }
          
          if (item.photo) {
            try {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              
              await new Promise((resolve) => {
                img.onload = () => {
                  try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Dimensões maiores (em mm) e melhor qualidade
                    const targetMaxWidthMm = 150; // largura maior
                    const targetMaxHeightMm = 100; // altura maior

                    const naturalW = (img as HTMLImageElement).naturalWidth || img.width;
                    const naturalH = (img as HTMLImageElement).naturalHeight || img.height;
                    const ratio = naturalW && naturalH ? naturalW / naturalH : 1;

                    let drawWidthMm = targetMaxWidthMm;
                    let drawHeightMm = drawWidthMm / ratio;
                    if (drawHeightMm > targetMaxHeightMm) {
                      drawHeightMm = targetMaxHeightMm;
                      drawWidthMm = drawHeightMm * ratio;
                    }

                    const mmToPx = (mm: number, dpi = 300) => Math.round((mm * dpi) / 25.4);

                    const canvasWidth = mmToPx(drawWidthMm);
                    const canvasHeight = mmToPx(drawHeightMm);

                    canvas.width = canvasWidth;
                    canvas.height = canvasHeight;

                    if (ctx) {
                      ctx.imageSmoothingEnabled = true;
                      ctx.imageSmoothingQuality = 'high';
                      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                    }

                    const imgData = canvas.toDataURL('image/png'); // PNG para nitidez

                    // Garante espaço suficiente na página para a imagem calculada
                    checkPageBreak(drawHeightMm + 20);

                    // Label para foto de reparo
                    yPosition = addText('Foto do Reparo:', 30, yPosition, { 
                      fontSize: 11, 
                      style: 'bold',
                      color: [0, 60, 180]
                    });
                    yPosition += 8;

                    // Adiciona borda e imagem no PDF usando dimensões em mm
                    pdf.setDrawColor(200, 200, 200);
                    pdf.rect(30, yPosition, drawWidthMm, drawHeightMm);
                    pdf.addImage(imgData, 'PNG', 30, yPosition, drawWidthMm, drawHeightMm);

                    // Avança a posição Y conforme altura real da imagem
                    yPosition += drawHeightMm + 10;

                    resolve(true);
                  } catch (error) {
                    console.warn('Erro ao processar imagem:', error);
                    resolve(false);
                  }
                };
                img.onerror = () => {
                  console.warn('Erro ao carregar imagem');
                  resolve(false);
                };
                img.src = item.photo!;
              });
            } catch (error) {
              console.warn('Erro ao adicionar imagem ao PDF:', error);
            }
          }
          
          yPosition += 8;
        }
        
        yPosition += 15;
      }

      // Assinatura com destaque aprimorado
      if (formData.signature) {
        checkPageBreak(90);
        
        yPosition += 15;
        yPosition = addText('ASSINATURA DIGITAL', 20, yPosition, {
          fontSize: 16,
          style: 'bold',
          highlight: true,
          color: [0, 60, 180]
        });
        yPosition += 15;
        
        try {
          // Assinatura maior e com borda
          pdf.setDrawColor(200, 200, 200);
          pdf.rect(20, yPosition, 120, 60);
          pdf.addImage(formData.signature, 'PNG', 20, yPosition, 120, 60);
          yPosition += 65;
        } catch (error) {
          console.warn('Erro ao adicionar assinatura:', error);
          yPosition = addText('[Assinatura não pôde ser adicionada]', 20, yPosition, {
            fontSize: 11,
            color: [200, 0, 0]
          });
          yPosition += 10;
        }
      }

      // Salvar o PDF
      const fileName = `checklist-${formData.date}-${formData.serviceOrderNumber}.pdf`;
      pdf.save(fileName);
      
      toast.success('PDF exportado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF. Verifique os dados e tente novamente.');
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
              onClick={() => window.open('/formularios', '_blank')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Gerenciar Formulários
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

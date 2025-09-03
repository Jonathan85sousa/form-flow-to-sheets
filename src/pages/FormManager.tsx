import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Trash2, Download, Eye, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

interface SavedForm {
  date: string;
  localName: string;
  collaboratorName: string;
  serviceOrderNumber: string;
  description?: string;
  categories: any[];
  signature?: string;
  timestamp: string;
  titleType?: 'lançamento' | 'chegada';
}

const FormManager = () => {
  const navigate = useNavigate();
  const [savedForms, setSavedForms] = useState<SavedForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<SavedForm | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadSavedForms();
  }, []);

  const loadSavedForms = () => {
    const savedData = JSON.parse(localStorage.getItem('checklistData') || '[]');
    setSavedForms(savedData);
  };

  const deleteForm = (index: number) => {
    const updatedForms = savedForms.filter((_, i) => i !== index);
    setSavedForms(updatedForms);
    localStorage.setItem('checklistData', JSON.stringify(updatedForms));
    setSelectedForm(null);
    toast.success('Formulário removido com sucesso!');
  };

  const exportForm = async (form: SavedForm) => {
    try {
      toast.info('Iniciando geração do PDF...');
      
      const formData = form;
      const titleType = form.titleType || 'lançamento';

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
      pdf.text(`CHECKLIST DE PLATAFORMA DE ${titleType.toUpperCase()}`, 105, 24, { align: 'center' });
      
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

  const viewForm = (form: SavedForm) => {
    setSelectedForm(form);
    setIsEditing(false);
  };

  const editForm = (form: SavedForm) => {
    setSelectedForm(form);
    setIsEditing(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold text-blue-800">
              Gerenciador de Formulários
            </h1>
          </div>
          <Badge variant="secondary">
            {savedForms.length} formulários salvos
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de formulários */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Formulários Salvos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedForms.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Nenhum formulário salvo encontrado
                  </p>
                ) : (
                  savedForms.map((form, index) => (
                    <Card 
                      key={index} 
                      className="p-3 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => viewForm(form)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline"
                            className="border-blue-600"
                          >
                            OS: {form.serviceOrderNumber}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                editForm(form);
                              }}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                exportForm(form);
                              }}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteForm(index);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="font-medium text-sm">{form.localName}</p>
                        <p className="text-xs text-gray-600">{form.collaboratorName}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(form.timestamp)}
                        </p>
                      </div>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Visualização do formulário */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {selectedForm ? 'Detalhes do Formulário' : 'Visualização'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedForm ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Informações Básicas</h3>
                      <Separator className="my-2" />
                      <div className="space-y-2 text-sm">
                        <p><strong>Data:</strong> {selectedForm.date}</p>
                        <p><strong>Local:</strong> {selectedForm.localName}</p>
                        <p><strong>Colaborador:</strong> {selectedForm.collaboratorName}</p>
                        <p><strong>OS:</strong> {selectedForm.serviceOrderNumber}</p>
                        {selectedForm.description && (
                          <p><strong>Descrição:</strong> {selectedForm.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">Categorias</h3>
                      <Separator className="my-2" />
                      <div className="space-y-2">
                        {selectedForm.categories.map((category, index) => (
                          <Badge key={index} variant="outline">
                            {category.name} ({category.items.length} itens)
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => exportForm(selectedForm)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Exportar PDF
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Selecione um formulário para ver os detalhes
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormManager;
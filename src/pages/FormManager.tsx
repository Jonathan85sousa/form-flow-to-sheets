import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Trash2, Download, Eye, Edit3, Palette, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface SavedForm {
  date: string;
  localName: string;
  collaboratorName: string;
  serviceOrderNumber: string;
  description?: string;
  categories: any[];
  signature?: string;
  timestamp: string;
}

const FormManager = () => {
  const navigate = useNavigate();
  const [savedForms, setSavedForms] = useState<SavedForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<SavedForm | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Configurações de estilo
  const [styleConfig, setStyleConfig] = useState({
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    backgroundColor: '#f8fafc',
    fontFamily: 'Arial, sans-serif',
    headerStyle: 'modern',
    cardStyle: 'elevated'
  });

  useEffect(() => {
    loadSavedForms();
    loadStyleConfig();
  }, []);

  const loadSavedForms = () => {
    const savedData = JSON.parse(localStorage.getItem('checklistData') || '[]');
    setSavedForms(savedData);
  };

  const loadStyleConfig = () => {
    const savedStyle = JSON.parse(localStorage.getItem('formStyleConfig') || '{}');
    if (Object.keys(savedStyle).length > 0) {
      setStyleConfig({ ...styleConfig, ...savedStyle });
    }
  };

  const saveStyleConfig = () => {
    localStorage.setItem('formStyleConfig', JSON.stringify(styleConfig));
    toast.success('Configurações de estilo salvas!');
  };

  const deleteForm = (index: number) => {
    const updatedForms = savedForms.filter((_, i) => i !== index);
    setSavedForms(updatedForms);
    localStorage.setItem('checklistData', JSON.stringify(updatedForms));
    setSelectedForm(null);
    toast.success('Formulário removido com sucesso!');
  };

  const exportForm = (form: SavedForm) => {
    const dataStr = JSON.stringify(form, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileName = `checklist-${form.date}-${form.serviceOrderNumber}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    toast.success('Formulário exportado com sucesso!');
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
    <div 
      className="min-h-screen p-4"
      style={{ 
        backgroundColor: styleConfig.backgroundColor,
        fontFamily: styleConfig.fontFamily 
      }}
    >
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
            <h1 
              className="text-3xl font-bold"
              style={{ color: styleConfig.primaryColor }}
            >
              Gerenciador de Formulários
            </h1>
          </div>
          <Badge variant="secondary">
            {savedForms.length} formulários salvos
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de formulários */}
          <div className="lg:col-span-1">
            <Card className={styleConfig.cardStyle === 'elevated' ? 'shadow-lg' : 'border'}>
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
                            style={{ borderColor: styleConfig.primaryColor }}
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

          {/* Configurações de estilo */}
          <div className="lg:col-span-1">
            <Card className={styleConfig.cardStyle === 'elevated' ? 'shadow-lg' : 'border'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Configurações de Estilo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Cor Primária</Label>
                  <Input
                    type="color"
                    value={styleConfig.primaryColor}
                    onChange={(e) => setStyleConfig({
                      ...styleConfig,
                      primaryColor: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Cor Secundária</Label>
                  <Input
                    type="color"
                    value={styleConfig.secondaryColor}
                    onChange={(e) => setStyleConfig({
                      ...styleConfig,
                      secondaryColor: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Cor de Fundo</Label>
                  <Input
                    type="color"
                    value={styleConfig.backgroundColor}
                    onChange={(e) => setStyleConfig({
                      ...styleConfig,
                      backgroundColor: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Fonte</Label>
                  <Select
                    value={styleConfig.fontFamily}
                    onValueChange={(value) => setStyleConfig({
                      ...styleConfig,
                      fontFamily: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                      <SelectItem value="Helvetica, sans-serif">Helvetica</SelectItem>
                      <SelectItem value="Georgia, serif">Georgia</SelectItem>
                      <SelectItem value="Times New Roman, serif">Times New Roman</SelectItem>
                      <SelectItem value="Courier New, monospace">Courier New</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Estilo do Cabeçalho</Label>
                  <Select
                    value={styleConfig.headerStyle}
                    onValueChange={(value) => setStyleConfig({
                      ...styleConfig,
                      headerStyle: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Moderno</SelectItem>
                      <SelectItem value="classic">Clássico</SelectItem>
                      <SelectItem value="minimal">Minimalista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Estilo dos Cartões</Label>
                  <Select
                    value={styleConfig.cardStyle}
                    onValueChange={(value) => setStyleConfig({
                      ...styleConfig,
                      cardStyle: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elevated">Elevado (com sombra)</SelectItem>
                      <SelectItem value="border">Bordas simples</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={saveStyleConfig} 
                  className="w-full"
                  style={{ backgroundColor: styleConfig.primaryColor }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Visualização do formulário */}
          <div className="lg:col-span-1">
            <Card className={styleConfig.cardStyle === 'elevated' ? 'shadow-lg' : 'border'}>
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
                        style={{ backgroundColor: styleConfig.primaryColor }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
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

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Edit2, Save, X, Trash2, Camera } from 'lucide-react';

interface ChecklistItemType {
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

interface ChecklistItemProps {
  item: ChecklistItemType;
  onUpdate: (item: ChecklistItemType) => void;
  onDelete: () => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  item,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(item);

  const handleSave = () => {
    onUpdate(editingItem);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingItem(item);
    setIsEditing(false);
  };

  const handleEvaluationChange = (value: string) => {
    const updatedItem = { ...item, evaluation: value };
    onUpdate(updatedItem);
  };

  const handleRepairChange = (value: string) => {
    const updatedItem = { ...item, repair: value };
    onUpdate(updatedItem);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedItem = { ...item, photo: e.target?.result as string };
        onUpdate(updatedItem);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEvaluationPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedItem = { ...item, evaluationPhoto: e.target?.result as string };
        onUpdate(updatedItem);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    const updatedItem = { ...item, photo: undefined };
    onUpdate(updatedItem);
  };

  const removeEvaluationPhoto = () => {
    const updatedItem = { ...item, evaluationPhoto: undefined };
    onUpdate(updatedItem);
  };

  const showRepairPhotoOption = item.evaluation === 'SIM' && item.repair === 'SIM';
  const showEvaluationPhotoOption = item.evaluation === 'SIM';

  return (
    <>
      <tr className="border-b hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 border-r font-medium text-gray-900">
          {item.code}
        </td>
        
        <td className="px-4 py-3 border-r">
          {isEditing ? (
            <Input
              value={editingItem.description}
              onChange={(e) => setEditingItem({
                ...editingItem,
                description: e.target.value
              })}
              className="w-full"
            />
          ) : (
            <span className="text-gray-800">{item.description}</span>
          )}
        </td>
        
        <td className="px-4 py-3 border-r text-center">
          <Select value={item.evaluation} onValueChange={handleEvaluationChange}>
            <SelectTrigger className="w-20 mx-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SIM">SIM</SelectItem>
              <SelectItem value="NÃO">NÃO</SelectItem>
            </SelectContent>
          </Select>
        </td>
        
        <td className="px-4 py-3 border-r text-center">
          <Select value={item.repair} onValueChange={handleRepairChange}>
            <SelectTrigger className="w-20 mx-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SIM">SIM</SelectItem>
              <SelectItem value="NÃO">NÃO</SelectItem>
              <SelectItem value="N/A">N/A</SelectItem>
            </SelectContent>
          </Select>
        </td>
        
        <td className="px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-1">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 h-7 w-7 p-0"
                >
                  <Save className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  className="h-7 w-7 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-gray-700 h-7 w-7 p-0"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={onDelete}
                  className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </td>
      </tr>
      
      {showEvaluationPhotoOption && (
        <tr className="border-b bg-green-50">
          <td className="px-4 py-2"></td>
          <td className="px-4 py-2 text-sm text-green-700 font-medium">
            Foto da Avaliação:
          </td>
          <td colSpan={3} className="px-4 py-2">
            <div className="flex items-center gap-2">
              {item.evaluationPhoto ? (
                <div className="flex items-center gap-2">
                  <img 
                    src={item.evaluationPhoto} 
                    alt="Foto da avaliação" 
                    className="h-12 w-12 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={removeEvaluationPhoto}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remover
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleEvaluationPhotoUpload}
                    className="hidden"
                    id={`evaluation-photo-${item.id}`}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => document.getElementById(`evaluation-photo-${item.id}`)?.click()}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Camera className="h-3 w-3 mr-1" />
                    Adicionar Foto
                  </Button>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}

      {showRepairPhotoOption && (
        <>
          <tr className="border-b bg-blue-50">
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2 text-sm text-blue-700 font-medium">
              Materiais Utilizados:
            </td>
            <td colSpan={3} className="px-4 py-2">
              <Input
                value={item.materiaisUtilizados || ''}
                onChange={(e) => {
                  const updatedItem = { ...item, materiaisUtilizados: e.target.value };
                  onUpdate(updatedItem);
                }}
                placeholder="Ex: grampos, lacres, porcas, arruelas..."
                className="w-full text-sm"
              />
            </td>
          </tr>
          <tr className="border-b bg-blue-50">
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2 text-sm text-blue-700 font-medium">
              Descrição do que foi realizado:
            </td>
            <td colSpan={3} className="px-4 py-2">
              <Input
                value={item.descricaoRealizada || ''}
                onChange={(e) => {
                  const updatedItem = { ...item, descricaoRealizada: e.target.value };
                  onUpdate(updatedItem);
                }}
                placeholder="Descreva o que foi realizado no reparo..."
                className="w-full text-sm"
              />
            </td>
          </tr>
          <tr className="border-b bg-blue-50">
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2 text-sm text-blue-700 font-medium">
              Foto do Reparo:
            </td>
            <td colSpan={3} className="px-4 py-2">
              <div className="flex items-center gap-2">
                {item.photo ? (
                  <div className="flex items-center gap-2">
                    <img 
                      src={item.photo} 
                      alt="Foto do reparo" 
                      className="h-12 w-12 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={removePhoto}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id={`photo-${item.id}`}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => document.getElementById(`photo-${item.id}`)?.click()}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Camera className="h-3 w-3 mr-1" />
                      Adicionar Foto
                    </Button>
                  </div>
                )}
              </div>
            </td>
          </tr>
        </>
      )}
    </>
  );
};

export default ChecklistItem;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import ChecklistItem from './ChecklistItem';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface ChecklistItemType {
  id: string;
  code: string;
  description: string;
  evaluation: string;
  repair: string;
  photo?: string;
  materiaisUtilizados?: string;
}

interface Category {
  id: string;
  name: string;
  items: ChecklistItemType[];
}

interface CategorySectionProps {
  category: Category;
  onUpdate: (category: Category) => void;
  onDelete: () => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(category.name);

  const addItem = () => {
    const nextItemNumber = category.items.length + 1;
    const newItem: ChecklistItemType = {
      id: `${category.id}-${nextItemNumber}`,
      code: `${category.id}.${nextItemNumber}`,
      description: 'Nova descrição',
      evaluation: 'SIM',
      repair: 'SIM'
    };
    
    const updatedCategory = {
      ...category,
      items: [...category.items, newItem]
    };
    
    onUpdate(updatedCategory);
    toast.success('Item adicionado com sucesso!');
  };

  const updateItem = (itemId: string, updatedItem: ChecklistItemType) => {
    const updatedCategory = {
      ...category,
      items: category.items.map(item => 
        item.id === itemId ? updatedItem : item
      )
    };
    onUpdate(updatedCategory);
  };

  const deleteItem = (itemId: string) => {
    const updatedCategory = {
      ...category,
      items: category.items.filter(item => item.id !== itemId)
    };
    onUpdate(updatedCategory);
    toast.success('Item removido com sucesso!');
  };

  const handleSaveName = () => {
    const updatedCategory = {
      ...category,
      name: editingName
    };
    onUpdate(updatedCategory);
    setIsEditing(false);
    toast.success('Nome da categoria atualizado!');
  };

  const handleCancelEdit = () => {
    setEditingName(category.name);
    setIsEditing(false);
  };

  return (
    <Card className="border-l-4 border-l-blue-500 shadow-lg">
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="font-bold text-lg"
                  autoFocus
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveName}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-800">
                  {category.id}. {category.name}
                </h3>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={addItem}
              variant="outline"
              className="flex items-center gap-1 text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4" />
              Item
            </Button>
            
            <Button
              type="button"
              size="sm"
              onClick={onDelete}
              variant="outline"
              className="flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">
                  Item
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">
                  Descrição
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-r">
                  Avaliação
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-r">
                  Reparo?
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {category.items.map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  onUpdate={(updatedItem) => updateItem(item.id, updatedItem)}
                  onDelete={() => deleteItem(item.id)}
                />
              ))}
              
              {category.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Nenhum item nesta categoria. Clique em "Item" para adicionar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategorySection;

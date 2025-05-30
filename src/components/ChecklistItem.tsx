
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Edit2, Save, X, Trash2 } from 'lucide-react';

interface ChecklistItemType {
  id: string;
  code: string;
  description: string;
  evaluation: string;
  repair: string;
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

  return (
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
  );
};

export default ChecklistItem;

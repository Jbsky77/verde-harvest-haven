
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ColumnDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string | null, title: string) => void;
  editingColumn: { id: string; title: string } | null;
}

const ColumnDialog: React.FC<ColumnDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  editingColumn
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  
  useEffect(() => {
    if (editingColumn) {
      setTitle(editingColumn.title);
    } else {
      setTitle('');
    }
  }, [editingColumn, isOpen]);
  
  const handleSave = () => {
    if (!title.trim()) return;
    onSave(editingColumn?.id || null, title.trim());
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingColumn ? t('tasks.editColumn') : t('tasks.addColumn')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('tasks.columnTitle')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('tasks.columnTitle')}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('tasks.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {t('tasks.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnDialog;

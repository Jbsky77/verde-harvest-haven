
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Task, TaskPriority } from '@/types/tasks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  editingTask?: Task | null;
  columnId: string;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTask,
  columnId
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority | undefined>(undefined);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [labels, setLabels] = useState<string>('');
  
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate);
      setLabels(editingTask.labels ? editingTask.labels.join(', ') : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority(undefined);
      setDueDate(undefined);
      setLabels('');
    }
  }, [editingTask, isOpen]);
  
  const handleSave = () => {
    if (!title.trim()) return;
    
    const taskLabels = labels
      ? labels.split(',').map(label => label.trim()).filter(Boolean)
      : undefined;
    
    const task: Task = {
      id: editingTask?.id || Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      description: description.trim() || undefined,
      status: editingTask?.status || 'todo',
      priority,
      createdAt: editingTask?.createdAt || new Date(),
      dueDate,
      labels: taskLabels,
    };
    
    onSave(task);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingTask ? t('tasks.editTask') : t('tasks.addTask')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('tasks.taskTitle')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('tasks.taskTitle')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t('tasks.taskDescription')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('tasks.taskDescription')}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">{t('tasks.taskPriority')}</Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as TaskPriority)}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder={t('tasks.taskPriority')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t('tasks.priorities.low')}</SelectItem>
                <SelectItem value="medium">{t('tasks.priorities.medium')}</SelectItem>
                <SelectItem value="high">{t('tasks.priorities.high')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>{t('tasks.taskDueDate')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : t('tasks.taskDueDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="labels">{t('tasks.taskLabels')}</Label>
            <Input
              id="labels"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              placeholder="Label1, Label2, Label3"
            />
            <p className="text-xs text-gray-500">
              {t('tasks.labels')}
            </p>
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

export default TaskDialog;

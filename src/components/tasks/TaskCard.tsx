
import React from 'react';
import { cn } from '@/lib/utils';
import { Task, TaskPriority } from '@/types/tasks';
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const getPriorityColor = (priority: TaskPriority | undefined): string => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const { t } = useTranslation();
  
  return (
    <Card className="mb-2 cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 pt-3 px-3">
        <div className="text-sm font-medium">{task.title}</div>
      </CardHeader>
      
      {task.description && (
        <CardContent className="py-2 px-3">
          <p className="text-xs text-gray-500">{task.description}</p>
        </CardContent>
      )}
      
      <CardFooter className="pt-0 pb-2 px-3 flex flex-col items-start gap-2">
        {task.priority && (
          <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
            {t(`tasks.priorities.${task.priority}`)}
          </Badge>
        )}
        
        {task.dueDate && (
          <div className="flex items-center text-xs text-gray-500 gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
        
        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.map((label, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {label}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex justify-end w-full gap-1 mt-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={() => onEdit(task)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 text-red-500 hover:text-red-600" 
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;

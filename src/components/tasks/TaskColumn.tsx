
import React from 'react';
import { TaskColumn as TaskColumnType, Task } from '@/types/tasks';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface TaskColumnProps {
  column: TaskColumnType;
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string, columnId: string) => void;
  onEditColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  column,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onEditColumn,
  onDeleteColumn
}) => {
  const { t } = useTranslation();
  
  return (
    <Card className="w-72 shrink-0 shadow-sm">
      <CardHeader className="py-3 px-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">{column.title}</h3>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={() => onAddTask(column.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditColumn(column.id, column.title)}>
                  {t('tasks.editColumn')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500" 
                  onClick={() => onDeleteColumn(column.id)}
                >
                  {t('tasks.deleteColumn')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <CardContent 
            className="p-3 pt-0 min-h-[200px]"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {column.tasks.length > 0 ? (
              column.tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard
                        task={task}
                        onEdit={() => onEditTask(task)}
                        onDelete={(taskId) => onDeleteTask(taskId, column.id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              <div className="text-xs text-gray-500 text-center py-4">
                {t('tasks.emptyColumn')}
              </div>
            )}
            {provided.placeholder}
          </CardContent>
        )}
      </Droppable>
    </Card>
  );
};

export default TaskColumn;

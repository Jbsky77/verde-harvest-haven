
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { Plus } from 'lucide-react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { TaskBoard, TaskColumn as TaskColumnType, Task } from '@/types/tasks';
import { Button } from '@/components/ui/button';
import SideNavigation from '@/components/SideNavigation';
import TaskColumn from '@/components/tasks/TaskColumn';
import TaskDialog from '@/components/tasks/TaskDialog';
import ColumnDialog from '@/components/tasks/ColumnDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'aeroponic-task-board';

const getInitialBoard = (): TaskBoard => {
  const storedBoard = localStorage.getItem(STORAGE_KEY);
  if (storedBoard) {
    const parsedBoard = JSON.parse(storedBoard);
    // Convert string dates back to Date objects
    parsedBoard.columns.forEach((column: TaskColumnType) => {
      column.tasks.forEach((task: Task) => {
        task.createdAt = new Date(task.createdAt);
        if (task.dueDate) {
          task.dueDate = new Date(task.dueDate);
        }
      });
    });
    return parsedBoard;
  }
  
  return {
    id: 'main-board',
    title: 'Main Board',
    columns: [
      {
        id: uuidv4(),
        title: 'À faire',
        tasks: []
      },
      {
        id: uuidv4(),
        title: 'En cours',
        tasks: []
      },
      {
        id: uuidv4(),
        title: 'Terminé',
        tasks: []
      }
    ]
  };
};

const Tasks = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [board, setBoard] = useState<TaskBoard>(getInitialBoard);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [columnDialogOpen, setColumnDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingColumn, setEditingColumn] = useState<{ id: string; title: string } | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string>('');
  
  // Save board to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  }, [board]);
  
  const openAddTaskDialog = (columnId: string) => {
    setEditingTask(null);
    setActiveColumnId(columnId);
    setTaskDialogOpen(true);
  };
  
  const openEditTaskDialog = (task: Task) => {
    setEditingTask(task);
    const column = board.columns.find(col => 
      col.tasks.some(t => t.id === task.id)
    );
    if (column) {
      setActiveColumnId(column.id);
    }
    setTaskDialogOpen(true);
  };
  
  const openAddColumnDialog = () => {
    setEditingColumn(null);
    setColumnDialogOpen(true);
  };
  
  const openEditColumnDialog = (columnId: string, title: string) => {
    setEditingColumn({ id: columnId, title });
    setColumnDialogOpen(true);
  };
  
  const handleSaveTask = (task: Task) => {
    setBoard(prevBoard => {
      const newBoard = { ...prevBoard };
      const columnIndex = newBoard.columns.findIndex(col => col.id === activeColumnId);
      
      if (columnIndex !== -1) {
        const taskIndex = newBoard.columns[columnIndex].tasks.findIndex(t => t.id === task.id);
        
        if (taskIndex !== -1) {
          // Update existing task
          newBoard.columns[columnIndex].tasks[taskIndex] = task;
          toast({
            description: t('tasks.taskUpdated'),
          });
        } else {
          // Add new task
          newBoard.columns[columnIndex].tasks.push(task);
          toast({
            description: t('tasks.taskAdded'),
          });
        }
      }
      
      return newBoard;
    });
  };
  
  const handleDeleteTask = (taskId: string, columnId: string) => {
    setBoard(prevBoard => {
      const newBoard = { ...prevBoard };
      const columnIndex = newBoard.columns.findIndex(col => col.id === columnId);
      
      if (columnIndex !== -1) {
        newBoard.columns[columnIndex].tasks = newBoard.columns[columnIndex].tasks.filter(
          task => task.id !== taskId
        );
      }
      
      return newBoard;
    });
    
    toast({
      description: t('tasks.taskDeleted'),
    });
  };
  
  const handleSaveColumn = (columnId: string | null, title: string) => {
    setBoard(prevBoard => {
      const newBoard = { ...prevBoard };
      
      if (columnId) {
        // Update existing column
        const columnIndex = newBoard.columns.findIndex(col => col.id === columnId);
        if (columnIndex !== -1) {
          newBoard.columns[columnIndex].title = title;
          toast({
            description: t('tasks.columnUpdated'),
          });
        }
      } else {
        // Add new column
        newBoard.columns.push({
          id: uuidv4(),
          title,
          tasks: []
        });
        toast({
          description: t('tasks.columnAdded'),
        });
      }
      
      return newBoard;
    });
  };
  
  const handleDeleteColumn = (columnId: string) => {
    setBoard(prevBoard => {
      const newBoard = { ...prevBoard };
      newBoard.columns = newBoard.columns.filter(col => col.id !== columnId);
      return newBoard;
    });
    
    toast({
      description: t('tasks.columnDeleted'),
    });
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or if the item was dropped in the same place
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Find source and destination columns
    const sourceColumn = board.columns.find(col => col.id === source.droppableId);
    const destColumn = board.columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    // Find the task being moved
    const task = sourceColumn.tasks.find(task => task.id === draggableId);
    if (!task) return;

    setBoard(prevBoard => {
      const newBoard = { ...prevBoard };
      
      // Find column indices
      const sourceColumnIndex = newBoard.columns.findIndex(col => col.id === source.droppableId);
      const destColumnIndex = newBoard.columns.findIndex(col => col.id === destination.droppableId);
      
      if (sourceColumnIndex === -1 || destColumnIndex === -1) return prevBoard;
      
      // Create a new task object with updated status if moving between columns
      const newTask = { ...task };
      if (source.droppableId !== destination.droppableId) {
        // Update the task status based on the destination column
        if (destColumn.title === t('tasks.columns.todo')) {
          newTask.status = 'todo';
        } else if (destColumn.title === t('tasks.columns.inProgress')) {
          newTask.status = 'inProgress';
        } else if (destColumn.title === t('tasks.columns.done')) {
          newTask.status = 'done';
        }
      }
      
      // Remove from source
      newBoard.columns[sourceColumnIndex].tasks = newBoard.columns[sourceColumnIndex].tasks.filter(
        t => t.id !== draggableId
      );
      
      // Add to destination
      const newTasks = Array.from(newBoard.columns[destColumnIndex].tasks);
      newTasks.splice(destination.index, 0, newTask);
      newBoard.columns[destColumnIndex].tasks = newTasks;
      
      return newBoard;
    });

    toast({
      description: t('tasks.taskMoved'),
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SideNavigation />
      
      <main className="flex-1 flex flex-col">
        <div className="container py-6 flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold">{t('tasks.title')}</h1>
            <Button onClick={openAddColumnDialog}>
              <Plus className="mr-2 h-4 w-4" />
              {t('tasks.addColumn')}
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex gap-4 pb-6">
                {board.columns.length > 0 ? (
                  board.columns.map(column => (
                    <TaskColumn
                      key={column.id}
                      column={column}
                      onAddTask={openAddTaskDialog}
                      onEditTask={openEditTaskDialog}
                      onDeleteTask={handleDeleteTask}
                      onEditColumn={openEditColumnDialog}
                      onDeleteColumn={handleDeleteColumn}
                    />
                  ))
                ) : (
                  <div className="w-full flex justify-center items-center text-gray-500 p-8">
                    {t('tasks.emptyBoard')}
                  </div>
                )}
              </div>
            </DragDropContext>
          </ScrollArea>
        </div>
      </main>
      
      <TaskDialog
        isOpen={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        onSave={handleSaveTask}
        editingTask={editingTask}
        columnId={activeColumnId}
      />
      
      <ColumnDialog
        isOpen={columnDialogOpen}
        onClose={() => setColumnDialogOpen(false)}
        onSave={handleSaveColumn}
        editingColumn={editingColumn}
      />
    </div>
  );
};

export default Tasks;

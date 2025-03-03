
import { Alert } from '@/types';

export const getAlertOperations = (
  alerts: Alert[],
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>
) => {
  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => {
    const newAlert: Alert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };
    
    setAlerts(prev => [newAlert, ...prev]);
  };

  const markAlertAsRead = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  return {
    addAlert,
    markAlertAsRead,
    clearAllAlerts
  };
};

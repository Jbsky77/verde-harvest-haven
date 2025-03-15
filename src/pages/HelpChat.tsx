import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import SideNavigation from "@/components/SideNavigation";

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const HelpChat = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    setHasError(false);
    
    try {
      const { data, error } = await supabase.functions.invoke('deepseek-chat', {
        body: { 
          message, 
          chatHistory: chatHistory.map(msg => ({
            content: msg.content,
            isUser: msg.isUser
          }))
        }
      });
      
      if (error) {
        console.error("Supabase function error:", error);
        throw new Error("Failed to send a request to the Edge Function");
      }
      
      if (!data || !data.response) {
        throw new Error("Invalid response from assistant");
      }
      
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setHasError(true);
      toast.error(t('helpChat.error'));
      
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: t('helpChat.errorResponse'),
        isUser: false,
        timestamp: new Date(),
      };
      
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SideNavigation />
      
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <Card className="shadow-md h-[80vh] flex flex-col">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Bot className="h-6 w-6" />
              {t('helpChat.title')}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
            {hasError && (
              <Alert variant="destructive" className="m-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('helpChat.error')}</AlertTitle>
                <AlertDescription>
                  {t('helpChat.errorResponse')}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex-1 overflow-y-auto p-6">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Bot className="h-12 w-12 mb-4 text-primary opacity-50" />
                  <p className="text-center">{t('helpChat.startPrompt')}</p>
                </div>
              ) : (
                chatHistory.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`mb-4 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.isUser 
                          ? 'bg-primary text-primary-foreground ml-4' 
                          : 'bg-muted mr-4'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {msg.isUser ? (
                          <>
                            <span className="font-medium">{t('helpChat.you')}</span>
                            <User className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <Bot className="h-4 w-4" />
                            <span className="font-medium">{t('helpChat.assistant')}</span>
                          </>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <div className="text-xs opacity-70 mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form 
              onSubmit={handleSendMessage} 
              className="p-4 border-t bg-card flex gap-2 items-center"
            >
              <Input
                placeholder={t('helpChat.messagePlaceholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !message.trim()}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpChat;

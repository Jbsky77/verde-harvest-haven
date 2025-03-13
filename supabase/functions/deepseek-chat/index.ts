
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, chatHistory } = await req.json();
    
    console.log("Received request with message:", message);
    console.log("Chat history length:", chatHistory?.length || 0);

    if (!deepseekApiKey) {
      console.error("Missing DEEPSEEK_API_KEY environment variable");
      throw new Error("API configuration error");
    }

    // Format the chat history for Deepseek
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant for a cultivation app. You answer questions about plant cultivation, growing techniques, and app functionality. Keep answers concise and informative.'
      }
    ];

    // Add chat history if it exists
    if (chatHistory && chatHistory.length > 0) {
      chatHistory.forEach(msg => {
        messages.push({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        });
      });
    }

    // Add the current message
    messages.push({
      role: 'user',
      content: message
    });

    console.log("Sending request to Deepseek API");
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Deepseek API responded with status ${response.status}:`, errorText);
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Received response from Deepseek API");
    
    if (data.error) {
      console.error("Deepseek API error:", data.error);
      throw new Error(data.error.message || "Error from Deepseek API");
    }

    const assistantResponse = data.choices?.[0]?.message?.content || '';

    return new Response(JSON.stringify({ response: assistantResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in deepseek-chat function:', error);
    return new Response(JSON.stringify({ error: error.message || String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

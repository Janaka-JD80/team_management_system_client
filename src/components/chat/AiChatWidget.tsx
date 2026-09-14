import { useState, useRef, useEffect } from 'react';
import { useAiChat } from '@/hooks/useAiQueries';
import { MessageCircle, X, Send, Bot, User, Loader2, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hi there! I am your AI assistant. You can ask me questions about team activity, blockers, or request a summary of recent reports.' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const aiChat = useAiChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, aiChat.isPending]);

  const handleSend = async () => {
    if (!input.trim() || aiChat.isPending) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await aiChat.mutateAsync({ message: userMessage });
      setMessages(prev => [...prev, { role: 'ai', content: response.reply }]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error while trying to respond. Please try again.' }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 z-50 flex items-center justify-center p-0"
          title="Open AI Assistant"
        >
          <MessageCircle className="w-6 h-6 text-primary-foreground" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`fixed z-50 flex flex-col shadow-2xl animate-in fade-in duration-300 border-primary/20 ${
          isFullScreen 
            ? 'inset-0 w-full h-full rounded-none slide-in-from-bottom-0' 
            : 'bottom-6 right-6 w-[380px] h-[550px] rounded-xl slide-in-from-bottom-5'
        }`}>
          <CardHeader className={`p-4 border-b bg-primary text-primary-foreground flex flex-row items-center justify-between space-y-0 ${isFullScreen ? '' : 'rounded-t-lg'}`}>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI Assistant
            </CardTitle>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full w-8 h-8 p-0"
                >
                  {isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
          
          <CardContent className="p-0 flex flex-col flex-1 overflow-hidden bg-slate-50/50">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-white border text-primary'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div 
                    className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-white border rounded-tl-sm text-slate-700 leading-relaxed'
                    }`}
                  >
                    {msg.role === 'ai' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                          li: ({ node, ...props }) => <li className="" {...props} />,
                          h1: ({ node, ...props }) => <h1 className="text-lg font-bold mt-4 mb-2" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-3 mb-2" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-4 border rounded-md">
                              <table className="w-full text-sm text-left border-collapse" {...props} />
                            </div>
                          ),
                          thead: ({ node, ...props }) => <thead className="bg-slate-100/50 border-b" {...props} />,
                          tbody: ({ node, ...props }) => <tbody className="divide-y" {...props} />,
                          tr: ({ node, ...props }) => <tr className="hover:bg-slate-50/50 transition-colors" {...props} />,
                          th: ({ node, ...props }) => <th className="px-4 py-2 font-medium text-slate-700 border-r last:border-r-0" {...props} />,
                          td: ({ node, ...props }) => <td className="px-4 py-2 border-r last:border-r-0" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              
              {aiChat.isPending && (
                <div className="flex gap-3 max-w-[85%] mr-auto">
                  <div className="w-8 h-8 rounded-full bg-white border text-primary flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 bg-white border rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t mt-auto flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about team activity..."
                className="flex-1 rounded-full px-4 focus-visible:ring-primary/20 bg-slate-50"
                disabled={aiChat.isPending}
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || aiChat.isPending}
                size="icon"
                className="rounded-full shrink-0 shadow-sm"
              >
                {aiChat.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

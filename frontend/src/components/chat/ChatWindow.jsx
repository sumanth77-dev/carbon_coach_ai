import React, { useState, useEffect, useRef } from 'react';
import { Bot, Plus, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { ChatWelcome } from './ChatWelcome';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Button } from '../common/Button';
import { chatService } from '../../services/chatService';

/**
 * Complete Conversational AI Assistant Chat Window
 */
export const ChatWindow = () => {
  const [sessionId, setSessionId] = useState(() => chatService.getSessionId());
  const [messages, setMessages] = useState(() => chatService.getStoredMessages(sessionId));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Sync messages to session storage on change
  useEffect(() => {
    chatService.saveStoredMessages(sessionId, messages);
  }, [messages, sessionId]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (text) => {
    setErrorMessage('');
    const userTimestamp = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date());

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: userTimestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await chatService.sendMessage(text, sessionId);
      const aiResponse = data.response;

      setMessages((prev) => [
        ...prev,
        {
          id: aiResponse.id || `bot-${Date.now()}`,
          sender: 'assistant',
          content: aiResponse.content,
          type: aiResponse.type || 'conversation',
          calculation: aiResponse.calculation,
          followUpQuestion: aiResponse.followUpQuestion,
          recommendationsList: aiResponse.recommendationsList,
          summaryData: aiResponse.summaryData,
          timestamp: aiResponse.timestamp || userTimestamp,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: err.message || 'Error communicating with AI assistant.',
          isError: true,
          failedText: text,
          timestamp: userTimestamp,
        },
      ]);
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryMessage = (failedMsg) => {
    if (failedMsg.failedText) {
      // Remove error message and retry
      setMessages((prev) => prev.filter((m) => m.id !== failedMsg.id));
      handleSendMessage(failedMsg.failedText);
    }
  };

  const handleNewConversation = () => {
    const newId = chatService.resetSessionId();
    setSessionId(newId);
    setMessages([]);
    setErrorMessage('');
  };

  return (
    <div className="flex flex-col h-[680px] bg-surface border border-border rounded-xl shadow-subtle overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 py-3 sm:px-6 bg-surface border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center shadow-subtle">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-text-main">AI Carbon Assistant</h3>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Online
              </span>
            </div>
            <p className="text-[11px] text-text-secondary">
              Session: <span className="font-mono">{sessionId.slice(-8)}</span> • Google ADK & Gemini
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleNewConversation}
            icon={Plus}
          >
            New Conversation
          </Button>
        </div>
      </div>

      {/* Messages Feed or Welcome Screen */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-background/40">
        {messages.length === 0 ? (
          <ChatWelcome onSelectPrompt={handleSendMessage} />
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} onRetry={handleRetryMessage} />
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-3 max-w-[80%] mr-auto">
                <div className="w-8 h-8 rounded-full bg-secondary/30 text-primary-dark border border-secondary/40 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-xl bg-surface border border-border shadow-subtle rounded-tl-none flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-text-secondary ml-1 font-medium">
                    Analyzing activity...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input Bar */}
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

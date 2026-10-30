import React, { useState, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Chat Input component supporting multiline input, Enter to send, Shift+Enter for new line.
 */
export const ChatInput = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading) return;

    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    // Dynamic autosize up to 120px
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-surface border-t border-border">
      <div className="flex items-end gap-2 bg-background border border-border rounded-lg p-2 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question, log a daily activity, or request advice (Enter to send, Shift+Enter for new line)..."
          disabled={isLoading}
          className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm text-text-main placeholder-text-secondary focus:outline-none max-h-32 leading-relaxed py-1 px-1.5"
        />

        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!text.trim() || isLoading}
          icon={isLoading ? Loader2 : Send}
          className="shrink-0 rounded-md"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
        </Button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-text-secondary mt-2 px-1">
        <span>Powered by Gemini & Google ADK</span>
        <span className="hidden sm:inline">Shift + Enter for new line</span>
      </div>
    </form>
  );
};

import React from 'react';
import { Bot, Sparkles, ShieldCheck } from 'lucide-react';
import { ChatWindow } from '../components/chat/ChatWindow';

/**
 * AI Assistant Page
 */
export const ChatPage = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8">
      {/* Page Header */}
      <div className="border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
                AI Assistant
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                Your personal guide to understanding and reducing your carbon footprint.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-background border border-border text-text-secondary">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Verified GHG Factors
            </span>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <ChatWindow />
    </div>
  );
};

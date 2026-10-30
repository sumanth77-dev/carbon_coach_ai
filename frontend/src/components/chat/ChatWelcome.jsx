import React from 'react';
import { Sparkles, ArrowRight, Activity, Zap, Compass, Flame } from 'lucide-react';

const SUGGESTIONS = [
  { text: 'Log my daily activities.', icon: Activity },
  { text: 'Calculate my transportation emissions.', icon: Compass },
  { text: 'How much carbon did I produce this week?', icon: Flame },
  { text: 'How can I reduce my carbon footprint?', icon: Sparkles },
  { text: 'Analyze my electricity consumption.', icon: Zap },
];

/**
 * Chat Welcome Screen when no messages exist in the conversation.
 */
export const ChatWelcome = ({ onSelectPrompt }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 sm:p-10 max-w-xl mx-auto my-auto">
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-subtle">
        <Sparkles className="w-6 h-6" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
        Understand your impact. Make a difference.
      </h2>
      <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
        Tell me about your daily activities, and I'll help you understand their environmental impact.
      </p>

      {/* Suggested prompts list */}
      <div className="w-full mt-6 space-y-2 text-left">
        <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-2 text-center">
          Suggested Conversation Starters
        </p>
        {SUGGESTIONS.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => onSelectPrompt(item.text)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-surface border border-border text-xs text-text-main hover:border-primary/40 hover:bg-background transition-all group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-6 h-6 rounded bg-background flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="font-medium truncate">{item.text}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-text-secondary group-hover:text-primary shrink-0 transition-transform group-hover:translate-x-0.5" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

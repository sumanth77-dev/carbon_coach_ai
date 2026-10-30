import React, { useState } from 'react';
import { Bot, User, Copy, Check, AlertCircle, RotateCw, Sparkles, HelpCircle, Leaf } from 'lucide-react';
import { Badge } from '../common/Badge';

/**
 * Chat Message component supporting structured responses:
 * calculations, missing information follow-ups, summaries, recommendations, and standard text.
 */
export const ChatMessage = ({ message, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';
  const isError = message.isError;

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold shadow-subtle ${
          isUser
            ? 'bg-primary text-white'
            : 'bg-secondary/30 text-primary-dark border border-secondary/40'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble Content */}
      <div className="space-y-1.5 min-w-0">
        <div
          className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
            isUser
              ? 'bg-primary text-white rounded-tr-none'
              : isError
              ? 'bg-red-50 border border-red-200 text-red-900 rounded-tl-none'
              : 'bg-surface border border-border text-text-main shadow-subtle rounded-tl-none'
          }`}
        >
          {/* Main message text */}
          <div className="whitespace-pre-wrap">{message.content}</div>

          {/* Structured Calculation Result Card */}
          {message.calculation && (
            <div className="mt-3 p-3 bg-background rounded-lg border border-border/80 text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-1.5 font-semibold text-text-main">
                  <Leaf className="w-3.5 h-3.5 text-primary" />
                  <span>{message.calculation.activityName}</span>
                </div>
                <Badge variant="success" size="sm">
                  {message.calculation.category}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-text-secondary block">Input Quantity:</span>
                  <span className="font-mono font-medium text-text-main">
                    {message.calculation.quantity}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary block">Calculated Emissions:</span>
                  <span className="font-mono font-bold text-primary">
                    {message.calculation.emissions} {message.calculation.unit || 'kg CO₂e'}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary block">Emission Factor:</span>
                  <span className="font-mono text-text-main">
                    {message.calculation.emissionFactor}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary block">Factor Source:</span>
                  <span className="text-text-main truncate">
                    {message.calculation.source || 'DEFRA 2024'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Distinct Actionable Reduction Tip Highlight */}
          {message.reductionTip && (
            <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-primary uppercase text-[10px] tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personalized Reduction Tip</span>
              </div>
              <p className="text-text-main font-medium leading-relaxed">
                {message.reductionTip}
              </p>
            </div>
          )}

          {/* Missing Information Follow-up Highlight */}
          {message.type === 'missing_info' && message.followUpQuestion && (
            <div className="mt-3 p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-md text-xs text-amber-900 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Follow-up details needed:</span>
                <p className="mt-0.5">{message.followUpQuestion}</p>
              </div>
            </div>
          )}

          {/* Recommendations List format */}
          {message.recommendationsList && (
            <div className="mt-3 space-y-2 pt-2 border-t border-border/60">
              {message.recommendationsList.map((rec, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded bg-background border border-border flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-text-main block">{rec.title}</span>
                    <span className="text-[11px] text-primary font-medium">
                      Est. Savings: {rec.savings}
                    </span>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {rec.difficulty}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Footer Actions & Timestamp */}
        <div
          className={`flex items-center gap-2 text-[10px] text-text-secondary px-1 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <span>{message.timestamp}</span>

          {!isUser && !isError && (
            <button
              onClick={handleCopy}
              title="Copy response"
              className="hover:text-text-main transition-colors p-0.5"
            >
              {copied ? (
                <Check className="w-3 h-3 text-primary inline" />
              ) : (
                <Copy className="w-3 h-3 inline" />
              )}
            </button>
          )}

          {isError && onRetry && (
            <button
              onClick={() => onRetry(message)}
              className="text-red-700 hover:text-red-900 font-medium inline-flex items-center gap-1 ml-2"
            >
              <RotateCw className="w-3 h-3" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

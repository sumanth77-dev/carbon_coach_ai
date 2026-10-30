import { adkService } from '../services/adkService.js';

/**
 * Handle AI Assistant conversation
 * Forwards requests to the Python Google ADK + Gemini agent
 */
export const handleChatMessage = async (req, res, next) => {
  try {
    const { message, session_id } = req.body;
    const userId = req.user?.id || req.user?._id || 'default_user';
    const currentSessionId = session_id || `session-${Date.now()}`;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message text is required.',
      });
    }

    const trimmedMsg = message.trim();
    const timestamp = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date());

    try {
      // Forward directly to the Python Google ADK Agent
      const adkResult = await adkService.queryAgent(trimmedMsg, userId, currentSessionId);

      if (adkResult && (adkResult.reply || adkResult.status === 'success')) {
        const replyText = adkResult.reply || 'Activity processed by Carbon Coach agent.';

        // Parse structured calculation metrics from ADK tool output in the reply if present
        let calculation = null;
        let responseType = 'conversation';
        let followUpQuestion = null;

        const emissionMatch = replyText.match(/(?:Total Emissions|Calculated Emissions|calculated.*?emissions?|emissions?):\s*\*?\*?([\d.]+)\s*kg\s*CO2e/i);
        const formulaMatch = replyText.match(/\*\*Formula:\*\*\s*(.+)/i);
        const factorMatch = replyText.match(/\*\*Emission Factor:\*\*\s*(.+)/i);
        const sourceMatch = replyText.match(/\*\*Source:\*\*\s*(.+)/i);

        if (emissionMatch) {
          responseType = 'calculation';
          calculation = {
            activityName: trimmedMsg.length < 35 ? trimmedMsg : 'Logged Activity',
            category: 'Calculated Activity',
            quantity: 'Logged',
            emissions: parseFloat(emissionMatch[1]),
            unit: 'kg CO₂e',
            emissionFactor: factorMatch ? factorMatch[1].trim() : 'Verified Tool Factor',
            formula: formulaMatch ? formulaMatch[1].trim() : undefined,
            source: sourceMatch ? sourceMatch[1].trim() : 'Google ADK Python Tools',
          };
        } else if (replyText.includes('?') && (replyText.toLowerCase().includes('missing') || replyText.toLowerCase().includes('how many') || replyText.toLowerCase().includes('which mode'))) {
          responseType = 'missing_info';
          followUpQuestion = replyText;
        }

        let reductionTip = null;
        const tipMatch = replyText.match(/(?:\*\*Reduction Tip:\*\*|\*\*Actionable Tip:\*\*|\*\*Recommendation:\*\*|\*\*Tip:\*\*)\s*([^\n\r]+(?:\n[^\n\r*]+)*)/i);
        if (tipMatch) {
          reductionTip = tipMatch[1].trim();
        } else if (calculation) {
          // If a calculation was performed, fetch a verified reduction tip from the Python engine
          try {
            const tipData = await adkService.getReductionTipForActivity({
              category: calculation.category,
              activity: calculation.activityName,
              quantity: 1,
              kg_co2e: calculation.emissions,
            });
            if (tipData) {
              reductionTip = `${tipData.title}: ${tipData.action}`;
            }
          } catch {
            // Secondary tip enrichment is non-blocking
          }
        }

        return res.status(200).json({
          success: true,
          session_id: adkResult.session_id || currentSessionId,
          response: {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            type: responseType,
            content: replyText,
            calculation,
            reductionTip,
            followUpQuestion,
            timestamp,
          },
          source: 'python_google_adk',
        });
      }
    } catch (adkErr) {
      console.warn('[ChatController] Python ADK service query failed:', adkErr.message);

      return res.status(503).json({
        success: false,
        message: 'The Python Google ADK agent service is unavailable. Please ensure the Python service is running on port 8080.',
        error: adkErr.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Unexpected empty response from Google ADK agent.',
    });
  } catch (error) {
    next(error);
  }
};

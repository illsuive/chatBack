import aj from '../utils/arcjet.js';
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetMiddleware = async (req, res, next) => {
    try {
        const protectReq = process.env.NODE_ENV !== 'production' ? { ...req, ip: '8.8.8.8' } : req;
        
        const decision = await aj.protect(protectReq);
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ message: 'Too many requests', success: false });
            }
            
            if (decision.reason.isBot()) {
                const botResult = decision.results.find(r => r.reason.isBot());
                if (botResult && isSpoofedBot(botResult)) {
                    return res.status(403).json({ message: 'Access denied. You are a spoofed bot.', success: false });
                }
                
                return res.status(403).json({ message: 'Access denied. You are a bot.', success: false });
            }
            
            return res.status(403).json({ message: 'Access denied.', success: false });
        }
        const hasSpoofedBot = decision.results.some((result) => isSpoofedBot(result));
        if (hasSpoofedBot) {
            return res.status(403).json({ message: 'Access denied. Spoofed bot detected.', success: false });
        }
        
        // Everything passed, proceed to the controller
        next();
    } catch (error) {
        console.error("Arcjet error:", error);
        return res.status(500).json({ message: "Internal server error protection layer.", success: false });
    }
};
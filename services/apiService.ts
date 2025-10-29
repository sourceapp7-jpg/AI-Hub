import { GoogleGenAI } from '@google/genai';
import { Message, ImageAttachment } from '../types';

// --- API Helper Function ---

const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 3): Promise<any> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response.json();
      }
      if (response.status === 429 || response.status >= 500) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      const errorText = await response.text();
      throw new Error(`API returned status ${response.status}: ${errorText}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
  throw new Error("Fetch failed after all retries.");
};

// --- Gemini API ---

export const getGeminiResponse = async (
  conversationHistory: Message[],
  apiKey: string,
  isInitialQuery: boolean,
  imageAttachment: ImageAttachment | null
): Promise<string> => {
  if (!apiKey || apiKey.includes('YOUR_')) {
    return `[Gemini Error] API key not set. Get your free key at https://aistudio.google.com/app/apikey`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // FIX: Construct parts with both text and image for the first message if an image is present.
    // This resolves the TypeScript error by ensuring the 'parts' array can contain different object shapes.
    const contents = conversationHistory.map((msg, index) => {
        const role = msg.role === 'user' ? 'user' : 'model';

        if (index === 0 && isInitialQuery && imageAttachment) {
            return {
                role,
                parts: [
                    { text: msg.content },
                    {
                        inlineData: {
                            mimeType: imageAttachment.mimeType,
                            data: imageAttachment.data,
                        },
                    },
                ],
            };
        }
        return { role, parts: [{ text: msg.content }] };
    });

    // FIX: Per @google/genai guidelines, systemInstruction and tools should be inside the config object.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents as any, // Cast because SDK type is slightly more complex
        config: {
            tools: isInitialQuery && !imageAttachment ? [{ googleSearch: {} }] : undefined,
            systemInstruction: "You are a concise, helpful, and friendly AI assistant.",
        },
    });
    
    const text = response.text;
    if (text) {
        return text;
    }

    // Check for safety blocks
    const safetyReason = response.candidates?.[0]?.finishReason;
    if (safetyReason && safetyReason !== 'STOP') {
        return `[Gemini Error] Response blocked: ${safetyReason}. Try rephrasing your prompt.`;
    }
    
    throw new Error("Invalid response structure from Gemini API.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `[Gemini Error] ${error.message}`;
  }
};


// --- ChatGPT API ---

export const getChatGPTResponse = async (
  conversationHistory: Message[],
  apiKey: string,
  imageAttachment: ImageAttachment | null
): Promise<string> => {
  if (!apiKey || apiKey.includes('YOUR_')) {
    return `[ChatGPT Error] API key not set. Get your key at https://platform.openai.com/api-keys`;
  }

  const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

  try {
    const messages = conversationHistory.map((msg, idx) => {
      if (idx === 0 && msg.role === 'user' && imageAttachment) {
        return {
          role: "user",
          content: [
            { type: "text", text: msg.content || "Analyze this image." },
            { type: "image_url", image_url: { url: `data:${imageAttachment.mimeType};base64,${imageAttachment.data}` } }
          ]
        };
      } else {
        return { role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content };
      }
    });

    const payload = {
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are ChatGPT, a helpful and creative assistant that can process both text and images." },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1024,
    };

    const result = await fetchWithRetry(OPENAI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(payload),
    });

    const text = result?.choices?.[0]?.message?.content;
    if (!text) {
      if (result.error) return `[ChatGPT Error] ${result.error.message}`;
      throw new Error("Invalid response structure from OpenAI API.");
    }
    return text;
  } catch (error: any) {
    console.error("ChatGPT API Error:", error);
    return `[ChatGPT Error] ${error.message}`;
  }
};

// --- Grok API ---

export const getGrokResponse = async (conversationHistory: Message[], apiKey: string): Promise<string> => {
  if (!apiKey || apiKey.includes('YOUR_')) {
    return `[Grok Error] API key not set. Get your key at https://console.x.ai`;
  }
  const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

  try {
    const messages = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    const payload = {
      model: 'grok-1.5-flash', // Updated to a more recent model
      messages: [
        { role: 'system', content: 'You are Grok, a helpful and maximally truthful AI built by xAI.' },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1024,
    };

    const result = await fetchWithRetry(GROK_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify(payload)
    });

    const text = result?.choices?.[0]?.message?.content;
    if (!text) {
      if (result.error) return `[Grok Error] ${result.error.message}`;
      throw new Error("Invalid response structure from Grok API.");
    }
    return text;
  } catch (error: any) {
    console.error("Grok API Error:", error);
    return `[Grok Error] ${error.message}`;
  }
};

// --- Claude API ---

export const getClaudeResponse = async (conversationHistory: Message[], apiKey: string): Promise<string> => {
  if (!apiKey || apiKey.includes('YOUR_')) {
    return `[Claude Error] API key not set. Get your key at https://console.anthropic.com`;
  }
  const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

  try {
    const messages = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
    
    const payload = {
      model: 'claude-3-5-sonnet-20240620', // Using latest Sonnet model
      messages,
      max_tokens: 1024,
      temperature: 0.7,
      system: "You are Claude, a helpful, honest, and harmless AI assistant created by Anthropic."
    };

    const result = await fetchWithRetry(CLAUDE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(payload)
    });

    const text = result?.content?.[0]?.text;
    if (!text) {
      if (result.error) return `[Claude Error] ${result.error.message}`;
      throw new Error("Invalid response structure from Claude API.");
    }
    return text;
  } catch (error: any) {
    console.error("Claude API Error:", error);
    return `[Claude Error] ${error.message}`;
  }
};

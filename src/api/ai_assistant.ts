import { http } from '@/lib/http';
import type { ChatRequest, ChatResponse } from '@/types/ai_assistant';

export const aiAssistantApi = {
  sendMessage: async (data: ChatRequest) => {
    const response = await http.post<ChatResponse>('/ai/chat', data);
    return response.data;
  },
};

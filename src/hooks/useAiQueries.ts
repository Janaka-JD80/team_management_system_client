import { useMutation } from '@tanstack/react-query';
import { aiAssistantApi } from '@/api/ai_assistant';
import type { ChatRequest } from '@/types/ai_assistant';

export function useAiChat() {
  return useMutation({
    mutationFn: (data: ChatRequest) => aiAssistantApi.sendMessage(data),
  });
}

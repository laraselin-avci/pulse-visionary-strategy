
import * as z from 'zod';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const chatSchema = z.object({
  message: z.string().min(1, "Please enter a message")
});

export type ChatFormValues = z.infer<typeof chatSchema>;

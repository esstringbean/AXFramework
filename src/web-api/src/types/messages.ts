import { IdSchema } from '@/local/other.js';
import { z } from 'zod';

import { baseChatReq } from './chats.js';

export const listChatMessagesRes = z
  .strictObject({
    agent: z
      .strictObject({
        id: IdSchema,
        name: z.string()
      })
      .optional(),
    blocks: z
      .strictObject({
        content: z.string().optional(),
        lang: z.string().optional(),
        text: z.string().optional(),
        type: z.enum(['code', 'html'])
      })
      .array()
      .optional(),
    chatId: IdSchema,
    createdAt: z.coerce.date(),
    error: z.string().optional(),
    files: z
      .strictObject({
        id: z.string(),
        name: z.string(),
        size: z.number(),
        type: z.enum(['image', 'document']),
        url: z.string().url()
      })
      .array()
      .optional(),
    id: IdSchema,
    mentions: z
      .strictObject({
        agentId: IdSchema
      })
      .array()
      .optional(),
    parentId: IdSchema.optional(),
    processing: z.boolean().optional(),
    text: z.string().optional(),
    threadId: IdSchema.optional(),
    updatedAt: z.coerce.date().optional(),
    user: z.strictObject({
      id: IdSchema,
      name: z.string(),
      picture: z.string().optional()
    })
  })
  .array();

export type ListChatMessagesRes = z.infer<typeof listChatMessagesRes>;

export type GetChatMessageRes = ListChatMessagesRes[0];

export const createUpdateChatMessageReq = baseChatReq.extend({
  messageId: z.string().optional()
});

export type CreateUpdateChatMessageReq = z.infer<
  typeof createUpdateChatMessageReq
>;

export const updateChatMessageReq = z.strictObject({
  responseId: z.string()
});

export type UpdateChatMessageReq = z.infer<typeof updateChatMessageReq>;

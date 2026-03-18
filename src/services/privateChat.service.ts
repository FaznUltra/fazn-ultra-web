import { apiClient } from '@/lib/axios';

export interface PrivateChatMessage {
  senderId: string;
  senderUsername: string;
  message: string;
  type: 'TEXT' | 'ROOM_CODE' | 'SYSTEM';
  timestamp: Date;
  isDeleted: boolean;
}

export const privateChatService = {
  // Get private chat messages
  getPrivateChatMessages: async (challengeId: string) => {
    const response = await apiClient.get(`/private-chat/${challengeId}/messages`);
    return response.data;
  },

  // Send private chat message
  sendPrivateChatMessage: async (
    challengeId: string, 
    message: string, 
    type: 'TEXT' | 'ROOM_CODE' | 'SYSTEM' = 'TEXT'
  ) => {
    const response = await apiClient.post(`/private-chat/${challengeId}/messages`, { 
      message, 
      type 
    });
    return response.data;
  },

  // Share room code via private chat
  shareRoomCodeViaChat: async (challengeId: string, roomCode: string) => {
    const response = await apiClient.post(`/private-chat/${challengeId}/room-code`, { 
      roomCode 
    });
    return response.data;
  }
};

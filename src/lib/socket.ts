import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
};

export const connectSocket = (token: string) => {
  const socketInstance = getSocket();
  
  if (!socketInstance.connected) {
    socketInstance.auth = { token };
    socketInstance.connect();
  }
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const joinChatRoom = (challengeId: string) => {
  const socketInstance = getSocket();
  socketInstance.emit('joinPrivateChat', { challengeId });
};

export const leaveChatRoom = (challengeId: string) => {
  const socketInstance = getSocket();
  socketInstance.emit('leavePrivateChat', { challengeId });
};

export const sendChatMessage = (challengeId: string, message: string, type: 'TEXT' | 'ROOM_CODE' | 'SYSTEM' = 'TEXT') => {
  const socketInstance = getSocket();
  socketInstance.emit('sendPrivateMessage', { challengeId, message, type });
};

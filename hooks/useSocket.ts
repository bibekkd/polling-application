'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '@/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket<SocketEvents> | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      setError(`Connection error: ${err.message}`);
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const emit = <T extends keyof SocketEvents>(
    event: T,
    ...args: Parameters<SocketEvents[T]>
  ) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, ...args);
    }
  };

  const on = <T extends keyof SocketEvents>(
    event: T,
    callback: SocketEvents[T]
  ) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback as any);
    }
  };

  const off = <T extends keyof SocketEvents>(event: T) => {
    if (socketRef.current) {
      socketRef.current.off(event);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    error,
    emit,
    on,
    off,
  };
}; 
declare module 'socket.io-client' {
  import { Manager } from 'socket.io-client/build/manager';
  import { Socket as SocketClass } from 'socket.io-client/build/socket';
  
  export const io: {
    (uri: string, opts?: any): SocketClass;
    (opts?: any): SocketClass;
    connect: (uri: string, opts?: any) => SocketClass;
    Manager: typeof Manager;
    Socket: typeof SocketClass;
  };
  
  export { Manager } from 'socket.io-client/build/manager';
  export { Socket } from 'socket.io-client/build/socket';
}
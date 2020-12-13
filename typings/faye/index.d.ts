declare module 'faye' {
  export class Subscription extends Promise<void> {
    cancel(): void;
    unsubscribe(): void;
    withChannel(callback: (channel: string, message: any) => void): void;
  }
  export class Client {
    constructor(url: string, options?: {});
    setHeader(name: string, value: string): void;
    addExtension(ext: any): void;
    subscribe(channelName: string, listener?: Function): Subscription;
    unsubscribe(channelName: string, subscr: Subscription): void;
  }
  const Faye: { Client: typeof Client };
  export default Faye;
}

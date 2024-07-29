import { useEffect, useState } from 'react';
import pusher from '../lib/pusher';

const usePusherChannel = (channelName: string, eventName: string) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const channel = pusher.subscribe(channelName);

    channel.bind(eventName, (newData: any) => {
      setData(newData);
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventName]);

  return data;
};

export default usePusherChannel;

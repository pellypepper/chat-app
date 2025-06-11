import { useEffect } from 'react';
import { useFriendsStore } from '@/store/friendStore';

// You will need access to your socket instance
import { socket } from '@/utils/socket'; // <-- Adjust path as needed

export function useListenOnlineFriends() {
  const fetchOnlineFriends = useFriendsStore(state => state.fetchOnlineFriends);

  useEffect(() => {
    if (!socket) return;

    const handleStatusChange = () => {
      fetchOnlineFriends(); // Re-fetch from the backend
    };

    socket.on('user_online', handleStatusChange);
    socket.on('user_offline', handleStatusChange);

    // Optionally, listen for 'user_away' or other status events

    return () => {
      socket.off('user_online', handleStatusChange);
      socket.off('user_offline', handleStatusChange);
    };
  }, [fetchOnlineFriends]);
}
export const friendService = {
  addFriend: (userId: number): Promise<void> => {
    console.log(`Adding friend with ID: ${userId}`);
    // In a real app, this would make an API call
    return Promise.resolve();
  },

  removeFriend: (userId: number): Promise<void> => {
    console.log(`Removing friend with ID: ${userId}`);
    // In a real app, this would make an API call
    return Promise.resolve();
  },

  sendMessage: (userId: number): Promise<void> => {
    console.log(`Opening message with user ID: ${userId}`);
    // In a real app, this would navigate to messages or open a chat
    return Promise.resolve();
  }
};


export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  profilePicture?: string;

}

export type Story = {
userId: number;
 stories: Array<{
    id: number,
    content: string,
    type: 'text' | 'image',
    createdAt: string,
    expiresAt: string
  }>;
  type: 'text' | 'image';
  createdAt: string;
  expiresAt: string;
  firstname: string;
  lastname: string;
   
}

export interface Friend {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

export type TabType = 'all' | 'online' | 'friends';



export type Chat = {
  id: number;
  name: string;
  isGroup: boolean;
  participants: { id: number, name:string }[];
  avatar?: string;
lastMessage?: string;
lastMessageAt?: string;
};

export type Message = {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  createdAt: string;
  type?: 'text' | 'image';
};


export type Conversations= {
        id: number;
        avatar: string;
        name: string;
        message: string;
        time: string;
        unread: number;
        online?: boolean;
        active?: boolean;
    };


export type profile = {
  firstname: string;
  lastname: string;
  email: string;
}
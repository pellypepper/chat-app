export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;

}

export type TabType = 'all' | 'online' | 'friends';

export type Chat = {
  id: number;
  name: string;
   participants: { id: number }[];
  message: string;
  time: string;
};

export type Conversations= {
        id: string;
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
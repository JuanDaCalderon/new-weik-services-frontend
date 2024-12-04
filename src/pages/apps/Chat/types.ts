export type ChatUser = {
  id: number;
  name: string;
  avatar: string;
  lastMessage?: string;
  totalUnread?: number;
  lastMessageOn?: string;
  email: string;
  phone: string;
  location: string;
  languages: string;
  groups: string;
};

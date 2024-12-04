import {ChatUser} from './types';
import avatar2 from '@/assets/images/users/avatar-2.jpg';
import avatar3 from '@/assets/images/users/avatar-3.jpg';
import avatar4 from '@/assets/images/users/avatar-4.jpg';
import avatar5 from '@/assets/images/users/avatar-5.jpg';
import avatar6 from '@/assets/images/users/avatar-6.jpg';
import avatar7 from '@/assets/images/users/avatar-7.jpg';
import avatar8 from '@/assets/images/users/avatar-8.jpg';
import avatar9 from '@/assets/images/users/avatar-9.jpg';

export const users: ChatUser[] = [
  {
    id: 1,
    name: 'Brandon Smith',
    avatar: avatar2,
    lastMessage: 'How are you today?',
    totalUnread: 3,
    lastMessageOn: '4:30am',
    email: 'support@coderthemes.com',
    phone: '+1 456 9595 9594',
    location: 'California, USA',
    languages: 'English, German, Spanish',
    groups: 'Work, Favourties'
  },
  {
    id: 2,
    name: 'Maria C',
    avatar: avatar5,
    lastMessage: "Hey! a reminder for tomorrow's meeting?",
    lastMessageOn: '5:30am',
    email: 'support@coderthemes.com',
    phone: '+1 456 9595 9594',
    location: 'New York, USA',
    languages: 'English, German, Spanish',
    groups: 'Work, Friends'
  },
  {
    id: 3,
    name: 'Dominic A',
    avatar: avatar4,
    lastMessage: "Are we going to have this week's planning meeting?",
    totalUnread: 2,
    lastMessageOn: 'Thu',
    email: 'support@coderthemes.com',
    phone: '+1 456 9595 9594',
    location: 'New Jersey, USA',
    languages: 'English, German, Spanish',
    groups: 'Work, Favourties'
  },
  {
    id: 4,
    name: 'Ronda D',
    avatar: avatar9,
    lastMessage: 'Please check these design assets..',
    lastMessageOn: 'Wed',
    email: 'support@coderthemes.com',
    phone: '+1 456 9595 9594',
    location: 'California, USA',
    languages: 'English, German, Spanish',
    groups: 'Work, Friends'
  },
  {
    id: 5,
    name: 'Michael H',
    avatar: avatar6,
    lastMessage: 'Are you free for 15 mins? I would like to discuss something',
    totalUnread: 6,
    lastMessageOn: 'Tue',
    email: 'support@coderthemes.com',
    phone: '+1 456 9595 9594',
    location: 'New York, USA',
    languages: 'English, German, Spanish',
    groups: 'Work, Friends'
  },
  {
    id: 6,
    name: 'Thomas R',
    avatar: avatar7,
    lastMessage: "Let's have meeting today between me, you and Tony...",
    lastMessageOn: 'Tue',
    email: 'support@coderthemes.com',
    phone: '+1 456 9595 9594',
    location: 'New Jersey, USA',
    languages: 'English, German, Spanish',
    groups: 'Work, Friends'
  },
  {
    id: 7,
    name: 'Thomas J',
    avatar: avatar8,
    lastMessage: 'Howdy?',
    lastMessageOn: 'Tue',
    email: 'support@coderthemes.com',
    phone: '+1 456 9595 9594',
    location: 'New York, USA',
    languages: 'English, German, Spanish',
    groups: 'Work, Favourties'
  },
  {
    id: 8,
    name: 'Rikcy J',
    avatar: avatar3,
    lastMessage: 'Are you interested in learning?',
    totalUnread: 28,
    lastMessageOn: 'Mon',
    email: 'support@coderthemes.com',
    phone: '+1 456 9595 9594',
    location: 'New Jersey, USA',
    languages: 'English, German, Spanish',
    groups: 'Work, Friends'
  }
];

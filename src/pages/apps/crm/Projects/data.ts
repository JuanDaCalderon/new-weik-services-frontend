import {DailyTask, TeamMember} from './types';
import avatar1 from '@/assets/images/users/avatar-1.jpg';
import avatar2 from '@/assets/images/users/avatar-2.jpg';
import avatar3 from '@/assets/images/users/avatar-4.jpg';
import avatar4 from '@/assets/images/users/avatar-5.jpg';
import avatar5 from '@/assets/images/users/avatar-6.jpg';
import avatar6 from '@/assets/images/users/avatar-7.jpg';

const tasksData: DailyTask[] = [
  {
    title: 'Landing Page Design',
    shortDesc: 'Create a new landing page (Saas Product)',
    time: '2 Hrs ago',
    teamSize: 5
  },
  {
    title: 'Admin Dashboard',
    shortDesc: 'Create a new Admin dashboard',
    time: '3 Hrs ago',
    teamSize: 2
  },
  {
    title: 'Client Work',
    shortDesc: 'Create a new Power Project (Sktech design)',
    time: '5 Hrs ago',
    teamSize: 2
  },
  {
    title: 'UI/UX Design',
    shortDesc: 'Create a new UI Kit in figma',
    time: '6 Hrs ago',
    teamSize: 3
  }
];

const members: TeamMember[] = [
  {
    avatar: avatar1,
    name: 'Risa Pearson',
    designation: 'UI/UX Designer',
    experience: '2.5 Year'
  },
  {
    avatar: avatar2,
    name: 'Margaret D. Evans',
    designation: 'PHP Developer',
    experience: '2 Year'
  },
  {
    avatar: avatar3,
    name: 'Bryan J. Luellen',
    designation: 'Front end Developer',
    experience: '1 Year'
  },
  {
    avatar: avatar4,
    name: 'Kathryn S. Collier',
    designation: 'UI/UX Designer',
    experience: '3 Year'
  },
  {
    avatar: avatar5,
    name: 'Timothy Kauper',
    designation: 'Backend Developer',
    experience: '2 Year'
  },
  {
    avatar: avatar6,
    name: 'Zara Raws',
    designation: 'Python Developer',
    experience: '1 Year'
  }
];
export {tasksData, members};

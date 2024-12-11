import {MonthlyProgressItem} from './types';
import avatar1 from '@/assets/images/users/avatar-1.jpg';
import avatar2 from '@/assets/images/users/avatar-2.jpg';
import avatar3 from '@/assets/images/users/avatar-3.jpg';
import avatar4 from '@/assets/images/users/avatar-4.jpg';
import avatar5 from '@/assets/images/users/avatar-5.jpg';

const progressDetails: MonthlyProgressItem[] = [
  {
    avatar: avatar1,
    name: 'Adam Baldwin',
    emailId: 'AdamNBaldwin@dayrep.com',
    projectName: 'Admin Dashboard',
    status: 'In Progress'
  },
  {
    avatar: avatar2,
    name: 'Peter Wallace',
    emailId: 'PeterGWallace@dayrep.com',
    projectName: 'Landing Page',
    status: 'Completed'
  },
  {
    avatar: avatar3,
    name: 'Jacob Dunn',
    emailId: 'JacobEDunn@dayrep.com',
    projectName: 'Logo Design',
    status: 'Pending'
  },
  {
    avatar: avatar4,
    name: 'Terry Adams',
    emailId: 'TerryCAdams@dayrep.com',
    projectName: 'Client Project',
    status: 'In Progress'
  },
  {
    avatar: avatar5,
    name: 'Jason Stovall',
    emailId: 'JasonJStovall@armyspy.com',
    projectName: 'Figma Work',
    status: 'Pending'
  }
];
export {progressDetails};

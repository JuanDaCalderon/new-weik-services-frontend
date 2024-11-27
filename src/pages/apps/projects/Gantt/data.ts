import {Task} from 'frappe-gantt';
import {GanttProjectItem} from '../types';

const tasks: Task[] = [
  {
    id: '1',
    name: 'Draft the new contract document for sales team',
    start: '2019-07-16',
    end: '2019-07-20',
    progress: 55,
    dependencies: '0'
  },
  {
    id: '2',
    name: 'Find out the old contract documents',
    start: '2019-07-19',
    end: '2019-07-21',
    progress: 85,
    dependencies: '1'
  },
  {
    id: '3',
    name: 'Organize meeting with sales associates to understand need in detail',
    start: '2019-07-21',
    end: '2019-07-22',
    progress: 80,
    dependencies: '2'
  },
  {
    id: '4',
    name: 'iOS App home page',
    start: '2019-07-15',
    end: '2019-07-17',
    progress: 80,
    dependencies: '0'
  },
  {
    id: '5',
    name: 'Write a release note',
    start: '2019-07-18',
    end: '2019-07-22',
    progress: 65,
    dependencies: '4'
  },
  {
    id: '6',
    name: 'Setup new sales project',
    start: '2019-07-20',
    end: '2019-07-31',
    progress: 15,
    dependencies: '0'
  },
  {
    id: '7',
    name: 'Invite user to a project',
    start: '2019-07-25',
    end: '2019-07-26',
    progress: 99,
    dependencies: '6'
  },
  {
    id: '8',
    name: 'Coordinate with business development',
    start: '2019-07-28',
    end: '2019-07-30',
    progress: 35,
    dependencies: '7'
  },
  {
    id: '9',
    name: 'Kanban board design',
    start: '2019-08-01',
    end: '2019-08-03',
    progress: 25,
    dependencies: '8'
  },
  {
    id: '10',
    name: 'Enable analytics tracking',
    start: '2019-08-05',
    end: '2019-08-07',
    progress: 60,
    dependencies: '9'
  }
];

const projects: GanttProjectItem[] = [
  {
    id: 'proj101',
    name: 'Lunar',
    status: 'On-Track',
    icon: 'uil uil-moonset'
  },
  {
    id: 'proj102',
    name: 'Dark Moon',
    status: 'On-Track',
    icon: 'uil uil-moon-eclipse'
  },
  {
    id: 'proj103',
    name: 'Aurora',
    status: 'Locked',
    icon: 'uil uil-mountains'
  },
  {
    id: 'proj104',
    name: 'Blue Moon',
    status: 'Locked',
    icon: 'uil uil-moon'
  },
  {
    id: 'proj105',
    name: 'Casanova',
    status: 'Delayed',
    icon: 'uil uil-ship'
  },
  {
    id: 'proj106',
    name: 'Darwin',
    status: 'On-Track',
    icon: 'uil uil-subway-alt'
  },
  {
    id: 'proj107',
    name: 'Eagle',
    status: 'Delayed',
    icon: 'uil uil-gold'
  }
];

export {projects, tasks};

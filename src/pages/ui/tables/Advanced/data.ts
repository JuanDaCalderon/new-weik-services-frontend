import {Employee} from '../types';

const records: Employee[] = [
  {
    id: 1,
    age: 32,
    name: 'Burt',
    company: 'Kaggle',
    phone: '+1 (823) 532-2427'
  },
  {
    id: 2,
    age: 23,
    name: 'Bruno',
    company: 'Magmina',
    phone: '+1 (813) 583-2089'
  },
  {
    id: 3,
    age: 31,
    name: 'Alvarado',
    company: 'Translink',
    phone: '+1 (975) 468-3875'
  },
  {
    id: 4,
    age: 24,
    name: 'Lilia',
    company: 'Digitalus',
    phone: '+1 (891) 537-3461'
  },
  {
    id: 5,
    age: 25,
    name: 'Amanda',
    company: 'Bunga',
    phone: '+1 (916) 522-3747'
  },
  {
    id: 6,
    age: 20,
    name: 'Alexandra',
    company: 'Conjurica',
    phone: '+1 (876) 492-3181'
  },
  {
    id: 7,
    age: 27,
    name: 'Diana',
    company: 'Extragen',
    phone: '+1 (977) 417-3038'
  },
  {
    id: 8,
    age: 26,
    name: 'Goodman',
    company: 'Aquamate',
    phone: '+1 (930) 545-2289'
  },
  {
    id: 9,
    age: 26,
    name: 'Edith',
    company: 'Pyrami',
    phone: '+1 (854) 506-3468'
  },
  {
    id: 10,
    age: 29,
    name: 'Juana',
    company: 'Singavera',
    phone: '+1 (872) 560-2324'
  },
  {
    id: 11,
    age: 21,
    name: 'Fitzgerald',
    company: 'Dancerity',
    phone: '+1 (813) 573-2507'
  },
  {
    id: 12,
    age: 38,
    name: 'Madden',
    company: 'Corpulse',
    phone: '+1 (935) 534-3876'
  },
  {
    id: 13,
    age: 40,
    name: 'Jewell',
    company: 'Frenex',
    phone: '+1 (886) 516-3262'
  },
  {
    id: 14,
    age: 32,
    name: 'Kerr',
    company: 'Artiq',
    phone: '+1 (807) 561-3077'
  },
  {
    id: 15,
    age: 20,
    name: 'Washington',
    company: 'Organica',
    phone: '+1 (948) 458-3517'
  },
  {
    id: 16,
    age: 20,
    name: 'Audrey',
    company: 'Softmicro',
    phone: '+1 (900) 592-3841'
  },
  {
    id: 17,
    age: 39,
    name: 'Allison',
    company: 'Playce',
    phone: '+1 (998) 478-3810'
  },
  {
    id: 18,
    age: 25,
    name: 'Holder',
    company: 'Paragonia',
    phone: '+1 (850) 536-2708'
  },
  {
    id: 19,
    age: 26,
    name: 'Atkinson',
    company: 'Scentric',
    phone: '+1 (850) 467-2761'
  },
  {
    id: 20,
    age: 35,
    name: 'Delaney',
    company: 'Telpod',
    phone: '+1 (934) 468-2218'
  },
  {
    id: 21,
    age: 20,
    name: 'Myrna',
    company: 'Zanity',
    phone: '+1 (953) 565-3836'
  },
  {
    id: 22,
    age: 30,
    name: 'Erna',
    company: 'Techade',
    phone: '+1 (872) 574-3879'
  },
  {
    id: 23,
    age: 36,
    name: 'Fannie',
    company: 'Cubix',
    phone: '+1 (843) 576-2904'
  },
  {
    id: 24,
    age: 38,
    name: 'Melody',
    company: 'Talae',
    phone: '+1 (817) 424-3500'
  },
  {
    id: 25,
    age: 27,
    name: 'Letitia',
    company: 'Enjola',
    phone: '+1 (857) 441-2917'
  },
  {
    id: 26,
    age: 33,
    name: 'Nina',
    company: 'Eventex',
    phone: '+1 (917) 599-2793'
  },
  {
    id: 27,
    age: 40,
    name: 'Byrd',
    company: 'Obones',
    phone: '+1 (846) 422-2064'
  },
  {
    id: 28,
    age: 34,
    name: 'Chen',
    company: 'Dadabase',
    phone: '+1 (956) 474-3409'
  },
  {
    id: 29,
    age: 25,
    name: 'Alexandria',
    company: 'Turnabout',
    phone: '+1 (964) 415-2278'
  },
  {
    id: 30,
    age: 37,
    name: 'Page',
    company: 'Metroz',
    phone: '+1 (897) 541-2460'
  },
  {
    id: 31,
    age: 24,
    name: 'Clare',
    company: 'Zilch',
    phone: '+1 (832) 591-3814'
  },
  {
    id: 32,
    age: 38,
    name: 'Lindsey',
    company: 'Roughies',
    phone: '+1 (942) 579-2920'
  },
  {
    id: 33,
    age: 32,
    name: 'Oconnor',
    company: 'Kinetica',
    phone: '+1 (899) 599-3206'
  },
  {
    id: 34,
    age: 35,
    name: 'Maldonado',
    company: 'Zentime',
    phone: '+1 (955) 419-2815'
  },
  {
    id: 35,
    age: 25,
    name: 'Day',
    company: 'Eargo',
    phone: '+1 (895) 555-2916'
  },
  {
    id: 36,
    age: 20,
    name: 'Collier',
    company: 'Phuel',
    phone: '+1 (998) 468-2079'
  },
  {
    id: 37,
    age: 40,
    name: 'Jeannette',
    company: 'Entogrok',
    phone: '+1 (904) 567-2078'
  },
  {
    id: 38,
    age: 33,
    name: 'Wallace',
    company: 'Nurali',
    phone: '+1 (877) 566-3957'
  },
  {
    id: 39,
    age: 39,
    name: 'Mcfadden',
    company: 'Cincyr',
    phone: '+1 (949) 405-3992'
  },
  {
    id: 40,
    age: 21,
    name: 'Chrystal',
    company: 'Futurize',
    phone: '+1 (988) 458-3032'
  },
  {
    id: 41,
    age: 31,
    name: 'Leila',
    company: 'Zensure',
    phone: '+1 (902) 447-2419'
  },
  {
    id: 42,
    age: 24,
    name: 'Madelyn',
    company: 'Egypto',
    phone: '+1 (881) 538-3081'
  },
  {
    id: 43,
    age: 39,
    name: 'Peck',
    company: 'Tellifly',
    phone: '+1 (803) 452-3922'
  },
  {
    id: 44,
    age: 32,
    name: 'Garrett',
    company: 'Aquasure',
    phone: '+1 (876) 475-2185'
  },
  {
    id: 45,
    age: 21,
    name: 'Kramer',
    company: 'Terrago',
    phone: '+1 (912) 404-2597'
  },
  {
    id: 46,
    age: 35,
    name: 'Lane',
    company: 'Anivet',
    phone: '+1 (911) 495-3587'
  },
  {
    id: 47,
    age: 21,
    name: 'Merritt',
    company: 'Inear',
    phone: '+1 (856) 519-3838'
  },
  {
    id: 48,
    age: 25,
    name: 'Margarita',
    company: 'Unq',
    phone: '+1 (931) 558-3156'
  },
  {
    id: 49,
    age: 28,
    name: 'Leigh',
    company: 'Marqet',
    phone: '+1 (918) 526-2007'
  },
  {
    id: 50,
    age: 31,
    name: 'Coleman',
    company: 'Insuresys',
    phone: '+1 (827) 449-3786'
  },
  {
    id: 51,
    age: 31,
    name: 'Alexander',
    company: 'Portico',
    phone: '+1 (854) 576-2455'
  },
  {
    id: 52,
    age: 38,
    name: 'Tanisha',
    company: 'Earthwax',
    phone: '+1 (994) 494-3496'
  },
  {
    id: 53,
    age: 23,
    name: 'Crane',
    company: 'Pushcart',
    phone: '+1 (924) 497-3347'
  },
  {
    id: 54,
    age: 26,
    name: 'Carmella',
    company: 'Acusage',
    phone: '+1 (898) 575-2585'
  },
  {
    id: 55,
    age: 27,
    name: 'Rosalind',
    company: 'Isologica',
    phone: '+1 (838) 572-2994'
  },
  {
    id: 56,
    age: 37,
    name: 'Duran',
    company: 'Gazak',
    phone: '+1 (991) 446-3820'
  },
  {
    id: 57,
    age: 27,
    name: 'Bernard',
    company: 'Zoinage',
    phone: '+1 (824) 585-2197'
  },
  {
    id: 58,
    age: 29,
    name: 'Tate',
    company: 'Endipine',
    phone: '+1 (896) 448-2084'
  },
  {
    id: 59,
    age: 39,
    name: 'Pearlie',
    company: 'Progenex',
    phone: '+1 (805) 545-2585'
  },
  {
    id: 60,
    age: 20,
    name: 'Manning',
    company: 'Handshake',
    phone: '+1 (917) 405-3406'
  }
];

const expandableRecords: Employee[] = [
  {
    id: 1,
    age: 32,
    name: 'Burt',
    company: 'Kaggle',
    phone: '+1 (823) 532-2427',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 2,
    age: 23,
    name: 'Long',
    company: 'Magmina',
    phone: '+1 (813) 583-2089',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 3,
    age: 31,
    name: 'Alvarado',
    company: 'Translink',
    phone: '+1 (975) 468-3875',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 4,
    age: 24,
    name: 'Lilia',
    company: 'Digitalus',
    phone: '+1 (891) 537-3461',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 5,
    age: 25,
    name: 'Amanda',
    company: 'Bunga',
    phone: '+1 (916) 522-3747',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 6,
    age: 20,
    name: 'Alexandra',
    company: 'Conjurica',
    phone: '+1 (876) 492-3181',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 7,
    age: 27,
    name: 'Diana',
    company: 'Extragen',
    phone: '+1 (977) 417-3038',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 8,
    age: 26,
    name: 'Goodman',
    company: 'Aquamate',
    phone: '+1 (930) 545-2289',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 9,
    age: 26,
    name: 'Edith',
    company: 'Pyrami',
    phone: '+1 (854) 506-3468',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 10,
    age: 29,
    name: 'Juana',
    company: 'Singavera',
    phone: '+1 (872) 560-2324',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 11,
    age: 21,
    name: 'Fitzgerald',
    company: 'Dancerity',
    phone: '+1 (813) 573-2507',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 12,
    age: 38,
    name: 'Madden',
    company: 'Corpulse',
    phone: '+1 (935) 534-3876',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 13,
    age: 40,
    name: 'Jewell',
    company: 'Frenex',
    phone: '+1 (886) 516-3262',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 14,
    age: 32,
    name: 'Kerr',
    company: 'Artiq',
    phone: '+1 (807) 561-3077',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 15,
    age: 20,
    name: 'Washington',
    company: 'Organica',
    phone: '+1 (948) 458-3517',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 16,
    age: 20,
    name: 'Audrey',
    company: 'Softmicro',
    phone: '+1 (900) 592-3841',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 17,
    age: 39,
    name: 'Allison',
    company: 'Playce',
    phone: '+1 (998) 478-3810',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 18,
    age: 25,
    name: 'Holder',
    company: 'Paragonia',
    phone: '+1 (850) 536-2708',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 19,
    age: 26,
    name: 'Atkinson',
    company: 'Scentric',
    phone: '+1 (850) 467-2761',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 20,
    age: 35,
    name: 'Delaney',
    company: 'Telpod',
    phone: '+1 (934) 468-2218',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 21,
    age: 20,
    name: 'Myrna',
    company: 'Zanity',
    phone: '+1 (953) 565-3836',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 22,
    age: 30,
    name: 'Erna',
    company: 'Techade',
    phone: '+1 (872) 574-3879',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 23,
    age: 36,
    name: 'Fannie',
    company: 'Cubix',
    phone: '+1 (843) 576-2904',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 24,
    age: 38,
    name: 'Melody',
    company: 'Talae',
    phone: '+1 (817) 424-3500',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 25,
    age: 27,
    name: 'Letitia',
    company: 'Enjola',
    phone: '+1 (857) 441-2917',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 26,
    age: 33,
    name: 'Nina',
    company: 'Eventex',
    phone: '+1 (917) 599-2793',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 27,
    age: 40,
    name: 'Byrd',
    company: 'Obones',
    phone: '+1 (846) 422-2064',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 28,
    age: 34,
    name: 'Chen',
    company: 'Dadabase',
    phone: '+1 (956) 474-3409',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 29,
    age: 25,
    name: 'Alexandria',
    company: 'Turnabout',
    phone: '+1 (964) 415-2278',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 30,
    age: 37,
    name: 'Page',
    company: 'Metroz',
    phone: '+1 (897) 541-2460',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 31,
    age: 24,
    name: 'Clare',
    company: 'Zilch',
    phone: '+1 (832) 591-3814',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 32,
    age: 38,
    name: 'Lindsey',
    company: 'Roughies',
    phone: '+1 (942) 579-2920',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 33,
    age: 32,
    name: 'Oconnor',
    company: 'Kinetica',
    phone: '+1 (899) 599-3206',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 34,
    age: 35,
    name: 'Maldonado',
    company: 'Zentime',
    phone: '+1 (955) 419-2815',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 35,
    age: 25,
    name: 'Day',
    company: 'Eargo',
    phone: '+1 (895) 555-2916',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 36,
    age: 20,
    name: 'Collier',
    company: 'Phuel',
    phone: '+1 (998) 468-2079',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 37,
    age: 40,
    name: 'Jeannette',
    company: 'Entogrok',
    phone: '+1 (904) 567-2078',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 38,
    age: 33,
    name: 'Wallace',
    company: 'Nurali',
    phone: '+1 (877) 566-3957',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 39,
    age: 39,
    name: 'Mcfadden',
    company: 'Cincyr',
    phone: '+1 (949) 405-3992',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  },
  {
    id: 40,
    age: 21,
    name: 'Chrystal',
    company: 'Futurize',
    phone: '+1 (988) 458-3032',
    subRows: [
      {
        id: 51,
        age: 23,
        name: 'Bruno',
        company: 'Magmina',
        phone: '+1 (813) 583-2089'
      }
    ]
  }
];
export {records, expandableRecords};

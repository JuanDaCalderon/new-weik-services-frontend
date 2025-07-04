import {
  PERMISOS_MAP_IDS,
  CLIENTES_ROUTER_PATH,
  CLIENTES_PATH,
  GESTION_ROUTER_PATH,
  GESTION_PATH,
  GESTION_CLIENTES_ROUTER_PATH,
  GESTION_USUARIOS_ROUTER_PATH,
  USUARIOS_PATH,
  NOTICIAS_PATH,
  GESTION_NOTICIAS_ROUTER_PATH,
  OFICINA_PATH,
  GESTION_OFICINA_ROUTER_PATH,
  HORARIOS_PATH,
  GESTION_OFICINA_HORARIOS_ROUTER_PATH,
  EVENTOS_PATH,
  VACACIONES_PATH,
  REPORTES_PATH,
  GESTION_OFICINA_EVENTOS_ROUTER_PATH,
  GESTION_OFICINA_VACACIONES_ROUTER_PATH,
  GESTION_OFICINA_REPORTES_ROUTER_PATH
} from '@/constants';
import {MenuItemType} from '@/types';
import {capitalizeFirstLetter} from '@/utils';

const HORIZONTAL_MENU_ITEMS: MenuItemType[] = [
  /* {
    key: 'dashboards',
    icon: 'uil-dashboard',
    label: 'Dashboards',
    isTitle: true,
    children: [
      {
        key: 'ds-analytics',
        label: 'Analytics',
        url: '/services/dashboard/analytics',
        parentKey: 'dashboards'
      },
      {
        key: 'ds-ecommerce',
        label: 'Ecommerce',
        url: '/services/dashboard/ecommerce',
        parentKey: 'dashboards'
      },
      {
        key: 'ds-project',
        label: 'Projects',
        url: '/services/dashboard/project',
        parentKey: 'dashboards'
      },
      {
        key: 'ds-crm',
        label: 'CRM',
        url: '/services/dashboard/crm',
        parentKey: 'dashboards'
      },
      {
        key: 'ds-ewallet',
        label: 'E-Wallet',
        url: '/services/dashboard/e-wallet',
        parentKey: 'dashboards'
      }
    ]
  },
  {
    key: 'apps',
    icon: 'uil-apps',
    label: 'Apps',
    isTitle: true,
    children: [
      {
        key: 'apps-calendar',
        label: 'Calendar',
        url: '/services/apps/calendar',
        parentKey: 'apps'
      },
      {
        key: 'apps-chat',
        label: 'Chat',
        url: '/services/apps/chat',
        parentKey: 'apps'
      },
      {
        key: 'apps-crm',
        label: 'CRM',
        parentKey: 'apps',
        children: [
          {
            key: 'crm-projects',
            label: 'Projects',
            url: '/services/apps/crm/projects',
            parentKey: 'apps-crm'
          },
          {
            key: 'crm-orders',
            label: 'Orders List',
            url: '/services/apps/crm/orders',
            parentKey: 'apps-crm'
          },
          {
            key: 'crm-management',
            label: 'Management',
            url: '/services/apps/crm/management',
            parentKey: 'apps-crm'
          }
        ]
      },
      {
        key: 'apps-ecommerce',
        label: 'Ecommerce',
        parentKey: 'apps',
        children: [
          {
            key: 'ecommerce-products',
            label: 'Products',
            url: '/services/apps/ecommerce/products',
            parentKey: 'apps-ecommerce'
          },
          {
            key: 'ecommerce-orders',
            label: 'Orders',
            url: '/services/apps/ecommerce/orders',
            parentKey: 'apps-ecommerce'
          },
          {
            key: 'ecommerce-customers',
            label: 'Customers',
            url: '/services/apps/ecommerce/customers',
            parentKey: 'apps-ecommerce'
          },
          {
            key: 'ecommerce-checkout',
            label: 'Checkout',
            url: '/services/apps/ecommerce/checkout',
            parentKey: 'apps-ecommerce'
          },
          {
            key: 'ecommerce-sellers',
            label: 'Sellers',
            url: '/services/apps/ecommerce/sellers',
            parentKey: 'apps-ecommerce'
          }
        ]
      },
      {
        key: 'apps-tasks',
        label: 'Tasks',
        parentKey: 'apps',
        children: [
          {
            key: 'task-list',
            label: 'List',
            url: '/services/apps/tasks/list',
            parentKey: 'apps-tasks'
          }
        ]
      }
    ]
  },
  {
    key: 'pages',
    icon: 'uil-copy-alt',
    label: 'Pages',
    isTitle: true,
    children: [
      {
        key: 'page-starter',
        label: 'Starter Page',
        url: '/services/pages/starter',
        parentKey: 'pages'
      },
      {
        key: 'page-profile',
        label: 'Profile',
        url: '/services/pages/profile',
        parentKey: 'pages'
      },
      {
        key: 'page-invoice',
        label: 'Invoice',
        url: '/services/pages/invoice',
        parentKey: 'pages'
      },
      {
        key: 'page-timeline',
        label: 'Timeline',
        url: '/services/pages/timeline',
        parentKey: 'pages'
      }
    ]
  },
  {
    key: 'components',
    icon: 'uil-package',
    label: 'Components',
    isTitle: true,
    children: [
      {
        key: 'widgets',
        label: 'Widgets',
        url: '/services/ui/widgets',
        parentKey: 'components'
      },
      {
        key: 'base-ui1',
        label: 'Base UI 1',
        parentKey: 'components',
        children: [
          {
            key: 'base-ui-accordions',
            label: 'Accordions & Collapse',
            url: '/services/ui/base-ui/accordions',
            parentKey: 'base-ui1'
          },
          {
            key: 'base-ui-alerts',
            label: 'Alerts',
            url: '/services/ui/base-ui/alerts',
            parentKey: 'base-ui1'
          },
          {
            key: 'base-ui-avatars',
            label: 'Avatars',
            url: '/services/ui/base-ui/avatars',
            parentKey: 'base-ui1'
          },
          {
            key: 'base-ui-badges',
            label: 'Badges',
            url: '/services/ui/base-ui/badges',
            parentKey: 'base-ui1'
          },
          {
            key: 'base-ui-breadcrumb',
            label: 'Breadcrumb',
            url: '/services/ui/base-ui/breadcrumb',
            parentKey: 'base-ui1'
          },
          {
            key: 'base-ui-buttons',
            label: 'Buttons',
            url: '/services/ui/base-ui/buttons',
            parentKey: 'base-ui1'
          },
          {
            key: 'base-ui-cards',
            label: 'Cards',
            url: '/services/ui/base-ui/cards',
            parentKey: 'base-ui1'
          },
          {
            key: 'base-ui-carousel',
            label: 'Carousel',
            url: '/services/ui/base-ui/carousel',
            parentKey: 'base-ui1'
          },
          {
            key: 'base-ui-dropdown',
            label: 'Dropdowns',
            url: '/services/ui/base-ui/dropdowns',
            parentKey: 'base-ui1'
          },
          {
            key: 'base-ui-embedvideo',
            label: 'Embed Video',
            url: '/services/ui/base-ui/embed',
            parentKey: 'base-ui1'
          },
          {
            key: 'base-ui-grid',
            label: 'Grid',
            url: '/services/ui/base-ui/grid',
            parentKey: 'base-ui1'
          },
          {
            key: 'base-ui-listgroups',
            label: 'List Group',
            url: '/services/ui/base-ui/listgroups',
            parentKey: 'base-ui1'
          }
        ]
      },
      {
        key: 'base-ui2',
        label: 'Base UI 2',
        parentKey: 'components',
        children: [
          {
            key: 'base-ui-modals',
            label: 'Modals',
            url: '/services/ui/base-ui/modals',
            parentKey: 'base-ui2'
          },
          {
            key: 'base-ui-notifications',
            label: 'Notifications',
            url: '/services/ui/base-ui/notifications',
            parentKey: 'base-ui2'
          },
          {
            key: 'base-ui-offcanvas',
            label: 'Offcanvas',
            url: '/services/ui/base-ui/offcanvas',
            parentKey: 'base-ui2'
          },
          {
            key: 'base-ui-placeholders',
            label: 'Placeholders',
            url: '/services/ui/base-ui/placeholders',
            parentKey: 'base-ui2'
          },
          {
            key: 'base-ui-paginations',
            label: 'Pagination',
            url: '/services/ui/base-ui/pagination',
            parentKey: 'base-ui2'
          },
          {
            key: 'base-ui-popovers',
            label: 'Popovers',
            url: '/services/ui/base-ui/popovers',
            parentKey: 'base-ui2'
          },
          {
            key: 'base-ui-progress',
            label: 'Progress',
            url: '/services/ui/base-ui/progress',
            parentKey: 'base-ui2'
          },
          {
            key: 'base-ui-ribbons',
            label: 'Ribbons',
            url: '/services/ui/base-ui/ribbons',
            parentKey: 'base-ui2'
          },
          {
            key: 'base-ui-spinners',
            label: 'Spinners',
            url: '/services/ui/base-ui/spinners',
            parentKey: 'base-ui2'
          },
          {
            key: 'base-ui-tabs',
            label: 'Tabs',
            url: '/services/ui/base-ui/tabs',
            parentKey: 'base-ui2'
          },
          {
            key: 'base-ui-tooltips',
            label: 'Tooltips',
            url: '/services/ui/base-ui/tooltips',
            parentKey: 'base-ui2'
          },
          {
            key: 'base-ui-links',
            label: 'Links',
            url: '/services/ui/base-ui/links',
            parentKey: 'base-ui2'
          },
          {
            key: 'base-ui-typography',
            label: 'Typography',
            url: '/services/ui/base-ui/typography',
            parentKey: 'base-ui2'
          },
          {
            key: 'base-ui-utilities',
            label: 'Utilities',
            url: '/services/ui/base-ui/utilities',
            parentKey: 'base-ui2'
          }
        ]
      },
      {
        key: 'extended-ui',
        label: 'Extended UI',
        parentKey: 'components',
        children: [
          {
            key: 'extended-ui-dragdrop',
            label: 'Drag and Drop',
            url: '/services/ui/extended/dragdrop',
            parentKey: 'extended-ui'
          },
          {
            key: 'extended-ui-rangesliders',
            label: 'Range Sliders',
            url: '/services/ui/extended/rangesliders',
            parentKey: 'extended-ui'
          },
          {
            key: 'extended-ui-ratings',
            label: 'Ratings',
            url: '/services/ui/extended/ratings',
            parentKey: 'extended-ui'
          },
          {
            key: 'extended-ui-scrollbar',
            label: 'Scrollbar',
            url: '/services/ui/extended/scrollbar',
            parentKey: 'extended-ui'
          }
        ]
      },
      {
        key: 'forms',
        label: 'Forms',
        parentKey: 'components',
        children: [
          {
            key: 'form-basic',
            label: 'Basic Elements',
            url: '/services/ui/forms/basic',
            parentKey: 'forms'
          },
          {
            key: 'form-advanced',
            label: 'Form Advanced',
            url: '/services/ui/forms/advanced',
            parentKey: 'forms'
          },
          {
            key: 'form-validation',
            label: 'Validation',
            url: '/services/ui/forms/validation',
            parentKey: 'forms'
          },
          {
            key: 'form-wizard',
            label: 'Wizard',
            url: '/services/ui/forms/wizard',
            parentKey: 'forms'
          },
          {
            key: 'form-upload',
            label: 'File Upload',
            url: '/services/ui/forms/upload',
            parentKey: 'forms'
          }
        ]
      },
      {
        key: 'charts',
        label: 'Charts',
        parentKey: 'components',
        children: [
          {
            key: 'apex-charts',
            label: 'Apex Charts',
            url: '/',
            parentKey: 'charts',
            children: [
              {
                key: 'area-apex',
                label: 'Area',
                url: '/services/ui/charts/apex/area',
                parentKey: 'apex-charts'
              },
              {
                key: 'bar-apex',
                label: 'Bar',
                url: '/services/ui/charts/apex/bar',
                parentKey: 'apex-charts'
              },
              {
                key: 'bubble-apex',
                label: 'Bubble',
                url: '/services/ui/charts/apex/bubble',
                parentKey: 'apex-charts'
              },
              {
                key: 'candlestick-apex',
                label: 'Candlestick',
                url: '/services/ui/charts/apex/candlestick',
                parentKey: 'apex-charts'
              },
              {
                key: 'column-apex',
                label: 'Column',
                url: '/services/ui/charts/apex/column',
                parentKey: 'apex-charts'
              },
              {
                key: 'heatmap-apex',
                label: 'Heatmap',
                url: '/services/ui/charts/apex/heatmap',
                parentKey: 'apex-charts'
              },
              {
                key: 'line-apex',
                label: 'Line',
                url: '/services/ui/charts/apex/line',
                parentKey: 'apex-charts'
              },
              {
                key: 'mixed-apex',
                label: 'Mixed',
                url: '/services/ui/charts/apex/mixed',
                parentKey: 'apex-charts'
              },
              {
                key: 'timeline-apex',
                label: 'Timeline',
                url: '/services/ui/charts/apex/timeline',
                parentKey: 'apex-charts'
              },
              {
                key: 'boxplot-apex',
                label: 'Boxplot',
                url: '/services/ui/charts/apex/boxplot',
                parentKey: 'apex-charts'
              },
              {
                key: 'treemap-apex',
                label: 'Treemap',
                url: '/services/ui/charts/apex/treemap',
                parentKey: 'apex-charts'
              },
              {
                key: 'pie-apex',
                label: 'Pie',
                url: '/services/ui/charts/apex/pie',
                parentKey: 'apex-charts'
              },
              {
                key: 'radar-apex',
                label: 'Radar',
                url: '/services/ui/charts/apex/radar',
                parentKey: 'apex-charts'
              },
              {
                key: 'radialbar-apex',
                label: 'RadialBar',
                url: '/ui/charts/apex/radialbar',
                parentKey: 'apex-charts'
              },
              {
                key: 'scatter-apex',
                label: 'Scatter',
                url: '/services/ui/charts/apex/scatter',
                parentKey: 'apex-charts'
              },
              {
                key: 'polararea-apex',
                label: 'Polar Area',
                url: '/services/ui/charts/apex/polararea',
                parentKey: 'apex-charts'
              },
              {
                key: 'sparklines-apex',
                label: 'Sparklines',
                url: '/services/ui/charts/apex/sparklines',
                parentKey: 'apex-charts'
              }
            ]
          },
          {
            key: 'chartjs-charts',
            label: 'ChartJS',
            url: '/',
            parentKey: 'charts',
            children: [
              {
                key: 'area-chartjs',
                label: 'Area',
                url: '/ui/charts/chartjs/area',
                parentKey: 'chartjs-charts'
              },
              {
                key: 'bar-chartjs',
                label: 'Bar',
                url: '/ui/charts/chartjs/bar',
                parentKey: 'chartjs-charts'
              },
              {
                key: 'line-chartjs',
                label: 'Line',
                url: '/ui/charts/chartjs/line',
                parentKey: 'chartjs-charts'
              },
              {
                key: 'other-chartjs',
                label: 'Other',
                url: '/ui/charts/chartjs/other',
                parentKey: 'chartjs-charts'
              }
            ]
          }
        ]
      },
      {
        key: 'tables',
        label: 'Tables',
        parentKey: 'components',
        children: [
          {
            key: 'table-basic',
            label: 'Basic Tables',
            url: '/services/ui/tables/basic',
            parentKey: 'tables'
          },
          {
            key: 'table-advanced',
            label: 'Advanced Tables',
            url: '/services/ui/tables/advanced',
            parentKey: 'tables'
          }
        ]
      },
      {
        key: 'icons',
        label: 'Icons',
        parentKey: 'components',
        children: [
          {
            key: 'icon-remix',
            label: 'Remix Icons',
            url: '/services/ui/icons/remix',
            parentKey: 'icons'
          },
          {
            key: 'icon-mdiicons',
            label: 'Material Design',
            url: '/services/ui/icons/mdi',
            parentKey: 'icons'
          },
          {
            key: 'icon-unicons',
            label: 'Unicons',
            url: '/services/ui/icons/unicons',
            parentKey: 'icons'
          },
          {
            key: 'icon-lucide',
            label: 'Lucide',
            url: '/services/ui/icons/lucide',
            parentKey: 'icons'
          }
        ]
      }
    ]
  }, */
  {
    key: CLIENTES_ROUTER_PATH,
    icon: 'uil-user-square',
    label: capitalizeFirstLetter(CLIENTES_PATH),
    isTitle: true,
    children: []
  },
  {
    key: GESTION_ROUTER_PATH,
    icon: 'uil-cog',
    label: capitalizeFirstLetter(GESTION_PATH),
    isTitle: true,
    children: [
      {
        key: GESTION_CLIENTES_ROUTER_PATH,
        label: capitalizeFirstLetter(CLIENTES_PATH),
        url: GESTION_CLIENTES_ROUTER_PATH,
        parentKey: GESTION_ROUTER_PATH,
        permisoId: PERMISOS_MAP_IDS.accesoClientes
      },
      {
        key: GESTION_USUARIOS_ROUTER_PATH,
        label: capitalizeFirstLetter(USUARIOS_PATH),
        url: GESTION_USUARIOS_ROUTER_PATH,
        parentKey: GESTION_ROUTER_PATH,
        permisoId: PERMISOS_MAP_IDS.accesoUsuarios
      },
      {
        key: GESTION_NOTICIAS_ROUTER_PATH,
        label: capitalizeFirstLetter(NOTICIAS_PATH),
        url: GESTION_NOTICIAS_ROUTER_PATH,
        parentKey: GESTION_ROUTER_PATH,
        permisoId: PERMISOS_MAP_IDS.accesoNoticias
      },
      {
        key: GESTION_OFICINA_ROUTER_PATH,
        label: capitalizeFirstLetter(OFICINA_PATH),
        parentKey: GESTION_ROUTER_PATH,
        children: [
          {
            key: GESTION_OFICINA_HORARIOS_ROUTER_PATH,
            label: capitalizeFirstLetter(HORARIOS_PATH),
            url: GESTION_OFICINA_HORARIOS_ROUTER_PATH,
            parentKey: GESTION_OFICINA_ROUTER_PATH,
            permisoId: PERMISOS_MAP_IDS.accesoHorarios
          },
          {
            key: GESTION_OFICINA_EVENTOS_ROUTER_PATH,
            label: capitalizeFirstLetter(EVENTOS_PATH),
            url: GESTION_OFICINA_EVENTOS_ROUTER_PATH,
            parentKey: GESTION_OFICINA_ROUTER_PATH,
            permisoId: PERMISOS_MAP_IDS.accesoEventos
          },
          {
            key: GESTION_OFICINA_VACACIONES_ROUTER_PATH,
            label: capitalizeFirstLetter(VACACIONES_PATH),
            url: GESTION_OFICINA_VACACIONES_ROUTER_PATH,
            parentKey: GESTION_OFICINA_ROUTER_PATH,
            permisoId: PERMISOS_MAP_IDS.accesoVacaciones
          },
          {
            key: GESTION_OFICINA_REPORTES_ROUTER_PATH,
            label: capitalizeFirstLetter(REPORTES_PATH),
            url: GESTION_OFICINA_REPORTES_ROUTER_PATH,
            parentKey: GESTION_OFICINA_ROUTER_PATH,
            permisoId: PERMISOS_MAP_IDS.accesoReportes
          }
        ]
      }
    ]
  }
];

export {HORIZONTAL_MENU_ITEMS};

export type Apps = {
  id: string;
  name: string;
  icon: string;
  redirectTo: string;
};

export type PayLoadAppsType = {
  apps: Apps[];
  isLoading: boolean;
};

export type AppsToDb = Omit<Apps, 'id'>;

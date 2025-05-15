export type Apps = {
  id: string;
  name: string;
  icon: string;
  redirectTo: string;
};

export type AppsToDb = Omit<Apps, 'id'>;

export type PayLoadAppsType = {
  apps: Apps[];
  isLoading: boolean;
};

import config from '@/config';
import {VERSION_KEY} from '@/constants';
import {useEffect} from 'react';
import {LocalStorageUtil, SessionStorageUtil, DebugUtil} from '@/utils';

export default function useAppVersionChecker(): void {
  useEffect(() => {
    const savedAppVersion = LocalStorageUtil.getItem<string>(VERSION_KEY);
    if (savedAppVersion) {
      if (savedAppVersion !== config.APP_VERSION) {
        DebugUtil.logInfo(`Versión actual: ${config.APP_VERSION}, versión anterior: ${savedAppVersion}`);
        DebugUtil.logSuccess('↪️ Nueva versión detectada. Limpiando almacenamiento...');
        LocalStorageUtil.clear();
        SessionStorageUtil.clear();
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
          }
        });
        LocalStorageUtil.setItem(VERSION_KEY, config.APP_VERSION);
        setTimeout(() => (window.location.href = window.location.origin + window.location.pathname), 0);
      }
    } else LocalStorageUtil.setItem(VERSION_KEY, config.APP_VERSION);
  }, []);
}

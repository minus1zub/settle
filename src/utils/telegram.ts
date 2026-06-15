export type TelegramUser = {
  id?: string;
  firstName?: string;
  username?: string;
};

type TelegramWebApp = {
  initDataUnsafe?: {
    start_param?: string;
    user?: {
      id?: number;
      first_name?: string;
      username?: string;
    };
  };
  BackButton?: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback?: {
    impactOccurred?: (style: 'light' | 'medium' | 'heavy') => void;
    notificationOccurred?: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged?: () => void;
  };
  LocationManager?: {
    isInited?: boolean;
    init?: (callback?: () => void) => void;
    getLocation?: (callback: (location?: { latitude: number; longitude: number }) => void) => void;
  };
  ready?: () => void;
  expand?: () => void;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export const getTelegramUser = (): TelegramUser | undefined => {
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (!user) return undefined;

  return {
    id: user.id ? String(user.id) : undefined,
    firstName: user.first_name,
    username: user.username,
  };
};

export const initTelegramApp = () => {
  window.Telegram?.WebApp?.ready?.();
  window.Telegram?.WebApp?.expand?.();
};

export const getTelegramStartParam = () => window.Telegram?.WebApp?.initDataUnsafe?.start_param;

export const impactHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.(style);
};

export const notificationHaptic = (type: 'error' | 'success' | 'warning' = 'success') => {
  window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.(type);
};

export const selectionHaptic = () => {
  window.Telegram?.WebApp?.HapticFeedback?.selectionChanged?.();
};

export const requestTelegramLocation = () =>
  new Promise<{ lat: number; lon: number } | undefined>((resolve) => {
    const locationManager = window.Telegram?.WebApp?.LocationManager;

    if (!locationManager?.getLocation) {
      resolve(undefined);
      return;
    }

    const request = () => {
      locationManager.getLocation?.((location) => {
        resolve(location ? { lat: location.latitude, lon: location.longitude } : undefined);
      });
    };

    if (!locationManager.isInited && locationManager.init) {
      locationManager.init(request);
      return;
    }

    request();
  });

export const requestBrowserLocation = () =>
  new Promise<{ lat: number; lon: number } | undefined>((resolve) => {
    if (!navigator.geolocation) {
      resolve(undefined);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lon: position.coords.longitude }),
      () => resolve(undefined),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 120000 },
    );
  });

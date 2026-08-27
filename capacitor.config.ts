import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dz.achridz.marketplace',
  appName: 'AchriDZ - سوق المستعمل',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#0F172A',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: '#0F766E',
      androidSplashResourceName: 'splash',
      showSpinner: true,
      spinnerColor: '#F59E0B',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0F766E',
    },
  },
};

export default config;

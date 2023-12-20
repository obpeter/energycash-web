import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'vfeeg-web',
  webDir: 'build',
  bundledWebRuntime: false
  server: {
    androidScheme: 'https'
  }
};

export default config;

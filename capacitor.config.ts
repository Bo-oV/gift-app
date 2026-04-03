import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.merlin.sviato.app',
  appName: 'Sviato  App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

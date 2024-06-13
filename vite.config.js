import { defineConfig } from 'vite';
import { resolve } from 'path';
import { register } from 'module';

export default defineConfig({
  // Base public path
  base: '/',
  // Define build options
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          medicalReport: resolve(__dirname, 'medicalReport.html'),
          register: resolve(__dirname, 'register.html'),
          adminHome: resolve(__dirname, 'html/admin/adminHome.html'),
          adminLiveDashboard: resolve(__dirname, 'html/admin/adminLiveDashboard.html'),
          adminReadingsDashboard: resolve(__dirname, 'html/admin/adminReadingsDashboard.html'),
          userHome: resolve(__dirname, 'html/user/userHome.html'),
          userLiveDashboard: resolve(__dirname, 'html/user/userLiveDashboard.html'),
          userReadingsDashboard: resolve(__dirname, 'html/user/userReadingsDashboard.html'),
        }
    }
  },
  root: '.',  // Root directory is the current directory
});
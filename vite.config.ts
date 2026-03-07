import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode: _mode }) => {
    return {
        plugins: [react()],
        publicDir: false, // Don't serve public folder
        server: {
            open: true, // open browser on server start
            proxy: {
                '/api': {
                    target: 'https://k-celebrate-slogan.vercel.app',
                    changeOrigin: true,
                },
            },
        },
        build: {
            rollupOptions: {
                input: {
                    main: 'index.html',
                },
            },
        },
    };
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode: _mode }) => {
    return {
        plugins: [react()],
        publicDir: false, // Don't serve public folder
        server: {
            open: true, // open browser on server start
            port: 3000,
        },
        build: {
            rollupOptions: {
                input: {
                    main: 'index.html',
                    demo: 'demo.html',
                },
            },
        },
    };
});

import { resolve } from 'path'
import restart from 'vite-plugin-restart'
import dts from 'vite-plugin-dts'

export default {
    server:
    {
        host: true,
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env)
    },
    build:
    {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'BaseExperience',
            fileName: 'base-experience',
            formats: ['es'],
        },
        rollupOptions: {
            external: ['three', 'three/examples/jsm/Addons.js', 'lil-gui'],
        },
        sourcemap: true,
        minify: false,
        target: 'esnext'
    },
    plugins:
    [
        restart({ restart: [ '../public/**', ] }),
        dts({ rollupTypes: true }),
    ],
}

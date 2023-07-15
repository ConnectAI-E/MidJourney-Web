import {defineConfig,loadEnv} from 'vite';
import react from '@vitejs/plugin-react-swc';
import {viteSingleFile} from 'vite-plugin-singlefile';
import svgx from '@svgx/vite-plugin-react';
import {obfuscator} from 'rollup-obfuscator';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import vitePluginString from 'vite-plugin-string'

const isDev = process.env.NODE_ENV === 'development';

const ifCompress = (fn: () => any, defaultVal: any = {}) => {
    if (!isDev)
        return fn();
    return defaultVal;
};


export const commonConfig = () => {
    return {
        resolve: {
            alias: {
                '@/': `${ path.resolve(__dirname, 'src') }/`,
            },
        },
    };
};

export default ({mode})=>{
    Object.assign(process.env, loadEnv(mode, process.cwd()))
    const hostUrl = process.env.VITE_MIDJOURNEY_PROXY_URL;

    return defineConfig({
        ...commonConfig(),
        server: {
            proxy: {
                '/mj-api': {
                    target:hostUrl,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/mj-api/, ''),
                },
            },
        },
        plugins: [
            vitePluginString(),
            UnoCSS(),
            react(),
            svgx(),
            AutoImport({
                imports: ['react','react-router-dom'],
                dts: "./auto-imports.d.ts",
            }),
            viteSingleFile(),

            ifCompress(() => obfuscator({
                optionsPreset: 'low-obfuscation',
            }))
        ],
        esbuild: {
            drop: ['debugger'],
            pure: ifCompress(() => {
                return ['console.log', 'console.error', 'console.warn', 'console.debug', 'console.trace']
            }, []),
        },
        build: {
            outDir: `dist`,
            minify: ifCompress(() => 'esbuild', false),
            sourcemap: isDev,
            watch: isDev ? {} : null,
            cssCodeSplit: false,
            assetsInlineLimit: 100000000000000000,
            rollupOptions: {
                input: {
                    main: path.resolve(__dirname, 'index.html'),
                },
                output: {
                    entryFileNames: 'assets/[name].js',
                },
            },
        },

    });

}

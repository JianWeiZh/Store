
// rollup.config.js
import { getBabelOutputPlugin } from '@rollup/plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    name: 'Store',
    file: 'dist/store.js',
    format: 'umd'
  },
  plugins: [getBabelOutputPlugin({ allowAllFormats: true, presets: ['@babel/preset-env'] })]
}

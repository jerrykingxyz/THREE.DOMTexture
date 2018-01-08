const cleanup = require('rollup-plugin-cleanup');
const babel = require('rollup-plugin-babel');
const rollup = require('rollup');

export default {
  input: 'src/index.js',
  indent: '\t',
  external: ['three'],
  output: {
    file: './dist/DOMTexture.js',
    format: 'umd',
    name: 'DOMTexture',
  },
  globals: {
    'three': 'THREE',
  },
  watch: {
    include: 'src/**',
  },
  plugins: [
    babel({
      plugins: ['external-helpers'],
      exclude: 'node_modules/**',
    }),
    cleanup(),
  ]
};
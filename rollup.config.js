const keyword = function () {
  return {
    transform (code, id) {
      if ( /\.js$/.test( id ) === false ) return;

      return {
        code: code.replace(/let /g, 'var ').replace(/const /g, 'var ')
      }
    }
  }
}

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
    keyword()
  ]
};
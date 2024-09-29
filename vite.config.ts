// vite.config.ts
import {browserslistToTargets} from 'lightningcss'
import browserslist from 'browserslist'


export default {
  server: {
    host: '127.0.0.1'
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('>= 0.25%')),
      cssModules: true,
    }
  },
  build: {
    cssMinify: 'lightningcss'
  }
};

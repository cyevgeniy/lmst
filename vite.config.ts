// vite.config.ts
import {browserslistToTargets} from 'lightningcss'
import browserslist from 'browserslist'


export default {
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

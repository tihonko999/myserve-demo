import rrs from 'recursive-readdir-sync'
import fs from 'fs'
import prettier from 'prettier'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const prettierConfig = require('../.prettierrc.json')

// router should works like vite-pages plugin with exclude: ['components', 'gql'] options
// https://github.com/hannoeru/vite-plugin-pages#exclude
export function generateVueRoutesFile() {
  const pagesDir = 'app/javascript/pages'
  if (!fs.existsSync(pagesDir)) {
    console.log(`Vue pages dir - "${pagesDir}" does not exists`)
    return
  }
  let fileContent = 'export const routes = ['
  rrs(pagesDir)
    // only .vue files
    .filter((file) => file.endsWith('.vue'))
    // no components and gql folders
    .filter((file) => !file.includes('/components/') && !file.includes('/gql/'))
    .forEach((file) => {
      const path = file.replace('app/javascript/pages', '')
      const componentFilePath = `~/pages${path}`
      const urlPath = path
        // [id] -> :id
        .replace(/\[(.+?)\]/gi, ':$1')
        // remove trailing .vue
        .replace(/\.vue$/, '')
        // remove trailing index
        .replace(/index$/, '')
        // remove trailing slash
        .replace(/\/$/, '')
      // create route name
      const routeName = urlPath
        // remove starting slash
        .replace(/^\//, '')
        // path serments (/, /:) to dashes
        .replace(/\/:?/g, '-')
      fileContent += `{name: '${routeName}', path: '${urlPath}', component: () => import('${componentFilePath}')},`
    })
  fileContent += ']'
  fs.writeFileSync(
    'app/javascript/router/auto-generated-routes.js',
    prettier.format(fileContent, { ...prettierConfig, parser: 'babel' })
  )
}

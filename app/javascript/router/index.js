import { createRouter, createWebHistory } from 'vue-router'
// router should works like vite-pages plugin with exclude: ['components', 'gql'] options
// https://github.com/hannoeru/vite-plugin-pages#exclude
// auto-generated-routes.js gets generated at build time and can be absent when linting
// without auto-generated-routes.js build and specs will fail
// so it is safe disable eslint-import/no-unresolved for this line
// eslint-disable-next-line import/no-unresolved
import { routes } from './auto-generated-routes'

export const router = createRouter({
  routes,
  history: createWebHistory(),
})

import { defineRouter } from '#q-app'
import { Notify } from 'quasar'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'

import routes from './routes.js'
import { useAuthStore } from '@/stores/auth-store.js'
import { pinia } from '@/stores/pinia.js'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE),
  })

  router.beforeEach(async (to) => {
    const auth = useAuthStore(pinia)

    if (!auth.initialized) {
      try {
        await auth.initialize()
      } catch {
        Notify.create({ type: 'negative', message: 'เชื่อมต่อระบบบัญชีไม่ได้ กรุณาลองอีกครั้ง' })
        if (to.meta.requiresAuth) return false
      }
    }

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return {
        name: 'login',
        query: {
          redirect: to.fullPath,
        },
      }
    }

    if (to.meta.requiresAdmin && !auth.isAdmin) {
      return { name: 'dashboard' }
    }

    if (to.meta.guestOnly && auth.isAuthenticated) {
      return { name: 'dashboard' }
    }

    return true
  })

  return router
})

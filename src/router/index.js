import { createRouter, createWebHashHistory } from 'vue-router'
import FaucetView from '../views/FaucetView.vue'
import DexView from "../views/DexView.vue"

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: (to) => {
        return {
          path: '/faucet', query: { q: to.params.searchText }
        }
      }
    },
    {
      path: '/dex',
      name: 'Dex',
      component: DexView
    },
    {
      path: '/faucet',
      name: 'Faucet',
      component: FaucetView
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   // component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router

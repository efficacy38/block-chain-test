import { createRouter, createWebHistory } from 'vue-router'
import FaucetView from '../views/FaucetView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/',
        redirect: (to) => {
            return { path: '/faucet', query: {q: to.params.searchText}
            }
        }
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

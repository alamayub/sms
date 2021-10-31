import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue'), meta: { requiresVisitor: true } },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/Dashboard') },
      { path: 'employee', name: 'Employee', component: () => import('../views/Employee.vue') }
    ]
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

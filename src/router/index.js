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
      { path: 'expenses', name: 'Expense', component: () => import('../views/Expenses') },
      { path: 'attendance', name: 'Attendance', component: () => import('../views/Attendance') },
      { path: 'payment', name: 'Payment', component: () => import('../views/Payment') },
      { path: 'projects', name: 'Projects', component: () => import('../views/Projects') },
      { path: 'employee', name: 'Employee', component: () => import('../views/Employee') },
      { path: 'reports', name: 'Reports', component: () => import('../views/Reports') },
      { path: 'expense-category', name: 'Expense Category', component: () => import('../views/ExpenseCategory') },
    ]
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

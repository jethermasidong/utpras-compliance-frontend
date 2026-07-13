import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomePage from './pages/HomePage.vue'
import AboutPage from './pages/AboutPage.vue'
import RegionalDashboard from './pages/regional-office/RegionalDashboard.vue'
import UserManagement from './pages/regional-office/UserManagement.vue'
import './style.css'
import ProvincialDashboard from './pages/provincial-office/ProvincialDashboard.vue'
import ProgramManagement from './pages/regional-office/ProgramManagement.vue'
import IBTManagement from './pages/regional-office/IBTManagement.vue'
import EBETManagement from './pages/regional-office/EBETManagement.vue'
import MCCManagement from './pages/regional-office/MCCManagement.vue'

const routes = [
  { path: '/', component: HomePage},
  { path: '/about', component: AboutPage},
  { path: '/regional-dashboard', component: RegionalDashboard, meta: { requiresAuth: true }},
  { path: '/provincial-dashboard', component: ProvincialDashboard, meta: { requiresAuth: true }},
  { path: '/user-management', component: UserManagement, meta: { requiresAuth: true }},
  { path: '/program-management', component: ProgramManagement, meta: { requiresAuth: true }},
  { path: '/ibt-management', component: IBTManagement, meta: { requiresAuth: true }},
  { path: '/ebet-management', component: EBETManagement, meta: { requiresAuth: true }},
  { path: '/mcc-management', component: MCCManagement, meta: { requiresAuth: true }}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); 

  if (to.meta.requiresAuth && !token) {
    next({ path: '/' }); 
  } else {
    next();
  }
});

const app = createApp(App)
app.use(router)
app.mount('#app')



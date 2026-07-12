import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomePage from './pages/HomePage.vue'
import AboutPage from './pages/AboutPage.vue'
import RegionalDashboard from './pages/regional-office/RegionalDashboard.vue'
import UserManagement from './pages/regional-office/UserManagement.vue'
import './style.css'
import ProvincialDashboard from './pages/provincial-office/ProvincialDashboard.vue'



const routes = [
  { path: '/', component: HomePage},
  { path: '/about', component: AboutPage},
  { path: '/regional-dashboard', component: RegionalDashboard, meta: { requiresAuth: true }},
  { path: '/provincial-dashboard', component: ProvincialDashboard, meta: { requiresAuth: true }},
  { path: '/user-management', component: UserManagement, meta: { requiresAuth: true }}
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



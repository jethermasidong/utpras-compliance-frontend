import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomePage from './pages/HomePage.vue'
import AboutPage from './pages/AboutPage.vue'
import RegionalDashboard from './pages/regional-office/RegionalDashboard.vue'
import './style.css'
import ProvincialDashboard from './pages/provincial-office/ProvincialDashboard.vue'

const routes = [
  { path: '/', component: HomePage},
  { path: '/about', component: AboutPage},
  { path: '/regional-dashboard', component: RegionalDashboard},
  { path: '/provincial-dashboard', component: ProvincialDashboard}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')



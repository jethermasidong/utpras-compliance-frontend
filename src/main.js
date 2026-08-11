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
import ApplicationPage from './pages/provincial-office/ApplicationPage.vue'
import IBTProfile from './pages/provincial-office/IBTProfile.vue'
import CompliancePage from './pages/provincial-office/CompliancePage.vue'
import ComplianceDashboard from './pages/provincial-office/ComplianceDashboard.vue'
import MTPManagement from './pages/regional-office/MTPManagement.vue'
import Applications from './pages/regional-office/Applications.vue'
import ROApplicationPage from './pages/regional-office/ROApplicationPage.vue'
import EBETProfile from './pages/provincial-office/EBETProfile.vue'
import EBETCompliancePage from './pages/provincial-office/EBETCompliancePage.vue'
import ROEBETApplicationPage from './pages/regional-office/ROEBETApplicationPage.vue'
import MCCProfile from './pages/provincial-office/MCCProfile.vue'
import MCCCompliancePage from './pages/provincial-office/MCCCompliancePage.vue'
import ROMCCApplicationPage from './pages/regional-office/ROMCCApplicationPage.vue'
import MTPProfile from './pages/provincial-office/MTPProfile.vue'
import MTPCompliancePage from './pages/provincial-office/MTPCompliancePage.vue'
import ROMTPApplicationPage from './pages/regional-office/ROMTPApplicationPage.vue'
import Settings from './pages/provincial-office/Settings.vue'


const routes = [
  { path: '/', component: HomePage, meta: { hideNav: true }},
  { path: '/about', component: AboutPage, meta: { hideNav: true }},
  { path: '/regional-dashboard', component: RegionalDashboard, meta: { requiresAuth: true }},
  { path: '/provincial-dashboard', component: ProvincialDashboard, meta: { requiresAuth: true }},
  { path: '/user-management', component: UserManagement, meta: { requiresAuth: true }},
  { path: '/program-management', component: ProgramManagement, meta: { requiresAuth: true }},
  { path: '/ibt-management', component: IBTManagement, meta: { requiresAuth: true }},
  { path: '/ebet-management', component: EBETManagement, meta: { requiresAuth: true }},
  { path: '/mcc-management', component: MCCManagement, meta: { requiresAuth: true }},
  { path: '/mtp-management', component: MTPManagement, meta: {requiresAuth: true }},
  { path: '/program-application', component: ApplicationPage, meta: { requiresAuth: true }},
  { path: '/ibt-profile', component: IBTProfile, meta: { requiresAuth: true }},
  { path: '/compliance-dashboard', component: ComplianceDashboard, meta: { requiresAuth: true }},
  { path: '/compliance-page', component: CompliancePage, meta: { requiresAuth: true }},
  { path: '/applications', component: Applications, meta: { requiresAuth: true }},
  { path: '/ro-application-page', component: ROApplicationPage, meta: { requiresAuth: true }},
  { path: '/ebet-profile', component: EBETProfile, meta: { requiresAuth: true }},
  { path: '/ebet-compliance-page', component: EBETCompliancePage, meta: { requiresAuth: true }},
  { path: '/ro-ebet-application-page', component: ROEBETApplicationPage, meta: { requiresAuth: true }},
  { path: '/mcc-profile', component: MCCProfile, meta: { requiresAuth: true }},
  { path: '/mcc-compliance-page', component: MCCCompliancePage, meta: { requiresAuth: true }},
  { path: '/ro-mcc-application-page', component: ROMCCApplicationPage, meta: { requiresAuth: true }},
  { path: '/mtp-profile', component: MTPProfile, meta: { requiresAuth: true }},
  { path: '/mtp-compliance-page', component: MTPCompliancePage, meta: { requiresAuth: true }},
  { path: '/ro-mtp-application-page', component: ROMTPApplicationPage, meta: { requiresAuth: true }},
  { path: '/settings', component: Settings, meta: { requiresAuth: true }}
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



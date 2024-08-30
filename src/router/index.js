import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import GenerateIdea from '@/views/GenerateIdea.vue';
import ViewIdeas from '@/views/ViewIdeas.vue';
import ViewOrders from '@/views/ViewOrders.vue';
import Profile from '@/views/Profile.vue';
import Error from '../views/Error.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/generate-idea', name: 'GenerateIdea', component: GenerateIdea },
  { path: '/view-ideas', name: 'ViewIdeas', component: ViewIdeas },
  { path: '/view-orders', name: 'ViewOrders', component: ViewOrders },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/error', name: 'Error', component:  Error}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

let isProfileCompleted = true;

router.beforeEach((to, from, next) => {
  
  if (!isProfileCompleted && to.name !== 'Profile') {
    next({ name: 'Profile' });
  } else {
    next();
  }
});

export default router;

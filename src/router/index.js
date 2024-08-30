import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import GenerateIdea from '@/views/GenerateIdea.vue';
import ViewIdeas from '@/views/ViewIdeas.vue';
import ViewOrders from '@/views/ViewOrders.vue';
import Profile from '@/views/Profile.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/generate-idea', name: 'GenerateIdea', component: GenerateIdea },
  { path: '/view-ideas', name: 'ViewIdeas', component: ViewIdeas },
  { path: '/view-orders', name: 'ViewOrders', component: ViewOrders },
  { path: '/profile', name: 'Profile', component: Profile }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;

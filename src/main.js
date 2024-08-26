import './style.css'
import 'primeicons/primeicons.css'
import router from './router';

import { createApp } from 'vue'
import App from './App.vue'
import { keycloak, initKeycloak } from './keycloak/keycloak';

initKeycloak.then(() => {
    const app = createApp(App);

    app.config.globalProperties.$keycloak = keycloak;
    app.config.globalProperties.$logout = () => {
        keycloak.logout();
    };

    app.use(router);

    app.mount('#app');
}).catch(error => {
    console.error('Keycloak initialization failed:', error);
});

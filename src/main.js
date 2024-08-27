import './style.css'
import 'primeicons/primeicons.css'
import axios from 'axios';
import router from './router';
import { createApp } from 'vue';
import App from './App.vue';
import { keycloak, initKeycloak } from './keycloak/keycloak';

initKeycloak.then(() => {
    const app = createApp(App);

    app.config.globalProperties.$keycloak = keycloak;
    app.config.globalProperties.$logout = () => {
        keycloak.logout();
    };

    axios.get('http://localhost:8081/users/jwtToken', {
        headers: {
            'Authorization': `Bearer ${keycloak.token}`
        }
    })
    .then(response => {
        localStorage.setItem('user-details', response.data.user_details);
    
    })
    .catch(error => {
        console.error('Error fetching JWT Token:', error);
       
    });

    app.use(router);
    app.mount('#app');
}).catch(error => {
    console.error('Keycloak initialization failed:', error);
});

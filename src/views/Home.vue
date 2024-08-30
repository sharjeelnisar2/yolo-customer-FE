<template>
  <div>
    <h1>Home Page</h1>
    <ProfileModal :isOpen="showProfileModal" @profile-completed="handleProfileCompleted" />
  </div>
</template>

<script>
import ProfileModal from './ProfileModal.vue';
import axios from 'axios';

export default {
  components: {
    ProfileModal
  },
  data() {
    return {
      showProfileModal: false,
    };
  },
  mounted() {
    this.checkUserProfile();
  },
  methods: {
    async checkUserProfile() {
      try {
        const token = localStorage.getItem('vue-token'); // Example key, adjust as needed

        // Make the API request with the Authorization header
        const response = await axios.get('http://localhost:8081/users/profiles', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data.is_user_profile_completed === false) {
          this.showProfileModal = true;
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
      }
    },
    handleProfileCompleted() {
      this.showProfileModal = false;
      // Additional logic if needed after profile is completed
    }
  }
};
</script>

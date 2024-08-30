<!-- ProfileModal.vue -->
<template>
    <div v-if="isOpen" class="modal-overlay">
      <div class="modal">
        <h2>Complete Your Profile</h2>
        <!-- Your profile form here -->
        <button @click="completeProfile">Complete Profile</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isOpen: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      completeProfile() {
        // Logic to complete the profile
        this.$emit('profile-completed');
      }
    }
  };
  </script>
  
  <style>
  /* Add your modal styling here */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
  }
  </style>
  
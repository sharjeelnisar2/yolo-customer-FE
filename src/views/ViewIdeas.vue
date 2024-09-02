<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { roles } from "../data/roles.js"; // Import the predefined roles
import { API_CONFIG } from "../config.js";

const ideasData = ref([]); // Directly use an array instead of an object
const selectedStatus = ref("");
const showModal = ref(false);
const selectedIdea = ref({});
const userDetails = ref({});
const userRoles = ref([]);
const hasAccess = ref(false);
const token = localStorage.getItem("vue-token");

const ideaStatusEnum = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
};

const storedUserDetails = localStorage.getItem("user-details");
if (storedUserDetails) {
  userDetails.value = JSON.parse(storedUserDetails);
  userRoles.value = userDetails.value.roles || [];
} else {
  console.warn("No user details found in local storage.");
}

function hasRole(role) {
  return userRoles.value.includes(role);
}

function checkAccess() {
  if (hasRole(roles.VIEW_ALL_IDEAS)) {
    hasAccess.value = true;
    fetchIdeas();
  } else {
    window.location.href = "/error"; // Redirect if the user does not have access
  }
}

window.addEventListener("storage", (event) => {
  if (event.key === "vue-token") {
    token.value = event.newValue;
  }
});

const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

async function fetchIdeas() {
  try {
    const response = await axiosInstance.get("/users/ideas");
    // Directly set ideasData to the content array
    ideasData.value = response.data.data.ideas.content;
  } catch (error) {
    console.error("Failed to fetch ideas:", error);
  }
}

function showIdeaDetails(idea) {
  selectedIdea.value = idea;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedIdea.value = {};
}

const filteredIdeas = computed(() => {
  if (!selectedStatus.value) {
    return ideasData.value;
  }
  return ideasData.value.filter((idea) => idea.ideaStatus === selectedStatus.value);
});

function setStatusFilter(status) {
  selectedStatus.value = status;
}

onMounted(() => {
  checkAccess();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Ideas</h1>

    <!-- Filter Options -->
    <div class="mb-4 flex justify-end space-x-4">
      <button
        @click="setStatusFilter('DRAFT')"
        :class="
          selectedStatus === 'DRAFT'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700'
        "
        class="px-4 py-2 rounded-lg focus:outline-none w-32 text-center"
      >
        {{ ideaStatusEnum.DRAFT }}
      </button>
      <button
        @click="setStatusFilter('SUBMITTED')"
        :class="
          selectedStatus === 'SUBMITTED'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700'
        "
        class="px-4 py-2 rounded-lg focus:outline-none w-32 text-center"
      >
        {{ ideaStatusEnum.SUBMITTED }}
      </button>
      <button
        @click="setStatusFilter('')"
        :class="
          selectedStatus === '' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        "
        class="px-4 py-2 rounded-lg focus:outline-none w-32 text-center"
      >
        All
      </button>
    </div>

    <!-- Ideas List with Headers -->
    <div class="bg-white shadow rounded-lg">
      <div class="grid grid-cols-6 gap-4 bg-gray-100 p-4 text-gray-700 font-semibold">
        <div>Title</div>
        <div>Description</div>
        <div>Interests</div>
        <div>Dietary Restrictions</div>
        <div>Status</div>
        <div></div>
        <!-- Empty header for the Details button -->
      </div>
      <div
        v-for="idea in filteredIdeas"
        :key="idea.ideaId"
        class="grid grid-cols-6 gap-4 p-4 border-b"
      >
        <div>{{ idea.title }}</div>
        <div>{{ idea.description }}</div>
        <div>
          <ul>
            <li v-for="interest in idea.interests" :key="interest">{{ interest }}</li>
          </ul>
        </div>
        <div>
          <ul>
            <li v-for="restriction in idea.dietaryRestrictions" :key="restriction">
              {{ restriction }}
            </li>
          </ul>
        </div>
        <div>{{ ideaStatusEnum[idea.ideaStatus] }}</div>
        <div class="text-right">
          <button
            @click="showIdeaDetails(idea)"
            class="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Details
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for Idea Details -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <div class="flex justify-between items-center border-b pb-4">
          <h3 class="text-xl font-semibold">Idea #{{ selectedIdea.ideaId }}</h3>
          <button @click="closeModal" class="text-gray-600 hover:text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="mt-4">
          <p><strong>Title: </strong> {{ selectedIdea.title }}</p>
          <p><strong>Description: </strong> {{ selectedIdea.description }}</p>
          <p>
            <strong>Interests: </strong>
            <span v-for="interest in selectedIdea.interests" :key="interest">
              {{ interest }}
            </span>
          </p>
          <p>
            <strong>Dietary Restrictions: </strong>
            <span
              v-for="restriction in selectedIdea.dietaryRestrictions"
              :key="restriction"
            >
              {{ restriction }}
            </span>
          </p>
          <p><strong>Status: </strong> {{ ideaStatusEnum[selectedIdea.ideaStatus] }}</p>
          <p>
            <strong>Created At: </strong>
            {{ new Date(selectedIdea.createdAt).toLocaleDateString() }}
          </p>
        </div>

        <div class="flex justify-end mt-4">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Add custom styles if needed */
</style>

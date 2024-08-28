<script setup>
import { ref } from "vue";
import axios from "axios";
import AIGeneratorModal from "./AIGeneratorModal.vue";

const title = ref("");
const description = ref("");
const interests = ref(["", "", ""]);
const restrictions = ref(["", "", ""]);

const showAIPopup = ref(false);

const toggleAIPopup = () => {
  showAIPopup.value = !showAIPopup.value;
};

const generateAIResponse = async () => {
  try {
    const authToken = localStorage.getItem("vue-token");
    const requestBody = {
      interests: interests.value,
      dietaryRestrictions: restrictions.value,
    };

    const response = await axios.post(
      "http://localhost:8081/ai/generate",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedIdea = response.data.idea;

    chatHistory.value.push({
      prompt: aiPrompt.value,
      response: generatedIdea,
    });

    aiResponse.value = generatedIdea;
    aiPrompt.value = "";
  } catch (error) {
    console.error("Error generating AI response:", error);
  }
};

const saveAsDraft = async () => {
  const authToken = localStorage.getItem("vue-token");
  const requestBody = {
    title: title.value,
    description: description.value,
    interests: interests.value,
    dietaryRestrictions: restrictions.value,
  };

  const response = await axios.post(
    "http://localhost:8081/users/ideas/draft",
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};

//Ahmad
const submitIdea = () => {
  console.log("Idea submitted:", {
    title: title.value,
    description: description.value,
    interests: interests.value,
    restrictions: restrictions.value,
  });
};
</script>

<template>
  <div class="w-full mx-auto p-6">
    <h2 class="text-2xl font-bold mb-10">Generate Idea</h2>

    <form @submit.prevent="submitIdea">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="flex justify-between gap-6">
          <div class="flex">
            <div>
              <div class="mb-4">
                <label for="title" class="block text-gray-700 font-medium mb-2">
                  Title
                </label>
                <input
                  v-model="title"
                  id="title"
                  type="text"
                  placeholder="Enter a title"
                  class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
              </div>
              <div class="mb-4">
                <label
                  for="description"
                  class="block text-gray-700 font-medium mb-2"
                >
                  Description
                </label>
                <textarea
                  v-model="description"
                  id="description"
                  rows="4"
                  placeholder="Enter a description"
                  class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  required
                ></textarea>
              </div>
            </div>
          </div>
          <button
          type="button"
          @click="generateAIResponse"
          class="h-10 px-4 py-2 border border-gray-700 text-gray-700 font-medium rounded-lg shadow hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          AI
        </button>
        </div>

        <div>
          <div>
            <h3 class="text-gray-700 font-medium mb-3">Interests</h3>
            <input
              v-model="interests[0]"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300 mb-2"
              placeholder="Interest 1"
              type="text"
            />
            <input
              v-model="interests[1]"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300 mb-2"
              placeholder="Interest 2"
              type="text"
            />
            <input
              v-model="interests[2]"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300 mb-2"
              placeholder="Interest 3"
              type="text"
            />
          </div>

          <!-- Dietary Restrictions -->
          <div>
            <h3 class="text-gray-700 font-medium mt-8 mb-3">
              Dietary Restrictions
            </h3>
            <input
              v-model="restrictions[0]"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300 mb-2"
              placeholder="Dietary Restriction 1"
              type="text"
            />
            <input
              v-model="restrictions[1]"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300 mb-2"
              placeholder="Dietary Restriction 2"
              type="text"
            />
            <input
              v-model="restrictions[2]"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300 mb-2"
              placeholder="Dietary Restriction 3"
              type="text"
            />
          </div>
        </div>
      </div>

      <!-- Button Group -->
      <div class="flex justify-between">
        <div>
          <button
            type="button"
            @click="saveAsDraft"
            class="px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 mr-3"
          >
            Save as Draft
          </button>

          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Submit
          </button>
        </div>

        <button
          type="button"
          @click="toggleAIPopup"
          class="px-4 py-2 border border-gray-700 text-gray-700 font-medium rounded-lg shadow hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Try AI
        </button>
      </div>
    </form>

    <!-- AI Generator Modal -->
    <AIGeneratorModal v-if="showAIPopup" @close="toggleAIPopup" />
  </div>
</template>

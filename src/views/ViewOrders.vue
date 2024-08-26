<script setup>
import { ref, computed, onMounted } from 'vue';

const orderData = ref({ orders: [] });
const selectedStatus = ref('');
const showModal = ref(false);
const selectedOrder = ref({});

// Enum mapping for order statuses
const orderStatusEnum = {
  1: 'Placed',
  2: 'In Process',
  3: 'Dispatched',
};

// Fetch order data from the API
async function fetchOrders() {
  try {
    const response = await fetch('http://localhost:8081/users/orders');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    orderData.value.orders = data.data.orders; // Ensure this maps correctly to 'orders'
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }
}

// Fetch order items from the API when an order is clicked
async function fetchOrderItems(orderId) {
  try {
    const response = await fetch(`http://localhost:8081/users/orders/${orderId}/orderitems`);
    if (!response.ok) {
      throw new Error('Failed to fetch order items');
    }
    const data = await response.json();
    // Map the order items correctly from the response
    selectedOrder.value.order_items = data.data.orderItems; // Use 'data.orderItems' from the response
  } catch (error) {
    console.error('Failed to fetch order items:', error);
  }
}

// Filter orders based on selected status
const filteredOrders = computed(() => {
  if (!selectedStatus.value) {
    return orderData.value.orders;
  }
  return orderData.value.orders.filter(
    (order) => order.orderStatusId === parseInt(selectedStatus.value)
  );
});

// Set selected status for filtering
function setStatusFilter(status) {
  selectedStatus.value = status;
}

// Show order details in the modal and fetch order items
function showOrderDetails(order) {
  selectedOrder.value = order;
  showModal.value = true;
  fetchOrderItems(order.id);
}

// Close the modal
function closeModal() {
  showModal.value = false;
  selectedOrder.value = {};
}

// Fetch orders on component mount
onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Order History</h1>

    <!-- Filter Options -->
    <div class="mb-4 flex space-x-4">
      <button @click="setStatusFilter('')"
        :class="selectedStatus === '' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-lg focus:outline-none">
        All
      </button>
      <button @click="setStatusFilter('1')"
        :class="selectedStatus === '1' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-lg focus:outline-none">
        {{ orderStatusEnum[1] }}
      </button>
      <button @click="setStatusFilter('2')"
        :class="selectedStatus === '2' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-lg focus:outline-none">
        {{ orderStatusEnum[2] }}
      </button>
      <button @click="setStatusFilter('3')"
        :class="selectedStatus === '3' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-lg focus:outline-none">
        {{ orderStatusEnum[3] }}
      </button>
    </div>

    <main class="flex-1 p-4">
      <!-- Order List -->
      <div class="space-y-4">
        <div v-for="order in filteredOrders" :key="order.id"
          class="bg-white shadow rounded-lg mb-4 p-4 flex justify-between items-center">
          <div class="flex-grow">
            <div class="flex justify-between">
              <h2 class="text-lg font-semibold">Order #{{ order.code }}</h2>
              <span class="text-sm text-gray-600">Placed on: {{ new Date(order.createdAt).toLocaleDateString() }}</span>
            </div>
            <div class="flex space-x-4 mt-2">
              <p><strong>Amount:</strong> {{ order.price }}</p>
              <p><strong>Status:</strong> {{ orderStatusEnum[order.orderStatusId] }}</p>
              <p><strong>User ID:</strong> {{ order.userId }}</p>
            </div>
          </div>
          <button @click="showOrderDetails(order)"
            class="ml-4 px-4 py-2 bg-blue-500 text-white rounded">Details</button>
        </div>
      </div>
    </main>

    <!-- Modal for Order Details -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg p-4 w-11/12 md:w-1/3">
        <h3 class="text-xl font-semibold mb-2">Order Details</h3>
        <div>
          <p><strong>Order Code:</strong> {{ selectedOrder.code }}</p>
          <p><strong>Amount:</strong> {{ selectedOrder.price }}</p>
          <p><strong>Status:</strong> {{ orderStatusEnum[selectedOrder.orderStatusId] }}</p>
          <p><strong>User ID:</strong> {{ selectedOrder.userId }}</p>
          <h4 class="font-semibold mt-2">Order Items:</h4>
          <ul>
            <li v-for="item in selectedOrder.order_items" :key="item.id" class="border-b py-2">
              <p><strong>Recipe ID:</strong> {{ item.recipeId }}</p>
              <p><strong>Quantity:</strong> {{ item.quantity }}</p>
              <p><strong>Added on:</strong> {{ new Date(item.createdAt).toLocaleDateString() }}</p>
            </li>
          </ul>
        </div>
        <button @click="closeModal" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Close</button>
      </div>
    </div>
  </div>
</template>

<style>

</style>
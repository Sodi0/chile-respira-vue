<template>
  <div class="min-h-screen flex flex-col">
    <Header />

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { onMounted, ref } from 'vue'
import { fetchSincaData } from './api/sinca'

const sincaData = ref([])

onMounted(async () => {
  sincaData.value = await fetchSincaData()
  console.log('Datos Sinca cargados:', sincaData.value)
})
</script>

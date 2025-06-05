<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold mb-4">Calidad del aire en Chile</h1>
      
      <div v-if="sincaData.length > 0">
        <MapaEstaciones :estaciones="sincaData" />
      </div>
      <div v-else-if="loading">
        <div class="flex items-center justify-center h-64">
          <div class="text-lg">Cargando datos...</div>
        </div>
      </div>
      <div v-else-if="error">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error al cargar los datos: {{ error }}
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import MapaEstaciones from './components/MapaEstaciones.vue'
import { onMounted, ref } from 'vue'
import { fetchSincaData } from './api/sinca'

const sincaData = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    sincaData.value = await fetchSincaData()
    console.log('Datos Sinca cargados:', sincaData.value)
  } catch (err) {
    console.error('Error cargando datos:', err)
    error.value = err.message || 'Error desconocido'
  } finally {
    loading.value = false
  }
})
</script>
<template>
  <div class="bg-white shadow-md rounded p-4 mb-4 border">
    <h2 class="text-lg font-bold">{{ estacion.nombre }}</h2>
    <p class="text-sm text-gray-500">{{ estacion.region }} - {{ estacion.comuna }}</p>
    <p class="mt-2">Contaminante: <strong>{{ estacion.tipo }}</strong></p>
    <p>Valor: <strong>{{ estacion.valor }}</strong> µg/m³</p>
    <p>Fecha: {{ estacion.fecha }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  estacion: {
    nombre: string
    region: string
    comuna: string
    tipo: string
    valor: number
    fecha: string
  }
}>()
</script>

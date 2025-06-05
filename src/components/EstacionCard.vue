<template>
  <div>
    <h2>{{ estacion.nombre }}</h2>
    <p>{{ estacion.region }} - {{ estacion.comuna }}</p>
    <p>Contaminante: <strong>{{ estacion.tipo }}</strong></p>
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

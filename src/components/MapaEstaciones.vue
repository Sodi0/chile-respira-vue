<template>
  <div>
    <main>   
      <div style="height:600px; width:100%">
        <l-map ref="map" v-model:zoom="zoom" :center="center">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
          
          <!-- Marcadores coloridos según calidad del aire -->
          <l-circle-marker
            v-for="(estacion, index) in estacionesValidas"
            :key="`estacion-${index}`"
            :lat-lng="[estacion.latitud, estacion.longitud]"
            :radius="getMarkerSize(estacion)"
            :color="getMarkerColor(estacion)"
            :fillColor="getMarkerColor(estacion)"
            :fillOpacity="0.7"
            :weight="3"
          >
            <l-popup :max-width="400">
              <CardDatosEstacion :estacion="estacion" />
            </l-popup>
          </l-circle-marker>
        </l-map>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import "leaflet/dist/leaflet.css"
import { LMap, LTileLayer, LCircleMarker, LPopup } from "@vue-leaflet/vue-leaflet"
import CardDatosEstacion from './CardDatosEstacion.vue'

const props = defineProps<{
  estaciones: Array<{
    nombre: string
    key: string
    latitud: number
    longitud: number
    comuna: string
    red: string
    region: string
    regionindex: number
    calificacion: string
    empresa: string
    realtime: Array<{
      code: string
      name: string
      datetime: string
      tableRow: {
        color: string
        status: string
        statuscode: number
        datetime: string
        parameter: string
        movil: string
        value: number
        unit: string
        icap: number
        icapText: string
      }
      info?: {
        rows: Array<{
          c: Array<{ v: any }>
        }>
      }
    }>
  }>
}>()

// Configuración del mapa
const zoom = ref(6)
const center = ref<[number, number]>([-33.4489, -70.6693])

// Filtrar estaciones válidas
const estacionesValidas = computed(() => {
  return props.estaciones.filter(estacion => {
    const lat = estacion.latitud
    const lon = estacion.longitud
    
    const esLatValida = !isNaN(lat) && lat >= -56 && lat <= -17
    const esLonValida = !isNaN(lon) && lon >= -76 && lon <= -66
    
    return esLatValida && esLonValida
  })
})

// Funciones para obtener color del marcador según estado
const getMarkerColor = (estacion: any) => {
  if (!estacion.realtime || !estacion.realtime[0] || !estacion.realtime[0].tableRow) {
    return '#9CA3AF'
  }
  
  const color = estacion.realtime[0].tableRow.color
  return color || '#9CA3AF'
}

// Obtener tamaño del marcador según el valor
const getMarkerSize = (estacion: any) => {
  if (!estacion.realtime || !estacion.realtime[0]) return 8
  
  const value = estacion.realtime[0].tableRow?.value || 0
  // Tamaño basado en el valor (mínimo 8, máximo 20)
  return Math.min(Math.max(8, value / 3), 20)
}
</script>

<style>
.leaflet-container {
  height: 100%;
  width: 100%;
  z-index: 0;
}

.leaflet-popup-content-wrapper {
  border-radius: 8px;
}
</style>
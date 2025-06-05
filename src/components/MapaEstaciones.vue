<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-grow container mx-auto px-4 py-6">
      <h2 class="text-2xl font-bold mb-4">
        Calidad del Aire en Tiempo Real - {{ estacionesValidas.length }} estaciones
      </h2>
      
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
              <div class="p-3 min-w-80">
                <!-- Header con estado actual -->
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-bold text-lg">{{ estacion.nombre }}</h3>
                  <div 
                    class="px-3 py-1 rounded-full text-white text-sm font-semibold"
                    :style="{ backgroundColor: getMarkerColor(estacion) }"
                  >
                    {{ getEstadoTexto(estacion) }}
                  </div>
                </div>
                
                <!-- Información básica -->
                <div class="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <p><strong>Comuna:</strong> {{ estacion.comuna }}</p>
                  <p><strong>Región:</strong> {{ estacion.region }}</p>
                </div>
                
                <!-- Datos actuales del contaminante -->
                <div v-if="estacion.realtime && estacion.realtime[0]" class="mb-3">
                  <div class="bg-gray-100 p-3 rounded">
                    <h4 class="font-semibold text-md mb-2">
                      {{ estacion.realtime[0].name }} - Estado Actual
                    </h4>
                    <div class="flex justify-between items-center">
                      <div>
                        <span class="text-2xl font-bold">{{ getCurrentValue(estacion) }}</span>
                        <span class="text-sm text-gray-600">µg/m³</span>
                      </div>
                      <div class="text-right">
                        <div class="text-sm text-gray-600">ICAP</div>
                        <div class="text-xl font-semibold">{{ getCurrentICAP(estacion) }}</div>
                      </div>
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                      Última actualización: {{ estacion.realtime[0].datetime }}
                    </div>
                  </div>
                </div>     
                <!-- Red y empresa -->
                <div class="text-xs text-gray-500 border-t pt-2">
                  <p><strong>Red:</strong> {{ estacion.red }}</p>
                  <p><strong>Empresa:</strong> {{ estacion.empresa }}</p>
                </div>
              </div>
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

// Props - ahora con la estructura real de SINCA
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
    return '#9CA3AF' // gris para sin datos
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

// Obtener texto del estado
const getEstadoTexto = (estacion: any) => {
  if (!estacion.realtime || !estacion.realtime[0]) return 'Sin datos'
  return estacion.realtime[0].tableRow?.status || 'Sin datos'
}

// Obtener valor actual
const getCurrentValue = (estacion: any) => {
  if (!estacion.realtime || !estacion.realtime[0]) return 'N/A'
  return estacion.realtime[0].tableRow?.value || 'N/A'
}

// Obtener ICAP actual
const getCurrentICAP = (estacion: any) => {
  if (!estacion.realtime || !estacion.realtime[0]) return 'N/A'
  return estacion.realtime[0].tableRow?.icap || 'N/A'
}

// Obtener tendencia para mini gráfico
const getTendencia = (estacion: any) => {
  if (!estacion.realtime || !estacion.realtime[0] || !estacion.realtime[0].info) {
    return []
  }
  
  const rows = estacion.realtime[0].info.rows || []
  const ultimas6 = rows.slice(-6) // Últimas 6 horas
  
  const valores = ultimas6.map(row => row.c[1]?.v || 0)
  const maxVal = Math.max(...valores, 1)
  
  return ultimas6.map(row => ({
    valor: row.c[1]?.v || 0,
    hora: row.c[0]?.v?.split(' ')[1] || '',
    color: row.c[2]?.v || '#9CA3AF',
    altura: Math.max(4, (row.c[1]?.v || 0) / maxVal * 40)
  }))
}

// Estadísticas generales
const estadisticas = computed(() => {
  const stats = {
    bueno: 0,
    regular: 0,
    malo: 0,
    sinDatos: 0
  }
  
  estacionesValidas.value.forEach(estacion => {
    if (!estacion.realtime || !estacion.realtime[0]) {
      stats.sinDatos++
      return
    }
    
    const status = estacion.realtime[0].tableRow?.status?.toLowerCase() || ''
    
    if (status.includes('bueno')) {
      stats.bueno++
    } else if (status.includes('regular') || status.includes('satisfactorio')) {
      stats.regular++
    } else if (status.includes('alerta') || status.includes('emergencia') || status.includes('crítico')) {
      stats.malo++
    } else {
      stats.sinDatos++
    }
  })
  
  return stats
})
</script>

<style>
.leaflet-container {
  height: 100%;
  width: 100%;
}

.leaflet-popup-content-wrapper {
  border-radius: 8px;
}
</style>
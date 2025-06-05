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
              <div>
                <!-- Header con estado actual -->
                <div>
                  <h3>{{ estacion.nombre }}</h3>
                  <div 
                    :style="{ backgroundColor: getMarkerColor(estacion) }"
                  >
                    {{ getEstadoTexto(estacion) }}
                  </div>
                </div>
                
                <!-- Información básica -->
                <div>
                  <p><strong>Comuna:</strong> {{ estacion.comuna }}</p>
                  <p><strong>Región:</strong> {{ estacion.region }}</p>
                </div>
                
                <!-- Datos actuales del contaminante -->
                <div v-if="estacion.realtime && estacion.realtime[0]">
                  <div>
                    <h4>
                      {{ estacion.realtime[0].name }} - Estado Actual
                    </h4>
                    <div>
                      <div>
                        <span>{{ getCurrentValue(estacion) }}</span>
                        <span>µg/m³</span>
                      </div>
                      <div>
                        <div>ICAP</div>
                        <div>{{ getCurrentICAP(estacion) }}</div>
                      </div>
                    </div>
                    <div>
                      Última actualización: {{ estacion.realtime[0].datetime }}
                    </div>
                  </div>
                </div>     
                <!-- Red y empresa -->
                <div>
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
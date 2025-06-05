<template>
  <div>
    <div>
      <h3>{{ estacion.nombre }}</h3>
      <div 
        :style="{ backgroundColor: getMarkerColor(estacion) }"
      >
        {{ getEstadoTexto(estacion) }}
      </div>
    </div>
    
    <div>
      <p><strong>Comuna:</strong> {{ estacion.comuna }}</p>
      <p><strong>Región:</strong> {{ estacion.region }}</p>
    </div>
    
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
    <div>
      <p><strong>Red:</strong> {{ estacion.red }}</p>
      <p><strong>Empresa:</strong> {{ estacion.empresa }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  estacion: {
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
  }
}>()

// Funciones para obtener color del marcador según estado
const getMarkerColor = (estacion: any) => {
  if (!estacion.realtime || !estacion.realtime[0] || !estacion.realtime[0].tableRow) {
    return '#9CA3AF'
  }
  
  const color = estacion.realtime[0].tableRow.color
  return color || '#9CA3AF'
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
</script>
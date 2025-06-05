<template>
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm w-full">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between max-w-screen-xl">
      <RouterLink to="/home" class="flex items-center">
        <img src="../assets/logo.png" alt="Logo" class="h-14 w-auto object-contain" />
      </RouterLink>
      <div class="flex items-center space-x-4">
        <RouterLink to="/home" class="text-gray-800 hover:text-blue-600">Inicio</RouterLink>
        <RouterLink to="/mapa" class="text-gray-800 hover:text-blue-600">Mapa</RouterLink>
        <RouterLink to="/estadisticas" class="text-gray-800 hover:text-blue-600">Estadísticas</RouterLink>
        <RouterLink to="/contacto" class="text-gray-800 hover:text-blue-600">Contacto</RouterLink>
      <nav class="hidden md:flex space-x-6">
      </nav>
    </div>
    </div>
  </header>
</template>
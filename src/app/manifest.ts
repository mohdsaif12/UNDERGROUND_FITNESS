import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FuelUp — Gym Cafe',
    short_name: 'FuelUp',
    description: 'Order fresh meals & shakes from the gym cafe',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8faf8',
    theme_color: '#3d8b37',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

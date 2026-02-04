// Development Service Worker - Minimal implementation
console.log("Development Service Worker loaded")

const CACHE_NAME = "fundilink-dev-v1"

// Install event
self.addEventListener("install", (event) => {
  console.log("Dev SW: Installing...")
  self.skipWaiting()
})

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Dev SW: Activating...")
  event.waitUntil(self.clients.claim())
})

// Fetch event - Pass through in development
self.addEventListener("fetch", (event) => {
  // Just pass through all requests in development
  return
})

// Message handler
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

const CACHE_NAME = "fundilink-v1.0.0"
const STATIC_CACHE_NAME = "fundilink-static-v1.0.0"
const DYNAMIC_CACHE_NAME = "fundilink-dynamic-v1.0.0"

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/_next/static/css/app/layout.css",
  "/_next/static/chunks/webpack.js",
  "/_next/static/chunks/main.js",
  "/_next/static/chunks/pages/_app.js",
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...")

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static assets")
        return cache.addAll(STATIC_ASSETS.map((url) => new Request(url, { cache: "reload" })))
      })
      .then(() => {
        console.log("Service Worker: Static assets cached")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("Service Worker: Error caching static assets:", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log("Service Worker: Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service Worker: Activated")
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith("http")) {
    return
  }

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => cache.put(request, responseClone))
          }
          return response
        })
        .catch(() => {
          // Fallback to cached page or offline page
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match("/offline.html")
          })
        }),
    )
    return
  }

  // Handle static assets
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icon-") ||
    url.pathname === "/manifest.json"
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(STATIC_CACHE_NAME).then((cache) => cache.put(request, responseClone))
          }
          return response
        })
      }),
    )
    return
  }

  // Handle API requests and other dynamic content
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200 && url.pathname.startsWith("/api/")) {
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => cache.put(request, responseClone))
        }
        return response
      })
      .catch(() => {
        // Fallback to cache for failed requests
        return caches.match(request)
      }),
  )
})

// Handle background sync
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered:", event.tag)

  if (event.tag === "background-sync") {
    event.waitUntil(
      // Handle background sync tasks
      Promise.resolve(),
    )
  }
})

// Handle push notifications
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push notification received")

  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body || "New notification from FundiLink",
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || "1",
        url: data.url || "/",
      },
      actions: [
        {
          action: "open",
          title: "Open App",
          icon: "/icon-192x192.png",
        },
        {
          action: "close",
          title: "Close",
          icon: "/icon-192x192.png",
        },
      ],
    }

    event.waitUntil(self.registration.showNotification(data.title || "FundiLink", options))
  }
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked")

  event.notification.close()

  if (event.action === "open" || !event.action) {
    const urlToOpen = event.notification.data?.url || "/"

    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(urlToOpen)
            return client.focus()
          }
        }

        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      }),
    )
  }
})

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  console.log("Service Worker: Message received:", event.data)

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})

// Handle install prompt
self.addEventListener("beforeinstallprompt", (event) => {
  console.log("Service Worker: Before install prompt")
  // This event is handled in the main thread
})

// Handle app installation
self.addEventListener("appinstalled", (event) => {
  console.log("Service Worker: App installed successfully")

  // Send message to main thread
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: "APP_INSTALLED",
        message: "App installed successfully",
      })
    })
  })
})

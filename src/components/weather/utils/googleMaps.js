
let googleMapsPromise = null

export function ensureGoogleMaps(apiKey) {
  if (typeof window === "undefined") return Promise.reject(new Error("window undefined"))
  if (window.google && window.google.maps && window.google.maps.places) {
    return Promise.resolve(window.google)
  }
  if (googleMapsPromise) return googleMapsPromise

  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&v=weekly`
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        resolve(window.google)
      } else {
        reject(new Error("Google maps failed to load"))
      }
    }
    script.onerror = (err) => reject(new Error("Google maps script failed to load"))
    document.head.appendChild(script)
  })
  return googleMapsPromise
}

import { ref } from 'vue'

export function useGeolocation() {
  const userPosition = ref(null)
  const locating = ref(false)
  const error = ref(null)

  function requestLocation() {
    if (!navigator.geolocation) {
      error.value = 'Geolocation is not supported by this browser.'
      return
    }

    locating.value = true
    error.value = null

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userPosition.value = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        }
        locating.value = false
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            error.value = 'locate.denied'
            break
          default:
            error.value = 'locate.error'
        }
        locating.value = false
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  function clearLocation() {
    userPosition.value = null
  }

  return { userPosition, locating, error, requestLocation, clearLocation }
}

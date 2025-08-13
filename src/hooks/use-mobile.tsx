import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    // This effect runs only on the client, after hydration
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Initial check
    checkDevice()

    // Listen for window resize
    window.addEventListener("resize", checkDevice)

    // Cleanup listener
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  return isMobile
}

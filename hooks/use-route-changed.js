import { useRouter } from 'next/router'
import { useEffect } from 'react'

const useRouteChanged = (fn ) => {
    const router = useRouter()
    useEffect(() => {
        const handleRouteChange = (url) => {
            fn()
            console.log('App is changing to: ', url)
        }

        router.events.on('routeChangeComplete', handleRouteChange)

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [router.events, fn])
}

export default useRouteChanged
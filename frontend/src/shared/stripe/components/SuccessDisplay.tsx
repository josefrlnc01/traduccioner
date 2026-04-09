
import Logo from './Logo'

export type SuccessDisplayProps = {
    sessionId: string
}
export default function SuccessDisplay({sessionId}: SuccessDisplayProps) {
    const urlBackend = import.meta.env.VITE_API_URL

    const handleCreatePortalSession = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const response = await fetch(`${urlBackend}/stripe/create-portal-session`, {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({session_id: sessionId})
        })

        const data = await response.json()

        if (!response.ok || !data?.url) {
            console.error('Error creando portal session', data)
            alert(data?.error ?? 'No se pudo abrir el portal de Stripe')
            return
        }

        window.location.href = data.url
    }

    return (
        <section>
            <div className="product Box-root">
                <Logo />
                <div className="description Box-root">
                    <h3>Subscription to Suscripción PRO AudWave successful!</h3>
                </div>
            </div>
            <form action="/create-portal-session" method="POST">
                <input
                    type="hidden"
                    name="session_id"
                />
                <button onClick={handleCreatePortalSession} type="submit">
                    Manage your billing information
                </button>
            </form>
        </section>
    )
}

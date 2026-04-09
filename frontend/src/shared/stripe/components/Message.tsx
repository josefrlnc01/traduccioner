

type StripeMessageProps = {
    message: string
}
export default function Message({ message }: StripeMessageProps) {
    return (
        <section>
            <p>{message}</p>
        </section>
    )
}

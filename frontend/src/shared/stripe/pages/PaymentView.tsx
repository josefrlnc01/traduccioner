import  { useEffect, useState } from 'react'
import ProductDisplay from '../components/ProductDisplay';
import SuccessDisplay from '../components/SuccessDisplay';
import Message from '../components/Message';
import { sessionIdStore } from '../stores/sessionStore';

export default function PaymentView() {
    let [message, setMessage] = useState('');
    let [success, setSuccess] = useState(false);
    let [sessionId, setSessionId] = useState('');
    console.log('success', success)
    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);

        if (query.get('success')) {
            setSuccess(true);
            setSessionId(query.get('session_id') ||'');
            sessionIdStore.set(query.get('session_id') || '')
        }

        if (query.get('canceled')) {
            setSuccess(false);
            setMessage(
                "Order canceled -- continue to shop around and checkout when you're ready."
            );
        }
    }, [sessionId]);

    if (!success && message === '') {
        return <ProductDisplay />;
    } else if (success && sessionId !== '') {
        return <SuccessDisplay sessionId={sessionId} />;
    } else {
        return <Message message={message} />;
    }
}


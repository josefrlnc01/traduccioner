import axios from 'axios'

export async function sendLink(link:string) {
    try {
        const response = await fetch('http://localhost:8000/link', {
            method:'POST',
            body: JSON.stringify(link),
            headers : {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()
        if (data) {
            console.log(data)
        }
    } catch (error) {
        console.error(error)
    }
}
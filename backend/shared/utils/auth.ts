import bcrypt from 'bcrypt'

export async function hashPassword (password: string) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export async function checkPassword (password:string, storedHash:string) {
    return await bcrypt.compare(password, storedHash)
}


export const getRequiredEnv = (key: string) => {
    const value = process.env[key]
    if (!value) throw new Error('Valor indefinido')
    return value
}
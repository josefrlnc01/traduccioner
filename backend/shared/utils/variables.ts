import 'dotenv/config'


export const getRequiredEnv = (key: string) => {
    const value = process.env[key]
    if (!value) throw new Error('Valor indefinido')
    return value
}

export const accessTokenKey = getRequiredEnv('ACCESS_JWT_KEY')
export const refreshTokenKey = getRequiredEnv('REFRESH_JWT_KEY')
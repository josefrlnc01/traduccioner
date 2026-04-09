let sessionId : string | null = null

export const sessionIdStore = {
    get : () => sessionId,
    set: (id: string) => sessionId = id
}
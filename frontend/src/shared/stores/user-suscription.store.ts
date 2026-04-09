let subscription: string | null = null

export const subscriptionStore = {
    get: () => subscription,
    set: (sus:string) => {
        subscription = sus
    }
}
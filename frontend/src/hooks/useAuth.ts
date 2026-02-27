import { getUser } from "@/api/AuthApi"
import { useQuery } from "@tanstack/react-query"


export const useAuth = () => {
    const {data, isError, isLoading} = useQuery({
        queryFn: getUser,
        queryKey: ['user'],
        retry:1,
        refetchOnWindowFocus: false
    })

    return {data, isError, isLoading}
}
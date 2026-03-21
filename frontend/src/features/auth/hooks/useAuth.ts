import { getUser } from "@/features/auth/api/authApi";
import { useQuery } from "@tanstack/react-query";
import { useRefreshToken } from "@/features/token/hooks/useRefreshToken";
import { tokenStore } from "@/lib/token.store";

export const useAuth = () => {
    const {
        data: accessToken,
        isLoading: isRefreshLoading,
        isError: isRefreshError,
    } = useRefreshToken();
    tokenStore.set(accessToken ?? null)
    const { data, isError, isLoading } = useQuery({
        queryFn: () => getUser(accessToken!),
        queryKey: ["user", accessToken],
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!accessToken
    });

    if (isRefreshLoading) {
        return { data: null, isError: false, isLoading: true };
    }

    if (isRefreshError || !accessToken) {
        return { data: null, isError: true, isLoading: false };
    }
    return { data, isError, isLoading };
};

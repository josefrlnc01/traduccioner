import { getRefreshToken } from "@/features/auth/api/authApi";
import { tokenStore } from "@/lib/token.store";
import { useQuery } from "@tanstack/react-query";


export const useRefreshToken = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["refresh-token"],
    queryFn: getRefreshToken,
    retry: false,
    refetchOnWindowFocus: false,
    //Si no hay token de login se ejecuta la query a refresh-token, si lo hay se usa el existente
    enabled: !tokenStore.get(),
    refetchInterval: () => (localStorage.getItem('isAuth') === 'true' ? 9 * 60 * 1000 : false),
    refetchIntervalInBackground: true,
  });

  return { data: data ?? tokenStore.get(), isError, isLoading }
};

import { removeItemFromCookie } from "@/utils/cookiesFunc";
import { RemoveItemFromLocalStorage } from "@/utils/localStorageFunc";
import { useRouter } from "next/navigation";

export const useLogoutFunc = () => {
  const router = useRouter();

  const logout = (url: string) => {
    removeItemFromCookie("token");
    RemoveItemFromLocalStorage("user");
    router.push(url);
  };

  return logout;
};

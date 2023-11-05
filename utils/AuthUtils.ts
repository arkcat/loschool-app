import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase"; // supabase 초기화 코드를 포함하는 파일

const useRequireAuth = () => {
  const [userSession, setUserSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authSession = supabase.auth.getSession();
        const currentSession = (await authSession).data.session;
        if (currentSession === null) {
          router.push("/");
        } else {
          setUserSession(currentSession);
        }
      } catch (error: any) {
        console.error("사용자 정보 가져오기 오류:", error.message);
        router.push("/");
      }
    };

    fetchUser();
  }, [router]);

  return userSession;
};

export default useRequireAuth;

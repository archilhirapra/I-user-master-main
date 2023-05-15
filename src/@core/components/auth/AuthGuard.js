// ** React Imports
import { useEffect } from "react";

// ** Next Imports
import { useRouter } from "next/router";

// ** Hooks Import
import { useAuth } from "src/hooks/useAuth";

const AuthGuard = (props) => {
  const { children, fallback } = props;
  const auth = useAuth();
  const router = useRouter();
  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }
      if (auth.user === null && !window.localStorage.getItem("accessToken")) {
        if (router.asPath !== "/") {
          router.replace({
            pathname: "/",
            query: { requireAuth: true, returnUrl: router.asPath },
          });
        } else {
          router.replace({
            pathname: "/",
            // query: { requireAuth: true, returnUrl: router.asPath },
          });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route, router.isReady]
  );
  if (auth.loading || auth.user === null) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthGuard;

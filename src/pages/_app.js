import AuthGuard from "src/@core/components/auth/AuthGuard";
import GuestGuard from "src/@core/components/auth/GuestGuard";
import {
  SettingsConsumer,
  SettingsProvider,
} from "src/@core/context/settingContext";
import { AuthProvider } from "src/context/AuthContext";
import { ServicesContextProvider } from "src/context/ServicesContext";
import "styles/globals.css";
import Layout from "../components/Layout";
import UserLayout from "../layouts/UserLayout";
import LoadingSpinner from "../components/LoadingSpinner";

const Guard = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) {
    return <GuestGuard fallback={<>Loading.....</>}>{children}</GuestGuard>;
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>;
  } else {
    return <AuthGuard fallback={<div className="h-screen flex items-center justify-center"><LoadingSpinner/></div>}>{children}</AuthGuard>;
  }
};

function MyApp({ Component, pageProps }) {
  // Variables
  const getLayout =
    Component.getLayout ?? ((page) => <UserLayout>{page}</UserLayout>);
  const setConfig = Component.setConfig ?? undefined;
  const authGuard = Component.authGuard ?? true;
  const guestGuard = Component.guestGuard ?? false;
  // const aclAbilities = Component.acl ?? defaultACLObj

  return (
    <>
      <AuthProvider>
        <ServicesContextProvider>
          <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <Layout>
                    <Guard authGuard={authGuard} guestGuard={guestGuard}>
                      {getLayout(<Component {...pageProps} />)}
                    </Guard>
                  </Layout>
                );
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </ServicesContextProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;

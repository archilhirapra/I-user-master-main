// ** Hook Import

import { userSettings } from "../@core/hooks/userSettings";

// import { useSettings } from 'src/@core/hooks/useSettings'
const UserLayout = ({ children }) => {
  const { settings, saveSettings } = userSettings();
  return <>{children}</>;
};
export default UserLayout;

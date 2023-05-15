import { useContext } from "react";
import { SettingsContext } from "src/@core/context/settingContext";

// eslint-disable-next-line react-hooks/rules-of-hooks
export const userSettings = () => useContext(SettingsContext);

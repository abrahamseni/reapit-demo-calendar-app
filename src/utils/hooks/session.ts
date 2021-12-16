import { useReapitConnect } from "@reapit/connect-session";
import { reapitConnectBrowserSession } from "../../core/connect-session";
import { useEffect, useState } from "react";
import { ListItemModel } from "@reapit/foundations-ts-definitions";
import { configurationAppointmentsApiService } from "../../platform-api/configuration-api";

export const useGetAppointmentConfigType = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession);
  const [appointmentConfigTypes, setAppointmentConfigTypes] = useState<
    ListItemModel[]
  >([]);

  useEffect(() => {
    const fetchAppoinmentConfigs = async () => {
      if (!connectSession) return;
      const serviceResponse = await configurationAppointmentsApiService(
        connectSession
      );
      if (serviceResponse) {
        setAppointmentConfigTypes(serviceResponse);
      }
    };
    if (connectSession) {
      fetchAppoinmentConfigs();
    }
  }, [connectSession]);

  return { connectSession, appointmentConfigTypes };
};

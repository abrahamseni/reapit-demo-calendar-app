import {
  useReapitConnect,
  ReapitConnectSession,
} from "@reapit/connect-session";
// import {
//   AppointmentModelPagedResult,
//   PropertyModelPagedResult,
// } from "@reapit/foundations-ts-definitions";
// import { useQuery } from "react-query";
// import axios from "../../axios";
import { reapitConnectBrowserSession } from "../../core/connect-session";
import { useEffect, useState } from "react";
import { ListItemModel } from "@reapit/foundations-ts-definitions";
import { configurationAppointmentsApiService } from "../../platform-api/configuration-api";

// async function getProperties({
//   queryKey,
// }: {
//   queryKey: [string, ReapitConnectSession | null, number, any];
// }): Promise<PropertyModelPagedResult> {
//   let params;
//   if (!queryKey[3]) {
//     params = "";
//   } else {
//     params = Object.keys(queryKey[3]).reduce((obj, el) => {
//       return obj.concat(`${el}=${queryKey[3][el]}`);
//     }, "&");
//   }

//   try {
//     const res = await axios.get(
//       `properties/?pageNumber=${queryKey[2]}${params}`,
//       {
//         headers: {
//           Authorization: `Bearer ${queryKey[1]?.accessToken}`,
//         },
//       }
//     );
//     return res.data;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Error getting properties");
//   }
// }

// export const useGetPropertiesBy = (page: number, options?: any) => {
//   const { connectSession } = useReapitConnect(reapitConnectBrowserSession);

//   const properties = useQuery<
//     PropertyModelPagedResult,
//     Error,
//     PropertyModelPagedResult,
//     [string, ReapitConnectSession | null, number, any]
//   >(["getProperties", connectSession, page, options], getProperties);
//   return properties;
// };

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

  return appointmentConfigTypes;
};

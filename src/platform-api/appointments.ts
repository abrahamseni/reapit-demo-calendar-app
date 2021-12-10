import { ReapitConnectSession } from "@reapit/connect-session";
import { AppointmentModelPagedResult } from "@reapit/foundations-ts-definitions";
import { URLS } from "../constants/api";
import { useQuery } from "react-query";
import axios from "../axios";

export const useGetAppointmentByNegotiator = (
  session: ReapitConnectSession | null,
  options: {
    negotiatorId: string;
  }
) => {
  const { negotiatorId } = options;

  const fetchAppointmentByNegotiator = async ({ queryKey }) => {
    if (!session) return;
    try {
      const data = await axios.get(
        `${window.reapit.config.platformApiUrl}${URLS.APPOINTMENTS}/?sortBy=-start&negotiatorId=${queryKey[1]}`,
        {
          headers: {
            Authorization: `Bearer ${queryKey[3].accessToken}`,
          },
        }
      );
      return data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting appointments.");
    }
  };
  const result = useQuery<
    AppointmentModelPagedResult,
    Error,
    AppointmentModelPagedResult,
    [string, string, ReapitConnectSession | null]
  >(
    ["getAppointmentsByNegotiator", negotiatorId, session],
    fetchAppointmentByNegotiator
  );

  return result;
};

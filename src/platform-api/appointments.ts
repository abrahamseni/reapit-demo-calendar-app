import * as React from "react";
import { ReapitConnectSession } from "@reapit/connect-session";
import { AppointmentModelPagedResult } from "@reapit/foundations-ts-definitions";
import { URLS } from "../constants/api";
import { useQuery, useMutation } from "react-query";
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
            Authorization: `Bearer ${queryKey[2].accessToken}`,
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

export const usePostNewAppointment = () => {
  const [data, setData] = React.useState();

  const actionPostAppointment = async ({
    session,
    body,
  }: {
    session: ReapitConnectSession;
    body: any;
  }) => {
    // axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
    return axios
      .post(
        `${window.reapit.config.platformApiUrl}${URLS.APPOINTMENTS}/`,
        body,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      )
      .catch((err) => console.error(err));
  };

  // @ts-ignore
  const postAppointment = useMutation(actionPostAppointment, {
    onError: (error) => console.log(error),
    // @ts-ignore
    onSuccess: (data) => {
      console.log("data:", data);
    },
  });

  return [postAppointment, data];
};

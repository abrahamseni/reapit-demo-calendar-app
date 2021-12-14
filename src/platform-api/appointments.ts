import * as React from "react";
import { ReapitConnectSession } from "@reapit/connect-session";
import { AppointmentModelPagedResult } from "@reapit/foundations-ts-definitions";
import { URLS } from "../constants/api";
import { useQuery, useMutation, useQueryClient } from "react-query";
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
  const queryClient = useQueryClient();

  const actionPostAppointment = async ({
    session,
    body,
  }: {
    session: ReapitConnectSession;
    body: any;
  }) => {
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

  const postAppointment = useMutation(actionPostAppointment, {
    onError: (error) => console.log(error),
    onSuccess: () => {
      queryClient.invalidateQueries(["getAppointmentsByNegotiator"]);
    },
  });

  return [postAppointment];
};

export const useEditAppointment = () => {
  const queryClient = useQueryClient();

  const actionEditAppointment = async ({
    session,
    body,
    etag,
    id,
  }: {
    session: ReapitConnectSession;
    body: any;
    etag: string;
    id: string;
  }) => {
    return axios
      .patch(
        `${window.reapit.config.platformApiUrl}${URLS.APPOINTMENTS}/${id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "If-Match": etag,
          },
        }
      )
      .catch((err) => console.error(err));
  };

  const editAppointment = useMutation(actionEditAppointment, {
    onError: (error) => console.log(error),
    onSuccess: () => {
      queryClient.invalidateQueries(["getAppointmentsByNegotiator"]);
    },
  });

  return [editAppointment];
};

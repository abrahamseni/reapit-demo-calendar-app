import { ReapitConnectSession } from "@reapit/connect-session";
import { PropertyModelPagedResult } from "@reapit/foundations-ts-definitions";
import { URLS, BASE_HEADERS } from "../constants/api";
import { useQuery } from "react-query";
import axios from "../axios";

export const getAllProperties = async (
  session: ReapitConnectSession
): Promise<PropertyModelPagedResult | undefined> => {
  try {
    const response = await fetch(
      `${window.reapit.config.platformApiUrl}${URLS.PROPERTIES}`,
      {
        method: "GET",
        headers: {
          ...BASE_HEADERS,
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (response) {
      const responseJson: Promise<PropertyModelPagedResult | undefined> =
        response.json();
      return responseJson;
    }

    throw new Error("No response returned by API");
  } catch (err) {
    console.error("Error fetching Properties", err);
  }
};

export const getPropertiesByAddress = async (
  session: ReapitConnectSession,
  pageNumber: number,
  address: string
): Promise<PropertyModelPagedResult | undefined> => {
  try {
    const response = await fetch(
      `${window.reapit.config.platformApiUrl}${URLS.PROPERTIES}/?pageNumber=${pageNumber}&address=${address}`,
      {
        method: "GET",
        headers: {
          ...BASE_HEADERS,
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (response) {
      const responseJson: Promise<PropertyModelPagedResult | undefined> =
        response.json();
      return responseJson;
    }

    throw new Error("No response returned by API");
  } catch (err) {
    console.error("Error fetching Properties", err);
  }
};

export const useGetPropertiesByAddress = (
  session: ReapitConnectSession | null,
  options: {
    pageNumber: number;
    address?: string;
  }
) => {
  const { pageNumber, address } = options;

  const fetchPropertiesByAddress = async ({ queryKey }) => {
    if (!session) return;
    try {
      const data = await axios.get(
        `${window.reapit.config.platformApiUrl}${URLS.PROPERTIES}/?pageNumber=${queryKey[1]}&address=${queryKey[2]}`,
        {
          headers: {
            Authorization: `Bearer ${queryKey[3].accessToken}`,
          },
        }
      );
      return data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting properties.");
    }
  };
  const propertiesResult = useQuery<
    PropertyModelPagedResult,
    Error,
    PropertyModelPagedResult,
    [string, number, string | undefined, ReapitConnectSession | null]
  >(
    ["getPropertiesByAddress", pageNumber, address, session],
    fetchPropertiesByAddress
  );

  return propertiesResult;
};

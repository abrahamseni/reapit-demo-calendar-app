import { ReapitConnectSession } from "@reapit/connect-session";
import { NegotiatorModel } from "@reapit/foundations-ts-definitions";
import { URLS } from "../constants/api";
import { useQuery } from "react-query";
import axios from "../axios";

export const useGetNegotiatorById = (
  session: ReapitConnectSession | null,
  options: {
    id: string;
  }
) => {
  const { id } = options;

  const fetchNegotiatorById = async ({
    queryKey,
  }): Promise<NegotiatorModel | undefined> => {
    if (!session) return;
    try {
      const data = await axios.get(
        `${window.reapit.config.platformApiUrl}${URLS.NEGOTIATORS}/${queryKey[1]}`,
        {
          headers: {
            Authorization: `Bearer ${queryKey[2].accessToken}`,
          },
        }
      );
      return data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting negotiator.");
    }
  };
  const result = useQuery<
    NegotiatorModel | undefined,
    Error,
    NegotiatorModel,
    [string, string, ReapitConnectSession | null]
  >(["getNegotiatorById", id, session], fetchNegotiatorById);

  return result;
};

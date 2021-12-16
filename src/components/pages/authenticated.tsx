import React, { useEffect, FC, useState } from "react";
import { Title, Subtitle, BodyText } from "@reapit/elements";
// import { useReapitConnect } from "@reapit/connect-session";
// import { reapitConnectBrowserSession } from "../../core/connect-session";
// import { configurationAppointmentsApiService } from "../../platform-api/configuration-api";
// import { ListItemModel } from "@reapit/foundations-ts-definitions";
import { Link } from "react-router-dom";
import { useGetAppointmentConfigType } from "../../utils/hooks/session";

export type AuthenticatedProps = {};

export const Authenticated: FC<AuthenticatedProps> = () => {
  // const { connectSession } = useReapitConnect(reapitConnectBrowserSession);
  // const [appointmentConfigTypes, setAppointmentConfigTypes] = useState<
  //   ListItemModel[]
  // >([]);

  // useEffect(() => {
  //   const fetchAppoinmentConfigs = async () => {
  //     if (!connectSession) return;
  //     const serviceResponse = await configurationAppointmentsApiService(
  //       connectSession
  //     );
  //     if (serviceResponse) {
  //       setAppointmentConfigTypes(serviceResponse);
  //     }
  //   };
  //   if (connectSession) {
  //     fetchAppoinmentConfigs();
  //   }
  // }, [connectSession]);
  const { appointmentConfigTypes } = useGetAppointmentConfigType();

  console.log("Appointment Config Types are: ", appointmentConfigTypes);
  return (
    <>
      <Title>Welcome To Reapit Foundations</Title>
      <Subtitle>Checkout our coolest apps:</Subtitle>
      <Link to="/calendar">AppoinIt</Link>
    </>
  );
};

export default Authenticated;

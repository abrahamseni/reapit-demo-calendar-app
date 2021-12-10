import * as React from "react";
import { useGetAppointmentByNegotiator } from "../../platform-api/appointments";
import { useReapitConnect } from "@reapit/connect-session";
import { reapitConnectBrowserSession } from "../../core/connect-session";
import { PropertyModel } from "@reapit/foundations-ts-definitions";
import { Card, Subtitle } from "@reapit/elements";
import { useGetNegotiatorById } from "../../platform-api/negotiators";

const TableAppointment = (props: PropertyModel) => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession);
  const negotiatorDataResult = useGetNegotiatorById(connectSession, {
    id: props.negotiatorId!,
  });
  const negotiatorSchedule = useGetAppointmentByNegotiator(connectSession, {
    negotiatorId: props.negotiatorId!,
  });

  const {
    data: negotiator,
    status: negotiatorFetchStatus,
    error: negotiatorError,
  } = negotiatorDataResult;

  const {
    data: schedule,
    status: scheduleFetchStatus,
    error: scheduleError,
  } = negotiatorSchedule;

  return (
    <div>
      <Card
        hasMainCard
        mainContextMenuItems={[
          {
            icon: "shareSystem",
            onClick: () => console.log("Clicking"),
          },
        ]}
        mainCardHeading="Property Details"
        mainCardSubHeading={props.address?.line1}
        mainCardSubHeadingAdditional={props.address?.buildingName}
        mainCardBody={props.description}
        hasListCard
        listCardHeading="Book an Appointment"
        listCardItems={[
          {
            listCardItemHeading: "Negotiator",
            listCardItemSubHeading: negotiator?.name,
            listCardItemIcon: "applicantInfographic",
            onClick: () => console.log("Clicking"),
          },
          {
            listCardItemHeading: "Property",
            listCardItemSubHeading: props.address?.line1,
            listCardItemIcon: "houseInfographic",
            onClick: () => console.log("Clicking"),
          },
        ]}
      />
    </div>
  );
};

export default TableAppointment;

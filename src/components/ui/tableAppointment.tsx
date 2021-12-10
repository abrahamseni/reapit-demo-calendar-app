import * as React from "react";
import { useGetAppointmentByNegotiator } from "../../platform-api/appointments";
import { useReapitConnect } from "@reapit/connect-session";
import { reapitConnectBrowserSession } from "../../core/connect-session";
import { PropertyModel } from "@reapit/foundations-ts-definitions";
import { Loader, Card, Subtitle, Modal, BodyText } from "@reapit/elements";
import { useGetNegotiatorById } from "../../platform-api/negotiators";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { modalBody } from "./__styles__/styles";
import { CalendarEventType } from "../types";

const localizer = momentLocalizer(moment);

const TableAppointment = (props: PropertyModel) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
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

  const [events, setEvents] = React.useState<CalendarEventType[]>();

  React.useEffect(() => {
    if (schedule) {
      const newEvents = schedule._embedded?.map((s) => {
        return {
          start: s.start ?? "",
          end: s.end ?? "",
          title: s.description ?? "",
        };
      });
      setEvents(newEvents);
    }
  }, [schedule]);

  return (
    <div>
      {negotiatorFetchStatus === "loading" ? (
        <Loader title="Loading..." />
      ) : negotiatorFetchStatus === "error" ? (
        <BodyText>Error getting negotiator data</BodyText>
      ) : (
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
              listCardItemHeading: "Schedule an Appointment",
              listCardItemSubHeading: "Check Available Dates",
              listCardItemIcon: "calendarSystem",
              onClick: () => setIsModalOpen(true),
            },
          ]}
        />
      )}
      <Modal
        isOpen={isModalOpen}
        onModalClose={() => setIsModalOpen(!isModalOpen)}
        title="Select Appointment Date"
      >
        {scheduleFetchStatus === "loading" ? (
          <Loader label="Loading..." />
        ) : scheduleFetchStatus === "error" ? (
          <BodyText>Error fetching Calendar</BodyText>
        ) : (
          <div className={modalBody}>
            <Calendar
              selectable
              localizer={localizer}
              defaultDate={moment().toDate()}
              defaultView="month"
              style={{ height: "100%" }}
              views={["month"]}
              events={events}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TableAppointment;

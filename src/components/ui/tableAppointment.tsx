import * as React from "react";
import { useGetAppointmentByNegotiator } from "../../platform-api/appointments";
import { useReapitConnect } from "@reapit/connect-session";
import { reapitConnectBrowserSession } from "../../core/connect-session";
import { PropertyModel } from "@reapit/foundations-ts-definitions";
import { Loader, Card, BodyText, useSnack, useModal } from "@reapit/elements";
import { useGetNegotiatorById } from "../../platform-api/negotiators";
import { SlotInfo, Event } from "react-big-calendar";
import { compareAsc } from "date-fns";
import AppointmentModal from "../utils/appointmentModal";
import CalendarModalBody from "./calendarModalBody";

const TableAppointment = (props: PropertyModel) => {
  const {
    Modal: CalendarModal,
    openModal: openCalendarModal,
    closeModal: closeCalendarModal,
  } = useModal("root");
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

  const [events, setEvents] = React.useState<Event[]>();
  const [reservedEvent, setReservedEvent] = React.useState<Event>();

  const {
    Modal: ReservedModal,
    openModal: openReservedModal,
    closeModal: closeReservedModal,
  } = useModal("root");
  const { error: snackError } = useSnack();

  React.useEffect(() => {
    if (schedule) {
      const newEvents = schedule._embedded?.map((s) => {
        return {
          start: new Date(s.start ?? ""),
          end: new Date(s.end ?? ""),
          title: s.description === "" ? "Template Title" : s.description,
          resource: {
            tag: s._eTag,
            id: s.id,
            type:
              compareAsc(new Date(s.start ?? ""), Date.now()) === -1
                ? "old"
                : "edit",
            viewType: s.typeId,
          },
        };
      });
      setEvents(newEvents);
    }
  }, [schedule]);

  const reservedAppointment = (event: SlotInfo) => {
    if (compareAsc(new Date(event.start), Date.now()) === -1) {
      snackError("Can't reserved time before today", 3000);
      return;
    }
    if (event) {
      setReservedEvent({
        start: new Date(event.start),
        end: new Date(event.end),
        title: "applicant name here?",
        resource: {
          type: "new",
        },
      });
      openReservedModal();
    }
  };

  const openEditAppointment = (event: Event) => {
    if (event) {
      setReservedEvent({
        start: event.start,
        end: event.end,
        title: event.title,
        resource: event.resource,
      });
      openReservedModal();
    }
  };

  return (
    <div>
      {negotiatorFetchStatus === "loading" ? (
        <Loader label="Fetching negotiator data" />
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
              onClick: openCalendarModal,
            },
          ]}
        />
      )}
      <CalendarModal title="Select Appointment Time">
        {scheduleFetchStatus === "loading" ? (
          <Loader label="Fetching Schedule..." />
        ) : scheduleFetchStatus === "error" ? (
          <BodyText>Error fetching Calendar</BodyText>
        ) : (
          events && (
            <CalendarModalBody
              events={events}
              reservedAppointment={reservedAppointment}
              openEditAppointment={openEditAppointment}
            />
          )
        )}
      </CalendarModal>
      <ReservedModal
        title={`${
          reservedEvent?.resource.type === "edit"
            ? "Edit"
            : reservedEvent?.resource.type === "new"
            ? "Make New"
            : "Past"
        } Appointment for ${props.address?.buildingName}`}
      >
        {reservedEvent && reservedEvent.resource.type && (
          <AppointmentModal
            property={props}
            reservedEvent={reservedEvent}
            closeReservedModal={closeReservedModal}
            type={reservedEvent.resource.type}
          />
        )}
      </ReservedModal>
    </div>
  );
};

export default TableAppointment;

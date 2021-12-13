import * as React from "react";
import {
  useGetAppointmentByNegotiator,
  usePostNewAppointment,
} from "../../platform-api/appointments";
import { useReapitConnect } from "@reapit/connect-session";
import { reapitConnectBrowserSession } from "../../core/connect-session";
import {
  PropertyModel,
  ListItemModel,
} from "@reapit/foundations-ts-definitions";
import {
  Button,
  Loader,
  Card,
  Subtitle,
  Modal,
  BodyText,
  useSnack,
  InputGroup,
  SearchableDropdown,
  SearchableDropdownSearchLabel,
  useModal,
} from "@reapit/elements";
import { useGetNegotiatorById } from "../../platform-api/negotiators";
import {
  Calendar,
  momentLocalizer,
  Views,
  SlotInfo,
  dateFnsLocalizer,
} from "react-big-calendar";
import moment from "moment";
import { modalBody } from "./__styles__/styles";
import { CalendarEventType } from "../../types/events";
import { compareAsc, format, parse, startOfWeek, getDay, add } from "date-fns";
import enAU from "date-fns/esm/locale/en-AU";
import { formatDate } from "../../utils/formats";
import { useGetAppointmentConfigType } from "../../utils/hooks/api";
import { Space } from "../utils/space";

// const localizer = momentLocalizer(moment);
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-AU": enAU },
});

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

  const [events, setEvents] = React.useState<CalendarEventType[]>();
  const [reservedEvent, setReservedEvent] = React.useState<CalendarEventType>();
  const [reservedEventTitle, setReservedEventTitle] = React.useState<
    string | undefined
  >();
  const [reservedEventViewType, setReservedEventViewType] = React.useState<
    string | undefined
  >();
  const [createReservedAppointment, data] = usePostNewAppointment();
  const {
    Modal: ReservedModal,
    openModal: openReservedModal,
    closeModal: closeReservedModal,
  } = useModal("root");
  const { error: snackError } = useSnack();
  const appointmentConfigTypes = useGetAppointmentConfigType();

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

  const reservedAppointment = (event: SlotInfo) => {
    if (compareAsc(new Date(event.start), Date.now()) === -1) {
      snackError("Can't reserved time before today", 3000);
      return;
    }
    console.log("createEvent", event);
    if (event) {
      setReservedEvent({
        start: event.start as string,
        end: event.end as string,
        title: "applicant name here?",
      });
      openReservedModal();
    }
  };

  const saveConfirmedAppointment = () => {
    if (!connectSession) return;

    //! need to post it to Appointments API
    const body = JSON.stringify({
      start: reservedEvent?.start,
      end: reservedEvent?.end,
      followUpOn: formatDate(
        add(new Date(reservedEvent?.end as string), { weeks: 2 }),
        "yyyy-MM-dd"
      ),
      typeId: reservedEventViewType ?? "VW",
      description: reservedEventTitle ?? "",
      organiserId: props.negotiatorId,
      negotiatorIds: [props.negotiatorId],
      officeIds: props.officeIds,
      attendee: {
        id: "MKT210196",
        type: "applicant",
      },
      propertyId: props.id,
      accompanied: true,
      negotiatorConfirmed: false,
      attendeeConfirmed: true,
      propertyConfirmed: true,
      virtual: false,
      recurrence: {
        interval: 0,
        type: null,
        until: null,
      },
      metadata: {
        CustomField1: "CustomValue1",
        CustomField2: true,
      },
    });

    createReservedAppointment?.mutate(
      { session: connectSession, body },
      {
        onSuccess: (data) => console.log("success", data),
      }
    );
    // setEvents((previousEvent) => {
    //   if (reservedEvent) {
    //     reservedEvent.title = reservedEventTitle
    //     return previousEvent?.concat(reservedEvent);
    //   }
    // });
    closeReservedModal();
  };

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
              onClick: openCalendarModal,
            },
          ]}
        />
      )}
      <CalendarModal title="Select Appointment Time">
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
              defaultView={Views.MONTH}
              style={{ height: "100%" }}
              views={["month", "week", "day"]}
              events={events}
              step={30}
              timeslots={12}
              onSelectSlot={reservedAppointment}
            />
          </div>
        )}
      </CalendarModal>
      <ReservedModal
        title={`Reserved an Appointment for ${props.address?.buildingName}`}
      >
        {reservedEvent && reservedEvent.start && (
          <>
            <BodyText hasBoldText>{reservedEvent?.title}</BodyText>
            <BodyText hasGreyText>
              Date: {formatDate(reservedEvent.start, "MMMM dd, yyyy")}
            </BodyText>
            <BodyText hasGreyText>
              From: {formatDate(reservedEvent.start, "HH:mm a")} -{" "}
              {formatDate(reservedEvent.end, "HH:mm a")}
            </BodyText>
          </>
        )}
        <Space height="12px" />
        <InputGroup
          label="Title"
          type="text"
          icon="houseInfographic"
          onChange={(event) => setReservedEventTitle(event.target.value)}
        />
        <Space height="12px" />
        <SearchableDropdownSearchLabel>
          Appointment Type:
        </SearchableDropdownSearchLabel>
        <SearchableDropdown<ListItemModel>
          getResults={async (query) => {
            return new Promise((resolve) => {
              resolve(
                appointmentConfigTypes.filter((type) =>
                  type.value?.toLowerCase().includes(query.trim())
                )
              );
            });
          }}
          getResultValue={(result) => (result.id ? result.id : "")}
          getResultLabel={(result) => (result.value ? result.value : "")}
          onChange={(event) => setReservedEventViewType(event.target.value)}
        />
        <Space height="24px" />
        <Button intent="neutral" onClick={closeReservedModal}>
          Cancel
        </Button>
        <Button intent="primary" onClick={saveConfirmedAppointment}>
          Reserved
        </Button>
      </ReservedModal>
    </div>
  );
};

export default TableAppointment;

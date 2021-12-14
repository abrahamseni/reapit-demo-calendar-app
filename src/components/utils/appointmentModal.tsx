import * as React from "react";
import {
  BodyText,
  InputGroup,
  SearchableDropdownSearchLabel,
  SearchableDropdown,
  Button,
} from "@reapit/elements";
import add from "date-fns/add";
import { Space } from "./space";
import {
  ListItemModel,
  PropertyModel,
} from "@reapit/foundations-ts-definitions";
import { formatDate } from "../../utils/formats";
import { useGetAppointmentConfigType } from "../../utils/hooks/api";
import { Event } from "react-big-calendar";
import {
  usePostNewAppointment,
  useEditAppointment,
} from "../../platform-api/appointments";
import { useReapitConnect } from "@reapit/connect-session";
import { reapitConnectBrowserSession } from "../../core/connect-session";

interface Props {
  property: PropertyModel;
  reservedEvent: Event;
  closeReservedModal: () => void;
  type: "new" | "edit";
}

const AppointmentModal = ({
  property,
  reservedEvent,
  closeReservedModal,
  type,
}: Props) => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession);
  const appointmentConfigTypes = useGetAppointmentConfigType();
  const [createReservedAppointment] = usePostNewAppointment();
  const [editAppointment] = useEditAppointment();
  const [reservedEventTitle, setReservedEventTitle] = React.useState<
    string | undefined
  >();
  const [reservedEventViewType, setReservedEventViewType] = React.useState<
    string | undefined
  >();

  const saveConfirmedAppointment = () => {
    if (!connectSession) return;

    const body = JSON.stringify({
      start: reservedEvent?.start,
      end: reservedEvent?.end,
      followUpOn: formatDate(
        add(new Date(reservedEvent?.end ?? ""), { weeks: 2 }),
        "yyyy-MM-dd"
      ),
      typeId: reservedEventViewType ?? "VW",
      description: reservedEventTitle ?? "",
      organiserId: property.negotiatorId,
      negotiatorIds: [property.negotiatorId],
      officeIds: property.officeIds,
      attendee: {
        id: "MKT210196",
        type: "applicant",
      },
      propertyId: property.id,
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

    createReservedAppointment?.mutateAsync(
      { session: connectSession, body },
      {
        onSuccess: (data) => console.log("success", data),
      }
    );
    // setEvents((previousEvent) => {
    //   if (reservedEvent) {
    //     reservedEvent.title = reservedEventTitle;
    //     return previousEvent?.concat(reservedEvent);
    //   }
    // });
    closeReservedModal();
  };

  const saveEditReservedAppointment = async () => {
    console.log(reservedEvent);
    if (!connectSession) return;

    const editedEvent = {
      start: "2021-12-24T12:30:02.0000000Z",
      end: "2021-12-24T13:30:02.0000000Z",
      followUpOn: "2021-12-31",
      typeId: "VW",
      description: "Meet landlord at the property to get the key.",
      propertyId: "OXF190022",
      organiserId: "JAS",
      cancelled: false,
      negotiatorIds: ["JAS"],
      officeIds: ["OXF", "SOL"],
      attendee: {
        id: "OXF20001",
        type: "applicant",
        confirmed: false,
      },
      accompanied: true,
      virtual: null,
      negotiatorConfirmed: true,
      attendeeConfirmed: true,
      propertyConfirmed: true,
      followUp: {
        responseId: "OXF190022",
        notes: "Meet at the property.",
      },
      recurrence: null,
      metadata: {
        CustomField1: "CustomValue1",
        CustomField2: true,
      },
    };
    await editAppointment.mutateAsync({
      session: connectSession,
      body: editedEvent,
      etag: reservedEvent.resource.tag,
      id: reservedEvent.resource.id,
    });
  };

  return (
    <>
      {reservedEvent.start && (
        <>
          <BodyText hasBoldText>{reservedEvent?.title}</BodyText>
          <BodyText hasGreyText>
            Date: {formatDate(reservedEvent.start, "MMMM dd, yyyy")}
          </BodyText>
          <BodyText hasGreyText>
            From: {formatDate(reservedEvent.start, "HH:mm a")} -{" "}
            {formatDate(reservedEvent.end ?? "", "HH:mm a")}
          </BodyText>
        </>
      )}
      <Space height="12px" />
      <InputGroup
        label="Appointment Title"
        type="text"
        icon="houseInfographic"
        onChange={(event) => setReservedEventTitle(event.target.value)}
        value={reservedEvent.title as string}
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
      <Button
        intent="primary"
        onClick={() => {
          if (type === "new") {
            saveConfirmedAppointment();
          } else {
            saveEditReservedAppointment();
          }
        }}
      >
        {type === "edit" ? "Edit" : "Reserved"}
      </Button>
    </>
  );
};

export default AppointmentModal;

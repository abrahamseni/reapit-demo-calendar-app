import * as React from "react";
import {
  Event,
  Calendar,
  Views,
  dateFnsLocalizer,
  SlotInfo,
} from "react-big-calendar";
import { modalBody } from "./__styles__/styles";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enAU from "date-fns/esm/locale/en-AU";

interface CalendarProps {
  events: Event[];
  reservedAppointment: (event: SlotInfo) => void;
  openEditAppointment: (event: Event) => void;
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-AU": enAU },
});

const CalendarModalBody: React.FC<CalendarProps> = ({
  events,
  reservedAppointment,
  openEditAppointment,
}) => {
  return (
    <div className={modalBody}>
      <Calendar
        selectable
        localizer={localizer}
        defaultDate={new Date(Date.now())}
        defaultView={Views.MONTH}
        style={{ height: "100%" }}
        views={["month", "week", "day"]}
        events={events}
        step={30}
        timeslots={12}
        onSelectSlot={reservedAppointment}
        onSelectEvent={openEditAppointment}
        dayLayoutAlgorithm="no-overlap"
      />
    </div>
  );
};

export default CalendarModalBody;

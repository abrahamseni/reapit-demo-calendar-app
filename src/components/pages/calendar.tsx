import * as React from "react";
import {
  Pagination,
  Snack,
  SnackProvider,
  InputGroup,
  Title,
  Input,
  Table,
  Label,
  RowProps,
  Loader,
} from "@reapit/elements";
import { useGetPropertiesByAddress } from "../../platform-api/properties";
import { useReapitConnect } from "@reapit/connect-session";
import { reapitConnectBrowserSession } from "../../core/connect-session";
import { createTableRows } from "../../utils/helpers";
import { Space } from "../utils/space";

interface Props {}

const Calendar = (props: Props) => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession);
  const [address, setAddress] = React.useState("");
  const [pageNumber, setPageNumber] = React.useState(1);
  const [rows, setRows] = React.useState<RowProps[]>([]);

  const propertiesResult = useGetPropertiesByAddress(connectSession, {
    pageNumber,
    address,
  });
  const { status, data, error } = propertiesResult;

  React.useEffect(() => {
    if (data) {
      setRows(createTableRows(data));
    }
  }, [data]);

  const renderTable = () => {
    if (status === "loading") {
      return <Loader label="In progress..." />;
    } else if (status === "error") {
      return (
        <Snack intent="danger" icon="errorSolidSystem">
          Error getting Properties.
          <p>{error?.message}</p>
        </Snack>
      );
    } else {
      return (
        <>
          <Table rows={rows} />
          <Pagination
            callback={setPageNumber}
            currentPage={pageNumber}
            numberPages={data?.pageSize!}
          />
        </>
      );
    }
  };

  return (
    <SnackProvider>
      <Title>Calendar App</Title>
      <InputGroup
        label="Search by Address"
        type="search"
        placeholder="London"
        onChange={(event) => setAddress(event.target.value)}
      />
      <Space height="16px" />
      {renderTable()}
    </SnackProvider>
  );
};

export default Calendar;

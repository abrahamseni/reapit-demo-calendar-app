import * as React from "react";
import {
  Pagination,
  Snack,
  InputGroup,
  Title,
  Input,
  Table,
  Label,
  RowProps,
  Loader,
} from "@reapit/elements";
import {
  getAllProperties,
  getPropertiesByAddress,
} from "../../platform-api/properties";
import { useGetPropertiesByAddress } from "../../platform-api/properties";
import { useReapitConnect } from "@reapit/connect-session";
import { reapitConnectBrowserSession } from "../../core/connect-session";
import { createTableRows } from "../../utils/helpers";

interface Props {}

const Calendar = (props: Props) => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession);
  const [address, setAddress] = React.useState("");
  // const [page, setPage] = React.useState({
  //   current: 1,
  //   propertiesPerPage: 25,
  // });
  const [pageNumber, setPageNumber] = React.useState(1);
  const [rows, setRows] = React.useState<RowProps[]>([]);
  // const [loading, setLoading] = React.useState<boolean>(false);
  // const [error, setError] = React.useState<unknown | string>("");

  // // render all properties on first load
  // React.useEffect(() => {
  //   const fetchAllProperties = async () => {
  //     if (!connectSession) return;
  //     setLoading(true);
  //     try {
  //       const data = await getAllProperties(connectSession);
  //       setRows(createTableRows(data));
  //     } catch (error) {
  //       console.error(error);
  //       setError("Error getting properties data");
  //     }
  //     setLoading(false);
  //   };
  //   fetchAllProperties();
  // }, [connectSession]);

  // // render properties based on address and or page change
  // React.useEffect(() => {
  //   const fetchPropertiesByAddress = async () => {
  //     if (!connectSession) return;
  //     setLoading(true);
  //     try {
  //       const data = await getPropertiesByAddress(
  //         connectSession,
  //         page.current,
  //         address
  //       );
  //       setRows(createTableRows(data));
  //     } catch (error) {
  //       console.error(error);
  //       setError("Error getting properties data");
  //     }
  //     setLoading(false);
  //   };
  //   fetchPropertiesByAddress();
  // }, [page, address]);

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
      return <Loader label="loader" />;
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
    <div>
      <Title>Calendar App</Title>
      <InputGroup>
        <Label>Search by Address</Label>
        <Input
          type="search"
          placeholder="London"
          onChange={(event) => setAddress(event.target.value)}
        />
      </InputGroup>
      {renderTable()}
    </div>
  );
};

export default Calendar;

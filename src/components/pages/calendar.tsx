import * as React from "react";
import {
  Subtitle,
  Pagination,
  Snack,
  SnackProvider,
  InputGroup,
  Title,
  Table,
  RowProps,
  Loader,
} from "@reapit/elements";
import { useGetPropertiesByAddress } from "../../platform-api/properties";
import { useReapitConnect } from "@reapit/connect-session";
import { reapitConnectBrowserSession } from "../../core/connect-session";
import { createTableRows } from "../../utils/helpers";
import { Space } from "../utils/space";
import { searchBox } from "./__styles__/styles";

interface Props {}

const Calendar: React.FC<Props> = () => {
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
        <div className="el-flex el-flex-column">
          <Table rows={rows} />
          <Space height="8px" />
          <Pagination
            callback={setPageNumber}
            currentPage={pageNumber}
            numberPages={data?.pageSize!}
          />
        </div>
      );
    }
  };

  return (
    <SnackProvider>
      <Title>AppointIt</Title>
      <Subtitle>Search Listing</Subtitle>
      <div className={`el-flex el-p6 ${searchBox}`}>
        <InputGroup
          label="Search by Address"
          type="search"
          placeholder="London"
          onChange={(event) => setAddress(event.target.value)}
          className="el-flex1 el-mr3"
        />
      </div>
      <Space height="16px" />
      <div className="el-flex el-flex-column el-flex-justify-start">
        {renderTable()}
      </div>
    </SnackProvider>
  );
};

export default Calendar;

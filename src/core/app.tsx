import * as React from "react";
import Router from "./router";
import ErrorBoundary from "../components/hocs/error-boundary";
import { MediaStateProvider, NavStateProvider } from "@reapit/elements";
import "@reapit/elements/dist/index.css";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={new QueryClient()}>
        <NavStateProvider>
          <MediaStateProvider>
            <Router />
          </MediaStateProvider>
        </NavStateProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

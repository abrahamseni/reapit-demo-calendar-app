import React, { FC, ReactElement } from "react";
import { render, queries, RenderOptions } from "@testing-library/react";
import { MediaStateProvider, NavStateProvider } from "@reapit/elements";
import { QueryClientProvider, QueryClient } from "react-query";
import * as customQueries from "./customQueries";

const AllTheProviders: FC = ({ children }) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <NavStateProvider>
        <MediaStateProvider>{children}</MediaStateProvider>
      </NavStateProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "queries">
) =>
  render(ui, {
    wrapper: AllTheProviders,
    queries: { ...queries, ...customQueries },
    ...options,
  });

export * from "@testing-library/react";
export { customRender as render };

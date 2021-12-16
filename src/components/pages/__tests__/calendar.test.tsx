import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render } from "../../../utils/rtl/test-utils";
import { fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Calendar from "../calendar";
import Authenticated from "../authenticated";

const server = setupServer(
  rest.get("/calendar", (req, res, ctx) => {
    return res(ctx.json({ greeting: "hello there" }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("loads and displays greeting", async () => {
  render(<Authenticated />);
  // fireEvent.click(screen.getByText('Load Greeting'))
  await waitFor(() => screen.getByRole("heading"));

  expect(screen.getByRole("heading")).toHaveTextContent("AppointIt");
});

// test('handles server error', async () => {
//   server.use(
//     rest.get('/greeting', (req, res, ctx) => {
//       return res(ctx.status(500))
//     }),
//   )

//   render(<Fetch url="/greeting" />)

//   fireEvent.click(screen.getByText('Load Greeting'))

//   await waitFor(() => screen.getByRole('alert'))

//   expect(screen.getByRole('alert')).toHaveTextContent('Oops, failed to fetch!')
//   expect(screen.getByRole('button')).not.toBeDisabled()
// })
// import { AppointmentModelPagedResult } from "@reapit/foundations-ts-definitions";
// import { mockBrowserSession } from "../__mocks__/session";
// import { useGetAppointmentByNegotiator } from "../appointments";

// const mockedFetch = jest.spyOn(window, "fetch");
// const mockAppointments = [
//   {
//     pageNumber: 8,
//     pageSize: 25,
//     _embedded: [
//       {
//         id: "some id",
//         start: "2019-08-14T12:30:02.0000000Z",
//         end: "2019-08-14T12:30:02.0000000Z",
//       },
//     ],
//   },
// ] as AppointmentModelPagedResult[];

// describe("getAppointmentsByNegotiator", () => {
//   it("should return a response from the config service", async () => {
//     mockedFetch.mockReturnValueOnce({
//       json: jest.fn(() => mockAppointments),
//     } as any);
//     expect(
//       await useGetAppointmentByNegotiator(mockBrowserSession, {
//         negotiatorId: "JAS",
//       })
//     ).toEqual(mockAppointments);
//     expect(mockedFetch).toHaveBeenCalledTimes(1);
//   });

//   it("should catch an error if no response from config service", async () => {
//     const errorSpy = jest.spyOn(console, "error");
//     mockedFetch.mockReturnValueOnce(undefined as any);
//     await useGetAppointmentByNegotiator(mockBrowserSession, {
//       negotiatorId: "JAS",
//     });
//     expect(errorSpy).toHaveBeenCalledWith(
//       "Error fetching Properties",
//       new Error("No response returned by API")
//     );
//   });
// });

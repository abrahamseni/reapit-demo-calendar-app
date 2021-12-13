import { PropertyModelPagedResult } from "@reapit/foundations-ts-definitions";
import { mockBrowserSession } from "../__mocks__/session";
import { getAllProperties } from "../properties";

const mockedFetch = jest.spyOn(window, "fetch");
const mockConfigurationAppointments = [
  {
    pageNumber: 8,
    pageSize: 25,
  },
] as PropertyModelPagedResult[];

describe("getAllProperties", () => {
  it("should return a response from the config service", async () => {
    mockedFetch.mockReturnValueOnce({
      json: jest.fn(() => mockConfigurationAppointments),
    } as any);
    expect(await getAllProperties(mockBrowserSession)).toEqual(
      mockConfigurationAppointments
    );
    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });

  it("should catch an error if no response from config service", async () => {
    const errorSpy = jest.spyOn(console, "error");
    mockedFetch.mockReturnValueOnce(undefined as any);
    await getAllProperties(mockBrowserSession);
    expect(errorSpy).toHaveBeenCalledWith(
      "Error fetching Properties",
      new Error("No response returned by API")
    );
  });
});

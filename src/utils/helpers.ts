import { PropertyModel } from "@reapit/foundations-ts-definitions";
import { RowProps } from "@reapit/elements";
import { renderTableExpandableComponent } from "./renderComponents";

export function createTableRows(data: any) {
  const expandableContent = (embed: PropertyModel) => {
    return {
      content: renderTableExpandableComponent(embed),
    };
  };

  let newTableData: RowProps[] = [];
  if (data && data._embedded) {
    newTableData = data._embedded.map((embed: PropertyModel) => {
      let cells = [
        {
          label: "Type",
          value: embed.type && embed.type[0],
        },
        { label: "Address", value: embed.address?.buildingName },
        { label: "Bedrooms", value: embed.bedrooms },
        {
          label: "Bathrooms",
          value: embed.bathrooms,
        },
        {
          label: "Currency",
          value: embed.currency,
        },
        {
          label: "Price",
          value: embed.selling?.price,
        },
      ];
      return {
        cells,
        expandableContent: expandableContent(embed),
      };
    });
  }
  return newTableData;
}

// @ts-nocheck
import { styled } from "@linaria/react";

type SpaceType = {
  display?: string;
  width?: string;
  height?: string;
};

type CombinedSpaceType = React.ClassAttributes<HTMLSpanElement> &
  React.HTMLAttributes<HTMLSpanElement> &
  Omit<{}, never> &
  SpaceType;

export const Space = styled.span<CombinedSpaceType>`
  display: ${(props) => props.display ?? "block"};
  width: ${(props) => props.width ?? "100%"};
  height: ${(props) => props.height ?? "100%"};
`;

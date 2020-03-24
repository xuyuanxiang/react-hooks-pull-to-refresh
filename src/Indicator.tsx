import React, { CSSProperties } from 'react';
import styled, { keyframes } from 'styled-components';

const IndicatorAnimation = keyframes`
  8.333333333333332% {
    transform: rotate(30deg);
  }
  16.666666666666664% {
    transform: rotate(60deg);
  }
  25% {
    transform: rotate(90deg);
  }
  33.33333333333333% {
    transform: rotate(120deg);
  }
  41.666666666666664% {
    transform: rotate(150deg);
  }
  50% {
    transform: rotate(180deg);
  }
  58.33333333333333% {
    transform: rotate(210deg);
  }
  66.66666666666666% {
    transform: rotate(240deg);
  }
  75% {
    transform: rotate(270deg);
  }
  83.33333333333333% {
    transform: rotate(300deg);
  }
  91.66666666666666% {
    transform: rotate(330deg);
  }
  to {
    transform: rotate(1turn);
  }
`;

const StyledIndicator = styled.span<{ size: number; color: string }>`
  display: inline-block;
  transform-origin: 50%;
  animation: ${IndicatorAnimation} 1s step-end infinite;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-position: 50%;
  background-size: 100%;
  background-repeat: no-repeat;
  ${(props) =>
    `background-image: url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><line id="l" x1="60" x2="60" y1="7" y2="27" stroke="${props.color}" stroke-width="11" stroke-linecap="round"/></defs><g><use xlink:href="#l" opacity=".27"/><use xlink:href="#l" opacity=".27" transform="rotate(30 60,60)"/><use xlink:href="#l" opacity=".27" transform="rotate(60 60,60)"/><use xlink:href="#l" opacity=".27" transform="rotate(90 60,60)"/><use xlink:href="#l" opacity=".27" transform="rotate(120 60,60)"/><use xlink:href="#l" opacity=".27" transform="rotate(150 60,60)"/><use xlink:href="#l" opacity=".37" transform="rotate(180 60,60)"/><use xlink:href="#l" opacity=".46" transform="rotate(210 60,60)"/><use xlink:href="#l" opacity=".56" transform="rotate(240 60,60)"/><use xlink:href="#l" opacity=".66" transform="rotate(270 60,60)"/><use xlink:href="#l" opacity=".75" transform="rotate(300 60,60)"/><use xlink:href="#l" opacity=".85" transform="rotate(330 60,60)"/></g></svg>`,
    )}")`};
`;

export interface IIndicatorProps {
  /**
   * CSS colors.
   */
  color?: string;
  style?: CSSProperties;
  className?: string;
  /**
   * The width and height value in pixels.
   */
  size?: number;
}

export function Indicator({ color = '#9b9b9b', size = 32, ...rest }: IIndicatorProps): JSX.Element {
  return <StyledIndicator color={color} size={size} {...rest} />;
}

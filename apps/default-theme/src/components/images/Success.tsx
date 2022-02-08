/* eslint-disable max-len */
import React from "react";
import Svg, { G, Circle, Path } from "react-native-svg";

import { useTheme } from "../../lib/theme";

function SuccessImage() {
  const theme = useTheme();
  return (
    <Svg viewBox="0 0 1080 1080" style={{ width: "100%", height: 450 }}>
      <G id="prefix__Ilustraciones">
        <Circle
          id="prefix__Circulo_1_"
          cx={561.5}
          cy={528.2}
          r={210.9}
          fill={theme.colors.primary}
        />
        <Path
          fill={theme.colors.dark}
          d="M628.8 264.9c2 .6 4.5-2.2 5.7-6.2 1.2-4 .5-7.7-1.5-8.3-2-.6-4.5 2.2-5.7 6.2-1.2 4-.5 7.7 1.5 8.3zM595 255.1c2 .6 4.5-2.2 5.7-6.2 1.2-4 .5-7.7-1.5-8.3-2-.6-4.5 2.2-5.7 6.2-1.1 4-.4 7.7 1.5 8.3zM594.5 274.6l11 6.9c.4.2.8.3 1.1.3.7 0 1.4-.4 1.8-1 .6-1 .3-2.3-.7-3l-9.4-5.9 20.7-40c.5-1.1.1-2.4-.9-2.9-1.1-.5-2.4-.1-2.9.9l-21.6 41.8c-.4 1.1 0 2.3.9 2.9z"
        />
        <Path
          fill={theme.colors.dark}
          d="M611.1 609.4c.8 0 1.5 0 2.2-.1l1.7-.1 23.6-105.7c42.8-4.6 63.2-24 72.7-39.6 8.7-14.1 10.2-27.4 10.5-32.1l60.1-14.2c11.3-2.8 20.4-11.5 23.8-22.7l28.8-95.6c27.6-8.9 28.1-37.3 28.1-37.6v-.2l-.8-9.3c0-.6-.3-1.1-.7-1.4L842.8 235c-.2-.2-.5-.4-.8-.5l-14.9-4.1c-.7-.2-1.5 0-2 .5l-14.3 12.7c-1.8 1.6-2.6 3.8-2.4 6l-9.8 13.9c-2.4 3.4-2.9 7.8-1.2 11.6l5 11.7-49.5 88.4h-35.4c-3.4-23.4 1.5-47.4 10.4-78.2 5.1-17.7 14.8-62.8-6.1-98.6-12-20.7-32.3-34.5-60.3-41.1-83.6-19.8-105.3 62.5-118.3 111.7l-.9 3.4c-6.1 23-15.2 35.1-24.3 44.4l-22.3-16.1 18.2-106.6 10.6-7.3c3.4-2.4 5.3-6.4 5.1-10.5l-1-17c1.3-1.7 1.8-4.1 1.2-6.3l-5.4-18.3c-.2-.7-.8-1.2-1.5-1.5l-14.8-4.4c-.3-.1-.6-.1-1-.1l-23.9 3.8c-.6.1-1 .4-1.4.8l-5.6 7.4c0 .1-.1.1-.1.2-.2.2-14.7 24.5 3.8 46.6L441 286.2v.1c-3.6 11.1-1 23.4 6.6 32.1l39.2 46.8c-1.3 3.4-4.5 13.3-4.9 26.8-.4 14.9 2.9 37.1 20.4 58.7l-45.6 110 1.1 1c.2.2 1.6 1.5 4.4 3.6L342.1 642c-13.3 8.5-22.4 21.7-25.4 37.3s.3 31.2 9.4 44.1L397 823.7 375.9 901c-1.5 5.5.8 11.5 5.7 14.5l5.5 3.4c2.1 1.3 4.5 2 6.9 2 3.6 0 7.2-1.5 9.7-4.4l64.9-72.9c0 .2.1.5.1.7l21.6 96.8c1.3 6 6.6 10.2 12.7 10.2h.6l6.5-.3c5.7-.3 10.7-4.3 12-9.9l19.1-77.8L652 810.1c14.3-6.8 24.8-18.9 29.7-34s3.4-31-4.1-44.9l-66.5-121.8zm-31-370.1c9.6-1.7 18.2-5.2 25.7-9.4.2.2.4.5.6.8.4.6 1.1 1 1.8 1 .4 0 .8-.1 1.2-.3 1-.6 1.3-2 .7-3-.1-.2-.3-.4-.5-.6 10.4-6.4 18-13.8 22.2-18.3.5 6.6 1.8 14.9 4.5 24.3-1.8-.8-3.8-1.2-5.6-.5-1.1.5-1.6 1.7-1.2 2.8.5 1.1 1.7 1.6 2.8 1.2 1.1-.5 4 1.1 6.1 2.9 5.7 16.4 16.7 36.9 37.9 56-5.1 9.2-11 17.1-17.4 23.4-.2.1-.3.3-.4.4-15.2 14.8-33.2 21-50 16.1-17.7-5.1-29.3-15.5-34.5-30.9-4.8-14.3-4.2-32.4 2.1-53.8 1-4.2 2.4-8.3 4-12.1zm108.5 66.8c-4.3 2.2-8.9 2.5-12.7.7-.3-.1-.6-.3-.9-.5 1.6-2.4 3.1-4.9 4.6-7.5 2.8 2.6 5.8 5 9 7.3zm-81.4 34c4.2 1.2 8.5 1.8 12.8 1.8 12.5 0 25.1-5.1 36.4-14.5l-9.7 39.7.9.9c.2.2 1.7 1.6 4 3.5-5.5 4.5-22.6 16.4-44.6 11.3-22.3-5.2-27-22-28-28.4 3.7.3 6.3.4 6.6.4h1.7l6-20.5c4 2.4 8.7 4.3 13.9 5.8zm100.3 121.7c-12.8 20.7-36.2 33.5-67.9 37.2l11.3-50.5 66.5-15.7c-.5 5.2-2.4 16.9-9.9 29zm97-170.1l.7 1.5c.4.8 1.1 1.3 2 1.3.3 0 .6-.1.9-.2 1.1-.5 1.6-1.7 1.1-2.8l-7.8-18.1c-1-2.4-.7-5.3.8-7.4l8.5-11.9c1.2 1.1 2.7 1.8 4.3 1.9-2.4 2.3-2.8 5.8-1.3 8.6l-.8 1.9c-.6 1.6-.6 3.3.2 4.8.7 1.5 2.1 2.6 3.7 3.1l2.2.6c.2.1.4.1.6.1.9 0 1.8-.6 2.1-1.6.3-1.1-.3-2.3-1.5-2.7l-2.2-.6c-.6-.2-.9-.6-1-.8-.1-.2-.3-.7 0-1.3l.2-.5c1.7.7 3.7.7 5.4 0-.1.5-.2 1.1-.2 1.6 0 2 .8 4 2.4 5.4 2.6 2.3 6.4 2.5 9.2.4l1-.8c-.1.5-.2 1.1-.2 1.6.1 1.6.8 3.2 2 4.3 2.3 2 5.7 2 8 0l6.3-5.6c.9-.8 1-2.2.2-3-.8-.9-2.2-1-3-.2l-6.3 5.6c-.6.6-1.6.6-2.2 0-.3-.3-.5-.7-.6-1.2 0-.5.2-.9.5-1.3l11.6-12.7c.8-.8.8-2.1 0-2.9-.8-.8-2-.9-2.9-.3l-17 13c-1.1.8-2.6.8-3.6-.1-.6-.6-.9-1.3-.9-2.1s.4-1.6 1-2.1l14.8-12.9c.9-.8 1-2 .3-2.9-.7-.9-2-1.1-2.9-.5l-18.5 12.6c-1.2.8-2.7.6-3.6-.5-.9-1.1-.8-2.8.3-3.7l14.2-13c.8-.8.9-2 .2-2.9-.7-.9-2-1.1-2.9-.4l-12.5 8.5c-1.2.8-2.8.6-3.7-.5-.9-1.2-.8-2.8.3-3.8l13.5-11.9 13.3 3.6 17.2 15 .7 8.3c0 2-1.1 26.3-26 33.7-.7.2-1.4.7-1.6 1.5l-29.1 96.7c-3 9.7-10.9 17.2-20.7 19.7l-97 22.9c-3.8-28.8 3.1-51.3 5-56.9H753l.1.1c.3.2.7.3 1.1.3.4 0 .8-.1 1.2-.3h7.7c1.2 0 2.2-1 2.2-2.2s-1-2.2-2.2-2.2h-5l46.4-83.8zm-258-18.2l.9-3.4c6.3-23.9 14.9-56.5 31.8-80 19.8-27.5 46.4-36.8 81.3-28.6 26.8 6.3 46.2 19.5 57.6 39.1 20.6 35.3 9.5 81.8 5.6 95.2-9 31.1-13.9 55.4-10.6 79.4h-44.7c-7.5-1.4-14.6-7.2-17-9.3l10.7-43.5c3.7-3.7 7.2-7.8 10.5-12.3.5.3 1 .6 1.6.8 2.3 1 4.7 1.5 7.2 1.5 3.8 0 7.6-1.2 11.2-3.4 1.1.8 2.2 1.5 3.4 2.3.4.2.8.4 1.2.4.7 0 1.4-.3 1.8-1 .7-1 .4-2.3-.6-3-36.6-24.3-51.5-53.9-57.6-74.5-6.6-22.3-4.5-39.1-4.5-39.3.2-1.2-.7-2.3-1.9-2.4-1.2-.2-2.3.7-2.4 1.9 0 .3-.5 3.9-.4 9.9-3.7 4.4-28.3 31.8-61.5 32.8-1.2 0-2.1 1-2.1 2.2 0 1.2 1 2.1 2.2 2.1h.1c1.7 0 3.4-.2 5.1-.4-1.3 3.3-2.5 6.7-3.4 10.1-6.5 22.3-7.1 41.2-2 56.4 3.7 10.8 10.2 19.4 19.5 25.6l-5.4 18.4c-4.5-.2-17.5-1.2-26.5-5.1l-22.4-16.2-13.6-9.8c9.3-9.8 18.6-22.4 24.9-45.9zM445 287.9l39.4-99.8v-.1c0-.1 0-.2.1-.2v-.2-.2-.2-.2-.2c0-.1 0-.1-.1-.2 0-.1-.1-.1-.1-.2s-.1-.1-.1-.2-.1-.1-.1-.2c0 0 0-.1-.1-.1-17.3-19.5-5.3-40.7-4.3-42.4l5-6.6 22.6-3.6 13.2 3.9 5.1 17.2c.4 1.4-.3 2.9-1.7 3.4s-2.9-.2-3.4-1.5l-6.1-13.8c-.5-1-1.6-1.5-2.7-1.2-1.1.4-1.7 1.5-1.4 2.6l5.2 18.5c.4 1.4-.4 2.9-1.7 3.3-1.3.5-2.8-.2-3.4-1.5l-9-20.4c-.5-1-1.7-1.5-2.7-1.2-1.1.4-1.6 1.6-1.3 2.7l5.7 18.8c.2.8.1 1.6-.3 2.3s-1.1 1.2-1.9 1.3c-1.4.2-2.7-.5-3.2-1.8l-7.5-20.1c-.4-1-1.5-1.6-2.6-1.3-1.1.3-1.7 1.4-1.5 2.5l3.1 17c.1.5 0 .9-.3 1.3s-.7.6-1.1.7c-.8.1-1.7-.4-1.9-1.2l-2.4-8.1c-.3-1.1-1.5-1.8-2.7-1.5-1.1.3-1.8 1.5-1.5 2.7l2.4 8.1c.9 2.9 3.8 4.7 6.8 4.2 1.6-.3 3-1.2 4-2.6.3-.5.6-.9.7-1.5l.4 1.2c1.2 3.2 4.6 5.1 8 4.5 2-.4 3.8-1.6 4.8-3.3.3-.5.5-1 .7-1.5 1.1 1.6 2.8 2.6 4.6 2.9l-.1.5c-.1.6-.5.9-.7 1.1-.2.1-.7.4-1.3.2l-2.2-.6c-1.1-.3-2.3.3-2.7 1.5-.3 1.1.3 2.3 1.5 2.7l2.2.6c.5.2 1.1.2 1.7.2 1.1 0 2.2-.3 3.1-.9a6.2 6.2 0 002.7-4l.3-2c2.8-1.5 4.3-4.8 3.5-7.9 1.4.7 3.1 1 4.7.6l.9 14.6c.2 2.6-1.1 5.2-3.2 6.7L504.9 195c-1 .7-1.2 2-.6 3 .4.6 1.1.9 1.8.9.4 0 .8-.1 1.2-.4l1.7-1.1-17.1 100.3-4.3-3.1c-1-.7-2.3-.5-3 .5-.7 1-.5 2.3.5 3l6.5 4.7c.3.5.8.8 1.3 1l38.3 27.7c-2.8 5.7-13.6 25.7-32.4 41.4l-47.9-57.2c-6.8-7.5-9-18.2-5.9-27.8zm44.9 81.5l30.8 36.8-16.7 40.2c-25-32.6-17.4-66.4-14.1-77zm-89.4 544.2c-2.8 3.2-7.5 3.8-11.1 1.6l-.7-.4 66.8-75c.8-.9.7-2.3-.2-3-.9-.8-2.3-.7-3 .2L385 912.6l-1.1-.7c-3.3-2.1-4.8-5.9-3.8-9.7l21.3-77.6 19.4-22L462 820c3.7 1.6 6.4 4.7 7.3 8.7.9 3.9-.1 7.9-2.8 11l-66 73.9zm131.3-84.7l-45-4.9c-4.9-.5-9.7 1.1-13.2 4.4 0-.3-.1-.5-.2-.8-1.2-5.3-4.8-9.6-9.8-11.7L422 798.3l-27.8-102 100.1-40c13.3-5.3 28.5-1.5 37.8 9.5l73.6 87.5-73.9 75.6zM518 940c-.9 3.8-4.2 6.4-8 6.6l-1.3.1-22-98.8c-.3-1.2-1.4-1.9-2.6-1.6-1.2.3-1.9 1.4-1.6 2.6l21.9 98h-.8c-4.3.2-8-2.7-8.9-6.8L473 843.3c-.9-3.9.2-7.9 2.9-10.9 2.7-3 6.5-4.5 10.6-4.1l44.5 4.8 6.3 28.7L518 940zm159.6-165.2c-4.5 13.9-14.3 25.1-27.5 31.4l-109.3 52.4-5.8-26.8 83.8-85.8c.8-.9.8-2.2 0-3.1-.9-.8-2.2-.8-3.1 0l-7 7.2-73.3-87.1c-10.5-12.4-27.6-16.7-42.7-10.7l-99.6 39.8-2.6-9.7c-.3-1.2-1.5-1.8-2.7-1.5-1.2.3-1.8 1.5-1.5 2.7l31.5 115.7-18.1 20.5-70-99c-8.4-11.9-11.5-26.4-8.7-40.8 2.8-14.4 11.2-26.6 23.5-34.5l121.3-77.3c6.7 4.9 17.5 11.9 32.3 18.8 22.4 10.4 58.1 22.3 104.6 22.3h3.6l67.6 123.8c6.9 13 8.2 27.8 3.7 41.7z"
        />
        <Path
          fill={theme.colors.dark}
          d="M614.4 313.6h.6c19.5 0 21.9-16.7 21.9-16.9.1-.7-.2-1.4-.7-1.9-.6-.5-1.3-.6-2-.4-.3.1-26.6 7.6-38.7-3.1-.7-.6-1.6-.7-2.4-.3-.8.4-1.2 1.3-1.2 2.2 0 .1 2.5 20.1 22.5 20.4zm17.3-14.1c-1.7 4-6.1 10.1-17.2 9.9-10.3-.2-14.9-6.7-16.9-11.5 11.3 5.5 27 3.1 34.1 1.6zM220.4 599.1l-10.9 3.4c-1.1.4-1.8 1.6-1.4 2.7.3.9 1.1 1.5 2.1 1.5.2 0 .4 0 .6-.1l10.9-3.4c1.1-.4 1.8-1.6 1.4-2.7-.3-1.1-1.6-1.7-2.7-1.4zM248.8 590.3l-17.1 5.3c-1.1.4-1.8 1.6-1.4 2.7.3.9 1.1 1.5 2.1 1.5.2 0 .4 0 .6-.1l17.1-5.3c1.1-.4 1.8-1.6 1.4-2.7-.3-1.1-1.5-1.7-2.7-1.4zM403.9 544.5c-.4-1.1-1.6-1.8-2.7-1.4l-137.8 42.7c-1.1.4-1.8 1.6-1.4 2.7.3.9 1.1 1.5 2.1 1.5.2 0 .4 0 .6-.1l137.8-42.7c1.1-.3 1.8-1.6 1.4-2.7zM311 504.4c-1.2.1-2.1 1.2-2 2.3.1 1.1 1 2 2.1 2h.2l42.3-3.9c1.2-.1 2.1-1.2 2-2.3-.1-1.2-1.2-2.1-2.3-2l-42.3 3.9zM368.1 499.2c-1.2.1-2.1 1.2-2 2.3.1 1.1 1 2 2.1 2h.2l20.7-1.9c1.2-.1 2.1-1.2 2-2.3-.1-1.2-1.2-2.1-2.3-2l-20.7 1.9zM335.2 327.1c.4.4 1 .7 1.6.7.5 0 1.1-.2 1.5-.6.9-.8.9-2.2.1-3.1l-4.9-5.2c-.8-.9-2.2-.9-3.1-.1-.9.8-.9 2.2-.1 3.1l4.9 5.2zM348.3 340.8c.4.4 1 .7 1.6.7.5 0 1.1-.2 1.5-.6.9-.8.9-2.2.1-3.1l-6-6.3c-.8-.9-2.2-.9-3.1-.1-.9.8-.9 2.2-.1 3.1l6 6.3zM428.8 425.3c.4.4 1 .7 1.6.7.5 0 1.1-.2 1.5-.6.9-.8.9-2.2.1-3.1l-75-78.7c-.8-.9-2.2-.9-3.1-.1-.9.8-.9 2.2-.1 3.1l75 78.7zM269.9 420l15.7 5.2c.2.1.5.1.7.1.9 0 1.8-.6 2.1-1.5.4-1.1-.2-2.4-1.4-2.7l-15.7-5.2c-1.1-.4-2.4.2-2.7 1.4-.5 1.1.1 2.4 1.3 2.7zM299.5 429.8l80.9 26.8c.2.1.5.1.7.1.9 0 1.8-.6 2.1-1.5.4-1.1-.2-2.4-1.4-2.7l-80.9-26.8c-1.1-.4-2.4.2-2.7 1.4-.4 1.1.2 2.4 1.3 2.7zM702 661.1c-.8-.9-2.2-1-3-.2s-1 2.2-.2 3l46.6 52.5c.4.5 1 .7 1.6.7.5 0 1-.2 1.4-.5.9-.8 1-2.2.2-3L702 661.1zM681.3 637.8c-.8-.9-2.2-1-3-.2-.9.8-1 2.2-.2 3l11.2 12.6c.4.5 1 .7 1.6.7.5 0 1-.2 1.4-.5.9-.8 1-2.2.2-3l-11.2-12.6zM871.9 465.2c-.3-1.2-1.5-1.8-2.6-1.5l-18.7 5.1c-1.2.3-1.8 1.5-1.5 2.6.3 1 1.1 1.6 2.1 1.6.2 0 .4 0 .6-.1l18.7-5.1c1-.2 1.7-1.4 1.4-2.6zM842 473.3c-.3-1.2-1.5-1.8-2.6-1.5l-18.1 4.9c-1.2.3-1.8 1.5-1.5 2.6.3 1 1.1 1.6 2.1 1.6.2 0 .4 0 .6-.1l18.1-4.9c1.1-.2 1.8-1.4 1.4-2.6zM812.7 481.3c-.3-1.2-1.5-1.8-2.6-1.5l-64.7 17.5c-1.2.3-1.8 1.5-1.5 2.6.3 1 1.1 1.6 2.1 1.6.2 0 .4 0 .6-.1l64.7-17.5c1.1-.3 1.8-1.5 1.4-2.6zM784.9 559.2l12.8 1h.2c1.1 0 2.1-.9 2.2-2 .1-1.2-.8-2.2-2-2.3l-12.8-1c-1.2-.1-2.2.8-2.3 2-.2 1.2.7 2.2 1.9 2.3zM736.5 551.2c-1.2-.1-2.2.8-2.3 2s.8 2.2 2 2.3l36.9 2.8h.2c1.1 0 2.1-.9 2.2-2 .1-1.2-.8-2.2-2-2.3l-37-2.8zM854.9 656.9l-72.8-31.8c-1.1-.5-2.4 0-2.8 1.1-.5 1.1 0 2.4 1.1 2.8l72.8 31.8c.3.1.6.2.9.2.8 0 1.6-.5 2-1.3.4-1-.1-2.3-1.2-2.8zM774.1 621.6l-8.3-3.6c-1.1-.5-2.4 0-2.8 1.1-.5 1.1 0 2.4 1.1 2.8l8.3 3.6c.3.1.6.2.9.2.8 0 1.6-.5 2-1.3.4-1-.1-2.3-1.2-2.8zM751.7 611.9l-51.6-22.5c-1.1-.5-2.4 0-2.8 1.1-.5 1.1 0 2.4 1.1 2.8l51.6 22.5c.3.1.6.2.9.2.8 0 1.6-.5 2-1.3.4-1.1-.1-2.4-1.2-2.8z"
        />
        <Circle fill={theme.colors.dark} cx={696.6} cy={528.2} r={9.2} />
        <Circle fill={theme.colors.dark} cx={674.3} cy={690.3} r={9.2} />
        <Circle fill={theme.colors.dark} cx={436.4} cy={365.1} r={9.2} />
        <Circle fill={theme.colors.dark} cx={377.6} cy={583.6} r={9.2} />
        <Circle fill={theme.colors.dark} cx={279.3} cy={474.1} r={18} />
        <Circle fill={theme.colors.dark} cx={810.7} cy={593.5} r={18} />
        <Path
          fill={theme.colors.dark}
          d="M439.6 465.8c0 2.8 2.3 5 5 5 2.8 0 5-2.3 5-5s-2.3-5-5-5c-2.8 0-5 2.2-5 5zM644 584.4c0 2.8 2.3 5 5 5s5-2.3 5-5-2.3-5-5-5-5 2.2-5 5z"
        />
      </G>
    </Svg>
  );
}

export default SuccessImage;

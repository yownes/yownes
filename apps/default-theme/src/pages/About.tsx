import React from "react";
import { ScrollView } from "react-native";
import { useGetAbout } from "@yownes/api";

import { Box, Card, HtmlText, Text } from "../components/atoms";

const About = () => {
  const { data } = useGetAbout();
  return (
    <ScrollView>
      <Card margin="m" padding="l">
        <HtmlText>{data?.page?.description}</HtmlText>
        <Box marginTop="xl" alignItems="center">
          <Text>{data?.contact?.telephone}</Text>
          <Text padding="xl" textAlign="center">
            {data?.contact?.email}
          </Text>
          <Text>{data?.contact?.address}</Text>
        </Box>
      </Card>
    </ScrollView>
  );
};

export default About;

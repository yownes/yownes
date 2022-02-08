import React, { useRef } from "react";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";

import { Box, Button, Text } from "../atoms";

interface ConfirmProps {
  onConfirm: () => void;
  onReject?: () => void;
  title: string;
  children: React.ReactElement;
}

const snapPoints = [200];

const Confirm = ({ children, title, onConfirm, onReject }: ConfirmProps) => {
  const ref = useRef<BottomSheetModal>(null);
  return (
    <>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          onPress() {
            ref.current?.present();
          },
        });
      })}
      <BottomSheetModal
        index={0}
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={BottomSheetBackdrop}
      >
        <Box padding="l">
          <Text variant="header" textAlign="center" marginBottom="xl">
            {title}
          </Text>
          <Box flexDirection="row" justifyContent="space-around">
            <Button
              label="Confirmar"
              backgroundColor="danger"
              onPress={onConfirm}
            />
            <Button
              label="Cancelar"
              color="primary"
              backgroundColor="transparent"
              onPress={() => {
                ref.current?.close();
                onReject?.();
              }}
            />
          </Box>
        </Box>
      </BottomSheetModal>
    </>
  );
};

export default Confirm;

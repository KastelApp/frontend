import ResizeTextarea from "react-textarea-autosize";
import React from "react";
import { Textarea, forwardRef } from "@chakra-ui/react";

export const AutoResizeTextarea = forwardRef((props, ref) => (
  <Textarea
    minH="unset"
    overflow="hidden"
    w="100%"
    resize="none"
    ref={ref}
    minRows={1}
    as={ResizeTextarea}
    rounded={"unset"}
    {...props}
  />
));

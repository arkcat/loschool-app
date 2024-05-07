import Box from "@mui/material/Box";
import React, { ReactNode } from "react";

interface MainPageBoxProps {
  children: ReactNode;
}

const MainPageBox: React.FC<MainPageBoxProps> = ({ children }) => {
  return (
    <Box
      style={{
        display: "flex",
        position: "relative",
        flexDirection: "column",
        alignItems: "center",
        height: "100dvh",
      }}
    >
      {children}
    </Box>
  );
};

export default MainPageBox;

import { RaidData } from "@/lib/database.types";
import {
  Box,
  TableCell,
  TableContainer,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import { Typography } from "antd";
import React from "react";

interface RaidDataProps {
  raid: RaidData;
  isReadOnly: boolean;
  onTextChanged: (updatedText: string) => void;
}

function narrowBox(raid: RaidData, isReadOnly: boolean, handleChange: any) {
  return (
    <TableRow sx={{ padding: "0px" }}>
      <TableCell
        colSpan={2}
        sx={{
          textAlign: "center",
          border: "2px solid",
          borderColor: raid.raid_color,
          padding: "6px",
          width: "350px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <textarea
          placeholder="여기에 메모하세요..."
          readOnly={isReadOnly}
          value={raid.raid_qualify}
          onChange={handleChange}
          style={{
            width: "100%",
            height: "100%",
            resize: "none",
            border: "none",
            outline: "none",
            boxSizing: "border-box",
            padding: "4px",
            margin: "0px",
            minHeight: "90px",
          }}
        />
      </TableCell>
    </TableRow>
  );
}

function wideBox(raid: RaidData, isReadOnly: boolean, handleChange: any) {
  return (
    <TableCell
      sx={{
        width: "400px",
        padding: "6px",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <textarea
        placeholder="여기에 메모하세요..."
        readOnly={isReadOnly}
        value={raid.raid_qualify}
        onChange={handleChange}
        style={{
          width: "100%",
          height: "100%",
          resize: "none",
          border: "none",
          outline: "none",
          boxSizing: "border-box",
          padding: "4px",
          minHeight: "90px",
        }}
      />
    </TableCell>
  );
}

function commonBox(raid: RaidData, isReadOnly: boolean, handleChange: any) {
  const isNarrowScreen = useMediaQuery("(max-width:600px)");
  return (
    <Box display={"flex"}>
      <TableContainer
        sx={{
          mb: "3px",
          padding: "0px",
          backgroundColor: "#b7bd98",
          border: "2px solid",
          borderColor: raid.raid_color,
        }}
      >
        <TableRow sx={{ padding: "0px" }}>
          <TableCell
            sx={{
              minWidth: "100px",
              textAlign: "center",
              border: "2px solid",
              padding: "6px",
              borderColor: raid.raid_color,
            }}
          >
            <Typography
              style={{
                fontFamily: "SUIT-Regular",
                fontSize: "15px",
                fontWeight: "600",
              }}
            >
              {raid.raid_name}
            </Typography>
          </TableCell>
          <TableCell
            sx={{
              minWidth: "60px",
              textAlign: "center",
              border: "2px solid",
              padding: "6px",
              borderColor: raid.raid_color,
            }}
          >
            <Typography
              style={{
                fontFamily: "SUIT-Regular",
                fontSize: "15px",
                fontWeight: "600",
              }}
            >
              {raid.raid_level}
            </Typography>
          </TableCell>
          {!isNarrowScreen ? (
            wideBox(raid, isReadOnly, handleChange)
          ) : (
            <div></div>
          )}
        </TableRow>
        {isNarrowScreen ? (
          narrowBox(raid, isReadOnly, handleChange)
        ) : (
          <div></div>
        )}
      </TableContainer>
    </Box>
  );
}

const QualificationInfo: React.FC<RaidDataProps> = ({
  raid,
  isReadOnly,
  onTextChanged,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onTextChanged(value);
  };
  return commonBox(raid, isReadOnly, handleChange);
};

export default QualificationInfo;

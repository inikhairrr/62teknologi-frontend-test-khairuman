import React from "react";
import { Box, TextField } from "@mui/material";

const SearchFilter = ({ setTerm, setName, setLocation }) => {
  return (
    <Box display="flex" justifyContent="space-between" mb={2}>
      <TextField
        label="Search Term"
        variant="outlined"
        onChange={(e) => setTerm(e.target.value)}
      />
      <TextField
        label="Name"
        variant="outlined"
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Location"
        variant="outlined"
        defaultValue="New York"
        onChange={(e) => setLocation(e.target.value)}
      />
    </Box>
  );
};

export default SearchFilter;

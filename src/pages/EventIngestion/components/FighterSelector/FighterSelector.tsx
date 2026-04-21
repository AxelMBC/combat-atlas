import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import type { Corner, FighterSelectorProps } from "./FighterSelector.types";

const CORNER_COLORS: Record<Corner, string> = {
  red: "#d32f2f",
  blue: "#1565c0",
};

const CORNER_LABELS: Record<Corner, string> = {
  red: "Esquina Roja",
  blue: "Esquina Azul",
};

const FighterSelector = ({
  corner,
  fighters,
  selectedId,
  onChange,
  disabled = false,
}: FighterSelectorProps) => {
  const selected = fighters.find((f) => f._id === selectedId) ?? null;

  return (
    <Autocomplete
      options={fighters}
      value={selected}
      disabled={disabled}
      onChange={(_e, value) => onChange(value)}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option._id}>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {option.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.record}
            </Typography>
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={CORNER_LABELS[corner]}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: CORNER_COLORS[corner],
                  mr: 1,
                  flexShrink: 0,
                }}
              />
            ),
          }}
          size="small"
        />
      )}
    />
  );
};

export default FighterSelector;

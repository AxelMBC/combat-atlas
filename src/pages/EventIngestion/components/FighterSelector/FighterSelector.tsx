import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { useTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import type { Corner, FighterSelectorProps } from "./FighterSelector.types";

const CORNER_COLORS: Record<Corner, string> = {
  red: "#d32f2f",
  blue: "#1565c0",
};

const CORNER_LABEL_KEYS: Record<Corner, TranslationKey> = {
  red: "eventForm.field.redCorner",
  blue: "eventForm.field.blueCorner",
};

const FighterSelector = ({
  corner,
  fighters,
  selectedId,
  onChange,
  disabled = false,
}: FighterSelectorProps) => {
  const { t } = useTranslation();
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
          label={t(CORNER_LABEL_KEYS[corner])}
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

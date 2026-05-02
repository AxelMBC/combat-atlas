import { type KeyboardEvent, useState } from "react";
import { Box, Chip, TextField, Typography } from "@mui/material";
import { VALIDATION_RULES } from "@/pages/EventIngestion/eventIngestion.config";
import { useTranslation } from "@/i18n";
import type { TagsInputProps } from "./TagsInput.types";

const TagsInput = ({ tags, onAdd, onRemove, error }: TagsInputProps) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && tags.length < VALIDATION_RULES.tags.max) {
        onAdd(trimmed);
        setInputValue("");
      }
    }
  };

  const atMax = tags.length >= VALIDATION_RULES.tags.max;

  const helperText = error
    ? t(error.key, error.params)
    : atMax
      ? t("eventForm.help.tagsMaxReached", { max: VALIDATION_RULES.tags.max })
      : t("eventForm.help.tagsAddInstruction");

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <TextField
        label={t("eventForm.field.tags")}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={atMax}
        error={!!error}
        helperText={helperText}
        fullWidth
        size="small"
      />
      {tags.length > 0 && (
        <Box display="flex" flexWrap="wrap" gap={0.5}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => onRemove(tag)}
              size="small"
            />
          ))}
          <Typography variant="caption" color="text.secondary" alignSelf="center">
            {tags.length}/{VALIDATION_RULES.tags.max}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TagsInput;

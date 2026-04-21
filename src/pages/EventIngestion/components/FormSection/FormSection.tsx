import { Box, Divider, Paper, Typography } from "@mui/material";
import type { FormSectionProps } from "./FormSection.types";

const FormSection = ({ title, children }: FormSectionProps) => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box display="flex" flexDirection="column" gap={2}>
        {children}
      </Box>
    </Paper>
  );
};

export default FormSection;

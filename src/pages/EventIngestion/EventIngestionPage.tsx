import { Container, Typography } from "@mui/material";
import EventForm from "./components/EventForm/EventForm";
import { useTranslation } from "@/i18n";

const EventIngestionPage = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {t("eventForm.pageTitle")}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t("eventForm.pageDescription")}
      </Typography>
      <EventForm />
    </Container>
  );
};

export default EventIngestionPage;

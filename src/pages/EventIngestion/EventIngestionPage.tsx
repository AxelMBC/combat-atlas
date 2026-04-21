import { Container, Typography } from "@mui/material";
import EventForm from "./components/EventForm/EventForm";

const EventIngestionPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Nuevo Evento de Pelea
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Completá el formulario para ingresar un nuevo evento al sistema.
      </Typography>
      <EventForm />
    </Container>
  );
};

export default EventIngestionPage;

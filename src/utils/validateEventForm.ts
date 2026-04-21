import type { EventFormData } from "@/store/eventIngestion/eventIngestionSlice.types";
import type { FieldErrors } from "@/pages/EventIngestion/components/EventForm/EventForm.types";
import { VALIDATION_RULES, YT_ID_REGEX } from "@/pages/EventIngestion/eventIngestion.config";

const validateEventForm = (form: EventFormData): FieldErrors => {
  const errors: FieldErrors = {};
  if (!form.country) errors.country = "El país es requerido.";
  if (!YT_ID_REGEX.test(form.idYt))
    errors.idYt = "El ID de YouTube debe tener exactamente 11 caracteres.";
  if (Number(form.startTime) < VALIDATION_RULES.startTime.min)
    errors.startTime = "El tiempo de inicio debe ser ≥ 0.";
  if (
    form.title.length < VALIDATION_RULES.title.min ||
    form.title.length > VALIDATION_RULES.title.max
  )
    errors.title = `El título debe tener entre ${VALIDATION_RULES.title.min} y ${VALIDATION_RULES.title.max} caracteres.`;
  if (
    form.description.length < VALIDATION_RULES.description.min ||
    form.description.length > VALIDATION_RULES.description.max
  )
    errors.description = `La descripción debe tener entre ${VALIDATION_RULES.description.min} y ${VALIDATION_RULES.description.max} caracteres.`;
  if (form.tags.length > VALIDATION_RULES.tags.max)
    errors.tags = `Máximo ${VALIDATION_RULES.tags.max} etiquetas.`;
  return errors;
};

export default validateEventForm;

import type { EventFormData } from "@/store/eventIngestion/eventIngestionSlice.types";
import type { FieldErrors } from "@/pages/EventIngestion/components/EventForm/EventForm.types";
import { VALIDATION_RULES, YT_ID_REGEX } from "@/pages/EventIngestion/eventIngestion.config";

const validateEventForm = (form: EventFormData): FieldErrors => {
  const errors: FieldErrors = {};
  if (!form.country) errors.country = { key: "validation.countryRequired" };
  if (!YT_ID_REGEX.test(form.idYt))
    errors.idYt = { key: "validation.youtubeIdInvalid" };
  if (Number(form.startTime) < VALIDATION_RULES.startTime.min)
    errors.startTime = { key: "validation.startTimeInvalid" };
  if (
    form.title.length < VALIDATION_RULES.title.min ||
    form.title.length > VALIDATION_RULES.title.max
  )
    errors.title = {
      key: "validation.titleLength",
      params: {
        min: VALIDATION_RULES.title.min,
        max: VALIDATION_RULES.title.max,
      },
    };
  if (
    form.description.length < VALIDATION_RULES.description.min ||
    form.description.length > VALIDATION_RULES.description.max
  )
    errors.description = {
      key: "validation.descriptionLength",
      params: {
        min: VALIDATION_RULES.description.min,
        max: VALIDATION_RULES.description.max,
      },
    };
  if (form.tags.length > VALIDATION_RULES.tags.max)
    errors.tags = {
      key: "validation.tagsMax",
      params: { max: VALIDATION_RULES.tags.max },
    };
  return errors;
};

export default validateEventForm;

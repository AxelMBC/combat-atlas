import { type FormEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import FeedbackModal from "@/components/FeedbackModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addTag,
  clearSubmitStatus,
  removeTag,
  resetForm,
  selectAvailableFighters,
  selectEventForm,
  selectLoadingFighters,
  selectSubmitStatus,
  updateField,
} from "@/store/eventIngestion/eventIngestionSlice";
import {
  fetchFightersByCountry,
  submitEvent,
} from "@/store/eventIngestion/thunks";
import type { Fighter } from "@/types/fighter.types";
import {
  COUNTRY_OPTIONS,
  VALIDATION_RULES,
  YT_ID_REGEX,
} from "@/pages/EventIngestion/eventIngestion.config";
import FormSection from "../FormSection/FormSection";
import VideoPreview from "../VideoPreview/VideoPreview";
import TagsInput from "../TagsInput/TagsInput";
import FighterSelector from "../FighterSelector/FighterSelector";
import type { FieldErrors } from "./EventForm.types";

const validate = (form: ReturnType<typeof selectEventForm>): FieldErrors => {
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

const EventForm = () => {
  const dispatch = useAppDispatch();
  const form = useAppSelector(selectEventForm);
  const fighters = useAppSelector(selectAvailableFighters);
  const loadingFighters = useAppSelector(selectLoadingFighters);
  const { submitting, submitSuccess, submitError } =
    useAppSelector(selectSubmitStatus);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (form.country) {
      dispatch(fetchFightersByCountry(form.country));
    }
  }, [form.country, dispatch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    dispatch(submitEvent(form));
  };

  const handleReset = () => {
    dispatch(resetForm());
    dispatch(clearSubmitStatus());
    setFieldErrors({});
  };

  const handleSuccessClose = () => {
    dispatch(resetForm());
    dispatch(clearSubmitStatus());
    setFieldErrors({});
  };

  const handleErrorClose = () => {
    dispatch(clearSubmitStatus());
  };

  const handleFighterChange =
    (corner: "Red" | "Blue") => (fighter: Fighter | null) => {
      dispatch(
        updateField({ field: `fighter${corner}`, value: fighter?.name ?? "" })
      );
      dispatch(
        updateField({ field: `fighter${corner}Id`, value: fighter?._id ?? "" })
      );
    };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <FormSection title="País y Video">
        <TextField
          select
          label="País"
          value={form.country}
          onChange={(e) =>
            dispatch(updateField({ field: "country", value: e.target.value }))
          }
          required
          fullWidth
          size="small"
          error={!!fieldErrors.country}
          helperText={fieldErrors.country}
        >
          {COUNTRY_OPTIONS.map((opt) => (
            <MenuItem key={opt.slug} value={opt.slug}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="ID de YouTube"
          value={form.idYt}
          onChange={(e) =>
            dispatch(updateField({ field: "idYt", value: e.target.value }))
          }
          required
          fullWidth
          size="small"
          inputProps={{ maxLength: 11 }}
          error={
            !!fieldErrors.idYt ||
            (form.idYt.length > 0 && !YT_ID_REGEX.test(form.idYt))
          }
          helperText={
            fieldErrors.idYt ??
            "11 caracteres del ID del video (ej: dQw4w9WgXcQ)"
          }
        />

        <TextField
          label="Tiempo de inicio (segundos)"
          type="number"
          value={form.startTime}
          onChange={(e) =>
            dispatch(
              updateField({
                field: "startTime",
                value: String(Math.max(0, Number(e.target.value))),
              })
            )
          }
          required
          fullWidth
          size="small"
          inputProps={{ min: 0 }}
          error={!!fieldErrors.startTime}
          helperText={fieldErrors.startTime}
        />

        <VideoPreview idYt={form.idYt} startTime={form.startTime} />
      </FormSection>

      <FormSection title="Información del Evento">
        <TextField
          label="Título"
          value={form.title}
          onChange={(e) =>
            dispatch(updateField({ field: "title", value: e.target.value }))
          }
          required
          fullWidth
          size="small"
          inputProps={{ minLength: 3, maxLength: 200 }}
          error={
            !!fieldErrors.title ||
            (form.title.length > 0 &&
              form.title.length < VALIDATION_RULES.title.min)
          }
          helperText={
            fieldErrors.title ??
            `${form.title.length}/${VALIDATION_RULES.title.max}`
          }
        />

        <TextField
          label="Descripción"
          value={form.description}
          onChange={(e) =>
            dispatch(
              updateField({ field: "description", value: e.target.value })
            )
          }
          required
          fullWidth
          multiline
          minRows={3}
          size="small"
          inputProps={{ maxLength: 1000 }}
          error={
            !!fieldErrors.description ||
            (form.description.length > 0 &&
              form.description.length < VALIDATION_RULES.description.min)
          }
          helperText={
            fieldErrors.description ??
            `${form.description.length}/${VALIDATION_RULES.description.max}`
          }
        />

        <TagsInput
          tags={form.tags}
          onAdd={(tag) => dispatch(addTag(tag))}
          onRemove={(tag) => dispatch(removeTag(tag))}
          error={fieldErrors.tags}
        />
      </FormSection>

      <FormSection title="Peleadores">
        <TextField
          label="ID del peleador principal (opcional)"
          value={form.fighterId}
          onChange={(e) =>
            dispatch(updateField({ field: "fighterId", value: e.target.value }))
          }
          fullWidth
          size="small"
          helperText="ID interno del peleador destacado en esta pelea"
        />

        <FighterSelector
          corner="red"
          fighters={fighters}
          selectedId={form.fighterRedId}
          onChange={handleFighterChange("Red")}
          disabled={loadingFighters}
        />

        <FighterSelector
          corner="blue"
          fighters={fighters}
          selectedId={form.fighterBlueId}
          onChange={handleFighterChange("Blue")}
          disabled={loadingFighters}
        />

        {loadingFighters && (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={16} />
            <span>Cargando peleadores...</span>
          </Box>
        )}
      </FormSection>

      <FeedbackModal
        open={submitSuccess}
        variant="success"
        title="Evento creado exitosamente"
        onClose={handleSuccessClose}
      />

      <FeedbackModal
        open={!!submitError}
        variant="error"
        title="Error al crear el evento"
        message={submitError ?? undefined}
        confirmLabel="Cerrar"
        onClose={handleErrorClose}
      />

      <Box display="flex" gap={2} justifyContent="flex-end">
        <Button variant="outlined" onClick={handleReset} disabled={submitting}>
          Limpiar
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          startIcon={
            submitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : undefined
          }
        >
          {submitting ? "Enviando..." : "Enviar Evento"}
        </Button>
      </Box>
    </Box>
  );
};

export default EventForm;

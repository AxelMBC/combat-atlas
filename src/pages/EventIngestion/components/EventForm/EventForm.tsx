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
import FormSection from "@/pages/EventIngestion/components/FormSection/FormSection";
import VideoPreview from "@/pages/EventIngestion/components/VideoPreview/VideoPreview";
import TagsInput from "@/pages/EventIngestion/components/TagsInput/TagsInput";
import FighterSelector from "@/pages/EventIngestion/components/FighterSelector/FighterSelector";
import type { FieldError, FieldErrors } from "./EventForm.types";
import validateEventForm from "@/utils/validateEventForm";
import { useTranslation } from "@/i18n";

const EventForm = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const form = useAppSelector(selectEventForm);
  const fighters = useAppSelector(selectAvailableFighters);
  const loadingFighters = useAppSelector(selectLoadingFighters);
  const { submitting, submitSuccess, submitError } =
    useAppSelector(selectSubmitStatus);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const errorText = (err?: FieldError): string | undefined =>
    err ? t(err.key, err.params) : undefined;

  useEffect(() => {
    if (form.country) {
      dispatch(fetchFightersByCountry(form.country));
    }
  }, [form.country, dispatch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors = validateEventForm(form);
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
      <FormSection title={t("eventForm.section.countryVideo")}>
        <TextField
          select
          label={t("eventForm.field.country")}
          value={form.country}
          onChange={(e) =>
            dispatch(updateField({ field: "country", value: e.target.value }))
          }
          required
          fullWidth
          size="small"
          error={!!fieldErrors.country}
          helperText={errorText(fieldErrors.country)}
        >
          {COUNTRY_OPTIONS.map((opt) => (
            <MenuItem key={opt.slug} value={opt.slug}>
              {t(opt.labelKey)}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label={t("eventForm.field.youtubeId")}
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
            errorText(fieldErrors.idYt) ?? t("eventForm.help.youtubeIdFormat")
          }
        />

        <TextField
          label={t("eventForm.field.startTime")}
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
          helperText={errorText(fieldErrors.startTime)}
        />

        <VideoPreview idYt={form.idYt} startTime={form.startTime} />
      </FormSection>

      <FormSection title={t("eventForm.section.eventInfo")}>
        <TextField
          label={t("eventForm.field.title")}
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
            errorText(fieldErrors.title) ??
            `${form.title.length}/${VALIDATION_RULES.title.max}`
          }
        />

        <TextField
          label={t("eventForm.field.description")}
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
            errorText(fieldErrors.description) ??
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

      <FormSection title={t("eventForm.section.fighters")}>
        <TextField
          label={t("eventForm.field.mainFighterId")}
          value={form.fighterId}
          onChange={(e) =>
            dispatch(updateField({ field: "fighterId", value: e.target.value }))
          }
          fullWidth
          size="small"
          helperText={t("eventForm.help.mainFighterIdInfo")}
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
            <span>{t("eventForm.loading.fighters")}</span>
          </Box>
        )}
      </FormSection>

      <FeedbackModal
        open={submitSuccess}
        variant="success"
        title={t("eventForm.success.title")}
        onClose={handleSuccessClose}
      />

      <FeedbackModal
        open={!!submitError}
        variant="error"
        title={t("eventForm.error.title")}
        message={submitError ?? undefined}
        confirmLabel={t("common.close")}
        onClose={handleErrorClose}
      />

      <Box display="flex" gap={2} justifyContent="flex-end">
        <Button variant="outlined" onClick={handleReset} disabled={submitting}>
          {t("eventForm.button.clear")}
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
          {submitting
            ? t("eventForm.button.submitting")
            : t("eventForm.button.submit")}
        </Button>
      </Box>
    </Box>
  );
};

export default EventForm;

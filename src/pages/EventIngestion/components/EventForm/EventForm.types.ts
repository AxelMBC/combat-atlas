import type { TranslationKey, TranslationParams } from "@/i18n";

export interface FieldError {
  key: TranslationKey;
  params?: TranslationParams;
}

export interface FieldErrors {
  country?: FieldError;
  idYt?: FieldError;
  startTime?: FieldError;
  title?: FieldError;
  description?: FieldError;
  tags?: FieldError;
}

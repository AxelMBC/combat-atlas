import type { FieldError } from "@/pages/EventIngestion/components/EventForm/EventForm.types";

export interface TagsInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  error?: FieldError;
}

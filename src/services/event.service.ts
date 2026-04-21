import api from "./api";
import type { EventFormData } from "@/store/eventIngestion/eventIngestionSlice.types";

export const submitEventData = async (formData: EventFormData) => {
  const { data } = await api.post("/events", formData);
  if (!data) throw new Error("Respuesta inesperada del servidor.");
  return data;
};

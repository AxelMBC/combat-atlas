import api from "./api";

export const getCountryData = async (slug: string) => {
  const { data } = await api.get(`/countries/${slug}`);
  if (!data?.data) throw new Error("Respuesta inesperada del servidor.");
  return data.data;
};

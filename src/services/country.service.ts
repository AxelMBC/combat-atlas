import api from "./api";

export const getCountryData = async (slug: string) => {
  const { data } = await api.get(`/countries/${slug}`);
  return data.data;
};

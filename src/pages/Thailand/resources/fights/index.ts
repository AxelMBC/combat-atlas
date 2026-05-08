import liamVsMuangthaiImg from './liamharrison_vs_muangthai_pk.saenchai.jpg';
import pongsiriVsPairojnoiImg from './pongsiri_rambo_por_ruamrudee_vs_pairojnoi_sor_siamchai.jpg';
import ramonVsCobanImg from './ramon_dekkers_vs_coban_lookchaomaesaitong_II.jpg';
import sakmongkolVsJongsananImg from './sakmongkol_sithchuchok_vs_Jongsanan_Fairtex_v.webp';
import samartVsDieselnoiImg from './samart_payakaroon_vs_dieselnoi_chor_thanasukarn.jpg';
import pornsanaeSitmonchaiVsPakornSakyothinIImg from './pornsanae_sitmonchai_vs_pakorn_sakyothin_i.webp';

const topFightsImages: Record<string, string> = {
  'liamharrison_vs_muangthai_pk.saenchai': liamVsMuangthaiImg,
  pongsiri_rambo_por_ruamrudee_vs_pairojnoi_sor_siamchai: pongsiriVsPairojnoiImg,
  ramon_dekkers_vs_coban_lookchaomaesaitong_II: ramonVsCobanImg,
  sakmongkol_sithchuchok_vs_Jongsanan_Fairtex_v: sakmongkolVsJongsananImg,
  samart_payakaroon_vs_dieselnoi_chor_thanasukarn: samartVsDieselnoiImg,
  pornsanae_sitmonchai_vs_pakorn_sakyothin_i: pornsanaeSitmonchaiVsPakornSakyothinIImg,
};

export const getTopFightImage = (filename: string): string =>
  topFightsImages[filename] ?? '/placeholder.webp';

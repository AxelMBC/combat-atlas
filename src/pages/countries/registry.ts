import type { CountryEntry } from './registry.types';

import caneloAlvarezPortrait from '@/pages/Mexico/resources/fighters/canelo_alvarez.webp';
import saenchaiPortrait from '@/pages/Thailand/resources/fighters/saenchai.jpg';
import kyleSnyderPortrait from '@/pages/UnitedStates/resources/kyle_snyder.webp';

export const countryRegistry: CountryEntry[] = [
  {
    slug: 'mexico',
    nameKey: 'country.mexico.name',
    disciplineKey: 'country.mexico.discipline',
    isoCode: 'MX',
    center: { lat: 23.6, lng: -102.5 },
    accentColor: '#fb1c08',
    portrait: { src: caneloAlvarezPortrait, fighterName: 'Canelo Álvarez' },
    loader: () => import('@/pages/Mexico'),
  },
  {
    slug: 'thailand',
    nameKey: 'country.thailand.name',
    disciplineKey: 'country.thailand.discipline',
    isoCode: 'TH',
    center: { lat: 15.0, lng: 101.0 },
    accentColor: '#f59e08',
    portrait: { src: saenchaiPortrait, fighterName: 'Saenchai' },
    loader: () => import('@/pages/Thailand'),
  },
  {
    slug: 'united-states',
    nameKey: 'country.unitedStates.name',
    disciplineKey: 'country.unitedStates.discipline',
    isoCode: 'US',
    center: { lat: 39.5, lng: -98.4 },
    accentColor: '#3a40fb',
    portrait: { src: kyleSnyderPortrait, fighterName: 'Kyle Snyder' },
    loader: () => import('@/pages/UnitedStates'),
  },
];

import type { AddressSuggestion, SettleAddress } from '../../types/address';
import { buildPublicAddressLabel, normalizeAddress } from './address.privacy';

type DadataSuggestion = {
  value: string;
  unrestricted_value?: string;
  data?: {
    country?: string;
    region_with_type?: string;
    city_with_type?: string;
    settlement_with_type?: string;
    street_with_type?: string;
    house?: string;
    geo_lat?: string;
    geo_lon?: string;
    fias_id?: string;
    qc_geo?: string;
  };
};

type DadataResponse = {
  suggestions?: DadataSuggestion[];
};

const DADATA_ENDPOINT = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
const TWO_GIS_REVERSE_ENDPOINT = 'https://catalog.api.2gis.com/3.0/items/geocode';

const defaultCity = import.meta.env.VITE_DEFAULT_CITY || 'Якутск';
const defaultCountry = import.meta.env.VITE_DEFAULT_COUNTRY || 'RU';

const getPrecision = (qcGeo?: string) => {
  if (qcGeo === '0' || qcGeo === '1') return 'exact';
  if (qcGeo === '2' || qcGeo === '3') return 'street';
  return 'manual_without_coordinates';
};

const toAddress = (suggestion: DadataSuggestion): SettleAddress => {
  const data = suggestion.data ?? {};
  const city = data.city_with_type ?? data.settlement_with_type ?? defaultCity;
  const address: SettleAddress = {
    source: 'dadata',
    formatted: suggestion.value,
    formattedAddress: suggestion.value,
    publicLabel: buildPublicAddressLabel({
      city,
      street: data.street_with_type,
    }),
    country: data.country ?? defaultCountry,
    region: data.region_with_type,
    city: data.city_with_type,
    settlement: data.settlement_with_type,
    street: data.street_with_type,
    house: data.house,
    lat: data.geo_lat ? Number(data.geo_lat) : undefined,
    lon: data.geo_lon ? Number(data.geo_lon) : undefined,
    fiasId: data.fias_id,
    geoPrecision: getPrecision(data.qc_geo),
    raw: suggestion,
  };

  return normalizeAddress(address);
};

export const searchAddressSuggestions = async (query: string): Promise<AddressSuggestion[]> => {
  const token = import.meta.env.VITE_DADATA_TOKEN as string | undefined;
  const trimmed = query.trim();

  if (!token || trimmed.length < 3) return [];

  const response = await fetch(DADATA_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      query: trimmed,
      count: 7,
      locations: [{ country: defaultCountry, city: defaultCity }],
      restrict_value: false,
    }),
  });

  if (!response.ok) throw new Error(`DaData search failed: ${response.status}`);

  const data = (await response.json()) as DadataResponse;

  return (data.suggestions ?? []).map((suggestion, index) => {
    const address = toAddress(suggestion);
    const secondary = [address.city ?? address.settlement, address.region].filter(Boolean).join(' · ');

    return {
      id: address.fiasId ?? `${suggestion.value}-${index}`,
      label: suggestion.value,
      main: [address.street, address.house].filter(Boolean).join(', ') || suggestion.value,
      secondary,
      chip: address.house ? 'точный дом' : 'уточнить дом',
      address,
    };
  });
};

export const reverseGeocode = async (lat: number, lon: number, source: SettleAddress['source'] = 'map'): Promise<SettleAddress> => {
  const key = import.meta.env.VITE_2GIS_KEY as string | undefined;

  if (!key) {
    return normalizeAddress({
      source,
      formatted: 'Точка на карте',
      formattedAddress: 'Точка на карте',
      publicLabel: `${defaultCity} · выбранный адрес`,
      city: defaultCity,
      lat,
      lon,
      geoPrecision: 'manual_without_coordinates',
    });
  }

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    key,
    fields: 'items.point,items.full_name,items.address_name',
  });

  const response = await fetch(`${TWO_GIS_REVERSE_ENDPOINT}?${params.toString()}`);
  if (!response.ok) throw new Error(`2GIS reverse geocode failed: ${response.status}`);

  const data = await response.json();
  const item = data?.result?.items?.[0];
  const formatted = item?.full_name ?? item?.address_name ?? 'Точка на карте';

  return normalizeAddress({
    source,
    formatted,
    formattedAddress: formatted,
    publicLabel: `${defaultCity} · выбранный адрес`,
    city: defaultCity,
    lat,
    lon,
    geoPrecision: item ? 'exact' : 'manual_without_coordinates',
    raw: item,
  });
};

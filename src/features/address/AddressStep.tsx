import { LocateFixed, MapPin, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { toast } from 'sonner';
import { AnimatedButton } from '../../components/AnimatedButton/AnimatedButton';
import { StatusSticker } from '../../components/StatusSticker/StatusSticker';
import { addressService } from '../../services/addressService';
import type { AddressSuggestion, SettleAddress } from '../../types/address';
import { motionTokens } from '../../motion/motionTokens';
import { impactHaptic, notificationHaptic, requestBrowserLocation, requestTelegramLocation } from '../../utils/telegram';
import { reverseGeocode } from './address.api';
import { getAddressFormatted, normalizeAddress } from './address.privacy';
import { validateAddress } from './address.validation';

type Props = {
  value?: SettleAddress;
  onConfirm: (address: SettleAddress) => void;
};

type AddressMode = 'idle' | 'manual' | 'map';

const defaultCity = import.meta.env.VITE_DEFAULT_CITY || 'Якутск';

const emptyManualAddress: SettleAddress = {
  source: 'manual',
  city: defaultCity,
  formatted: '',
  formattedAddress: '',
  publicLabel: `${defaultCity} · выбранный адрес`,
  geoPrecision: 'manual_without_coordinates',
};

const buildManualFormatted = (address: SettleAddress) =>
  [address.city ?? address.settlement, address.street, address.house].filter(Boolean).join(', ');

export const AddressStep = ({ value, onConfirm }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<AddressMode>('idle');
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 320);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [candidate, setCandidate] = useState<SettleAddress | undefined>();
  const [manual, setManual] = useState<SettleAddress>(value ?? emptyManualAddress);
  const hasDadataToken = Boolean(import.meta.env.VITE_DADATA_TOKEN);
  const hasTwoGisKey = Boolean(import.meta.env.VITE_2GIS_KEY);

  const selectedFormatted = useMemo(() => getAddressFormatted(value), [value]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!hasDadataToken || debouncedQuery.trim().length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      setMessage('');

      const results = await addressService.search(debouncedQuery);
      if (!active) return;

      setSuggestions(results);
      setIsLoading(false);
      if (results.length === 0) {
        setMessage('Адрес можно ввести вручную.');
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [debouncedQuery, hasDadataToken]);

  const openCandidate = (address: SettleAddress) => {
    impactHaptic('medium');
    setCandidate(normalizeAddress(address));
    setMode('idle');
  };

  const confirmAddress = (address = candidate) => {
    if (!address) return;

    const normalized = normalizeAddress(address);
    const error = validateAddress(normalized);

    if (error) {
      notificationHaptic('error');
      toast.error(error);
      return;
    }

    notificationHaptic('success');
    onConfirm(normalized);
  };

  const useCurrentLocation = async () => {
    impactHaptic('light');
    setMessage('Ищем точку заказа…');

    const location = (await requestTelegramLocation()) ?? (await requestBrowserLocation());

    if (!location) {
      setMessage('Можно найти адрес вручную.');
      inputRef.current?.focus();
      return;
    }

    try {
      const address = await reverseGeocode(location.lat, location.lon, 'telegram_location');
      setCandidate(address);
      setMessage('');
    } catch {
      setCandidate(
        normalizeAddress({
          source: 'telegram_location',
          formatted: 'Точка на карте',
          formattedAddress: 'Точка на карте',
          publicLabel: `${defaultCity} · выбранный адрес`,
          city: defaultCity,
          lat: location.lat,
          lon: location.lon,
          geoPrecision: 'manual_without_coordinates',
        }),
      );
      setMessage('Адрес можно подтвердить без карты.');
    }
  };

  const updateManual = (patch: Partial<SettleAddress>) => {
    setManual((current) => {
      const next = { ...current, ...patch };
      const formatted = patch.formatted ?? buildManualFormatted(next);
      return normalizeAddress({ ...next, formatted, formattedAddress: formatted });
    });
  };

  const confirmManual = () => {
    const address = normalizeAddress({
      ...manual,
      source: 'manual',
      formatted: buildManualFormatted(manual) || getAddressFormatted(manual),
      formattedAddress: buildManualFormatted(manual) || getAddressFormatted(manual),
      geoPrecision: 'manual_without_coordinates',
    });
    confirmAddress(address);
  };

  return (
    <div className="address-step">
      <section className="address-entry-card">
        <div>
          <span className="eyebrow">адрес заказа</span>
          <h2>Куда прикрепить заказ?</h2>
          <p>Адрес нужен, чтобы карточка выглядела почти настоящей.</p>
        </div>

        <AnimatedButton type="button" variant="primary-dopamine" className="primary-button full-width" onClick={useCurrentLocation}>
          <LocateFixed size={18} />
          Определить автоматически
        </AnimatedButton>

        <label className="address-search-field">
          <Search size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={hasDadataToken ? 'Улица, дом' : 'Адрес можно ввести вручную'}
          />
        </label>

        {!hasDadataToken && <div className="address-soft-message">DaData token не задан. Адрес можно ввести вручную.</div>}
        {message && <div className="address-soft-message">{message}</div>}

        <button type="button" className="address-manual-link" onClick={() => setMode('manual')}>
          Ввести вручную
        </button>
      </section>

      <AnimatePresence>
        {isLoading && (
          <motion.div className="address-suggestions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {[0, 1, 2].map((item) => (
              <div className="address-suggestion address-suggestion--skeleton" key={item} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && suggestions.length > 0 && (
        <motion.div className="address-suggestions" layout>
          {suggestions.map((suggestion) => (
            <motion.button
              type="button"
              className="address-suggestion"
              key={suggestion.id}
              onClick={() => openCandidate(suggestion.address)}
              whileTap={{ scale: 0.98 }}
              transition={motionTokens.springSoft}
            >
              <MapPin size={18} />
              <span>
                <strong>{suggestion.main ?? suggestion.label}</strong>
                <small>{suggestion.secondary || 'можно выбрать'}</small>
              </span>
              <StatusSticker tone={suggestion.chip === 'точный дом' ? 'mint' : 'lilac'}>
                {suggestion.chip ?? 'можно выбрать'}
              </StatusSticker>
            </motion.button>
          ))}
        </motion.div>
      )}

      {selectedFormatted && (
        <motion.section className="selected-address selected-address--locked" layout>
          <div className="selected-address__copy">
            <span>Адрес на месте</span>
            <strong>{selectedFormatted}</strong>
          </div>
          <StatusSticker tone="orange">адрес есть</StatusSticker>
        </motion.section>
      )}

      <AnimatePresence>
        {candidate && mode !== 'map' && (
          <AddressConfirmSheet
            address={candidate}
            canOpenMap={Boolean(candidate.lat && candidate.lon && hasTwoGisKey)}
            onClose={() => setCandidate(undefined)}
            onConfirm={() => confirmAddress(candidate)}
            onMap={() => setMode('map')}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mode === 'manual' && (
          <ManualAddressForm
            value={manual}
            onChange={updateManual}
            onClose={() => setMode('idle')}
            onConfirm={confirmManual}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mode === 'map' && candidate && (
          <MapConfirm
            address={candidate}
            onClose={() => setMode('idle')}
            onConfirm={(address) => confirmAddress(address)}
            onChangeAddress={() => {
              setMode('idle');
              inputRef.current?.focus();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const AddressConfirmSheet = ({
  address,
  canOpenMap,
  onClose,
  onConfirm,
  onMap,
}: {
  address: SettleAddress;
  canOpenMap: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onMap: () => void;
}) => (
  <motion.div className="bottom-sheet-shell" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.section
      className="address-bottom-sheet"
      initial={{ y: 90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={motionTokens.springLayout}
    >
      <button type="button" className="sheet-close" onClick={onClose} aria-label="Закрыть">
        <X size={18} />
      </button>
      <div className="sheet-handle" />
      <h2>Проверьте адрес</h2>
      <p>Если всё на месте, прикрепим его к заказу.</p>
      <div className="address-confirm-card">
        <MapPin size={18} />
        <strong>{getAddressFormatted(address)}</strong>
        <span>{address.publicLabel}</span>
      </div>
      <AnimatedButton type="button" variant="primary-dopamine" className="primary-button full-width" onClick={onConfirm}>
        Прикрепить адрес
      </AnimatedButton>
      {canOpenMap ? (
        <AnimatedButton type="button" variant="utility" className="secondary-button full-width" onClick={onMap}>
          Уточнить на карте
        </AnimatedButton>
      ) : (
        <button type="button" className="address-manual-link" onClick={onClose}>
          Изменить
        </button>
      )}
    </motion.section>
  </motion.div>
);

const ManualAddressForm = ({
  value,
  onChange,
  onClose,
  onConfirm,
}: {
  value: SettleAddress;
  onChange: (patch: Partial<SettleAddress>) => void;
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <motion.div className="bottom-sheet-shell" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.section className="address-bottom-sheet" initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={motionTokens.springLayout}>
      <button type="button" className="sheet-close" onClick={onClose} aria-label="Закрыть">
        <X size={18} />
      </button>
      <div className="sheet-handle" />
      <h2>Ввести адрес вручную</h2>
      <p>Иногда так быстрее.</p>
      <div className="form-grid">
        <label className="field">
          <span>Город или поселок</span>
          <input value={value.city ?? value.settlement ?? ''} onChange={(event) => onChange({ city: event.target.value })} />
        </label>
        <label className="field">
          <span>Улица / адресная линия</span>
          <input value={value.street ?? ''} onChange={(event) => onChange({ street: event.target.value })} />
        </label>
        <label className="field">
          <span>Дом</span>
          <input value={value.house ?? ''} onChange={(event) => onChange({ house: event.target.value })} />
        </label>
      </div>
      <label className="field">
        <span>Заметка</span>
        <textarea value={value.note ?? ''} onChange={(event) => onChange({ note: event.target.value })} placeholder="Например: адрес для карточки" />
      </label>
      <AnimatedButton type="button" variant="primary-dopamine" className="primary-button full-width" onClick={onConfirm}>
        Прикрепить адрес
      </AnimatedButton>
    </motion.section>
  </motion.div>
);

const MapConfirm = ({
  address,
  onClose,
  onConfirm,
  onChangeAddress,
}: {
  address: SettleAddress;
  onClose: () => void;
  onConfirm: (address: SettleAddress) => void;
  onChangeAddress: () => void;
}) => {
  const [isMoving, setIsMoving] = useState(false);

  return (
    <motion.div className="map-confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="map-confirm__surface">
        <div className="map-confirm__grid" />
        <motion.div
          className="map-confirm__pin"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: isMoving ? -12 : 0, opacity: 1 }}
          transition={motionTokens.springPop}
        >
          <MapPin size={34} />
        </motion.div>
        <button
          type="button"
          className="map-recenter"
          onClick={() => {
            setIsMoving(true);
            window.setTimeout(() => setIsMoving(false), 420);
          }}
        >
          <LocateFixed size={18} />
        </button>
      </div>
      <section className="address-bottom-sheet map-confirm__sheet">
        <div className="sheet-handle" />
        <h2>Проверьте точку</h2>
        <p>Можно чуть сдвинуть карту, если нужно.</p>
        <div className="address-confirm-card">
          <MapPin size={18} />
          <strong>{getAddressFormatted(address)}</strong>
          <span>{address.publicLabel}</span>
        </div>
        <AnimatedButton type="button" variant="primary-dopamine" className="primary-button full-width" onClick={() => onConfirm({ ...address, source: 'map' })}>
          Здесь
        </AnimatedButton>
        <AnimatedButton type="button" variant="utility" className="secondary-button full-width" onClick={onChangeAddress}>
          Изменить адрес
        </AnimatedButton>
        <button type="button" className="address-manual-link" onClick={onClose}>
          Закрыть карту
        </button>
      </section>
    </motion.div>
  );
};

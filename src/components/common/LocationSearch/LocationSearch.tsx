import { useState, useRef, useEffect, useMemo } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { PAKISTAN_CITIES } from '../../../utils/constants';
import type { LocationWithAddress } from '../../../types';
import './LocationSearch.css';

interface LocationSearchProps {
  label: string;
  placeholder?: string;
  value: LocationWithAddress | null;
  onChange: (location: LocationWithAddress | null) => void;
  isActive?: boolean;
  onFocus?: () => void;
}

// Extended locations including popular areas within cities
const LOCATIONS = [
  // Islamabad
  { name: 'Islamabad - Blue Area', city: 'Islamabad', lat: 33.7294, lng: 73.0931 },
  { name: 'Islamabad - F-6 Markaz', city: 'Islamabad', lat: 33.7215, lng: 73.0703 },
  { name: 'Islamabad - F-7 Markaz', city: 'Islamabad', lat: 33.7194, lng: 73.0562 },
  { name: 'Islamabad - F-8 Markaz', city: 'Islamabad', lat: 33.7028, lng: 73.0363 },
  { name: 'Islamabad - G-9 Markaz', city: 'Islamabad', lat: 33.6873, lng: 73.0341 },
  { name: 'Islamabad - I-8', city: 'Islamabad', lat: 33.6681, lng: 73.0744 },
  { name: 'Islamabad - Faisal Mosque', city: 'Islamabad', lat: 33.7295, lng: 73.0372 },
  { name: 'Islamabad - Pakistan Monument', city: 'Islamabad', lat: 33.6931, lng: 73.0689 },
  { name: 'Islamabad - Centaurus Mall', city: 'Islamabad', lat: 33.7077, lng: 73.0498 },
  
  // Rawalpindi
  { name: 'Rawalpindi - Saddar', city: 'Rawalpindi', lat: 33.5977, lng: 73.0479 },
  { name: 'Rawalpindi - Raja Bazaar', city: 'Rawalpindi', lat: 33.5965, lng: 73.0583 },
  { name: 'Rawalpindi - Commercial Market', city: 'Rawalpindi', lat: 33.5853, lng: 73.0643 },
  { name: 'Rawalpindi - Bahria Town', city: 'Rawalpindi', lat: 33.5225, lng: 73.1031 },
  
  // Lahore
  { name: 'Lahore - Gulberg', city: 'Lahore', lat: 31.5183, lng: 74.3466 },
  { name: 'Lahore - Mall Road', city: 'Lahore', lat: 31.5569, lng: 74.3258 },
  { name: 'Lahore - Defence (DHA)', city: 'Lahore', lat: 31.4697, lng: 74.3965 },
  { name: 'Lahore - Liberty Market', city: 'Lahore', lat: 31.5142, lng: 74.3407 },
  { name: 'Lahore - Anarkali', city: 'Lahore', lat: 31.5643, lng: 74.3211 },
  { name: 'Lahore - Model Town', city: 'Lahore', lat: 31.4821, lng: 74.3170 },
  { name: 'Lahore - Johar Town', city: 'Lahore', lat: 31.4687, lng: 74.2716 },
  { name: 'Lahore - Packages Mall', city: 'Lahore', lat: 31.4697, lng: 74.2651 },
  
  // Karachi
  { name: 'Karachi - Clifton', city: 'Karachi', lat: 24.8138, lng: 67.0300 },
  { name: 'Karachi - DHA', city: 'Karachi', lat: 24.7997, lng: 67.0506 },
  { name: 'Karachi - Saddar', city: 'Karachi', lat: 24.8556, lng: 67.0200 },
  { name: 'Karachi - Gulshan-e-Iqbal', city: 'Karachi', lat: 24.9220, lng: 67.0917 },
  { name: 'Karachi - North Nazimabad', city: 'Karachi', lat: 24.9422, lng: 67.0539 },
  { name: 'Karachi - Korangi', city: 'Karachi', lat: 24.8311, lng: 67.1311 },
  { name: 'Karachi - Dolmen Mall', city: 'Karachi', lat: 24.8204, lng: 67.0311 },
  
  // Faisalabad
  { name: 'Faisalabad - D Ground', city: 'Faisalabad', lat: 31.4187, lng: 73.0791 },
  { name: 'Faisalabad - Clock Tower', city: 'Faisalabad', lat: 31.4187, lng: 73.0791 },
  { name: 'Faisalabad - Peoples Colony', city: 'Faisalabad', lat: 31.4344, lng: 73.1003 },
  
  // Multan
  { name: 'Multan - Cantt', city: 'Multan', lat: 30.2000, lng: 71.4524 },
  { name: 'Multan - Shah Rukn-e-Alam', city: 'Multan', lat: 30.1798, lng: 71.4214 },
  { name: 'Multan - Hussain Agahi', city: 'Multan', lat: 30.1985, lng: 71.4568 },
  
  // Peshawar
  { name: 'Peshawar - Saddar', city: 'Peshawar', lat: 34.0101, lng: 71.5249 },
  { name: 'Peshawar - University Town', city: 'Peshawar', lat: 34.0091, lng: 71.4897 },
  { name: 'Peshawar - Hayatabad', city: 'Peshawar', lat: 33.9949, lng: 71.4507 },
  
  // Hyderabad
  { name: 'Hyderabad - Latifabad', city: 'Hyderabad', lat: 25.4299, lng: 68.3301 },
  { name: 'Hyderabad - Qasimabad', city: 'Hyderabad', lat: 25.3742, lng: 68.3452 },
  { name: 'Hyderabad - Auto Bhan Road', city: 'Hyderabad', lat: 25.3999, lng: 68.3601 },
];

// Add the main city centers as well
Object.entries(PAKISTAN_CITIES).forEach(([name, coords]) => {
  if (!LOCATIONS.find(l => l.name === name)) {
    LOCATIONS.push({
      name: `${name} - City Center`,
      city: name,
      lat: coords.lat,
      lng: coords.lng,
    });
  }
});

const LocationSearch = ({
  label,
  placeholder = 'Search for a location...',
  value,
  onChange,
  isActive = false,
  onFocus,
}: LocationSearchProps) => {
  // Derive display value from prop when not actively editing
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use the local search term when editing, otherwise use the value's address
  const displayValue = isEditing ? localSearchTerm : (value?.address || '');

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter locations based on search term using useMemo
  const filteredLocations = useMemo(() => {
    const term = isEditing ? localSearchTerm : '';
    if (term.trim() === '') {
      return LOCATIONS;
    }
    return LOCATIONS.filter(
      (location) =>
        location.name.toLowerCase().includes(term.toLowerCase()) ||
        location.city.toLowerCase().includes(term.toLowerCase())
    );
  }, [localSearchTerm, isEditing]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
    setIsEditing(true);
    setIsOpen(true);
    setHighlightedIndex(-1); // Reset highlighted index when input changes
    if (e.target.value === '') {
      onChange(null);
    }
  };

  const handleSelectLocation = (location: typeof LOCATIONS[0]) => {
    const locationWithAddress: LocationWithAddress = {
      lat: location.lat,
      lng: location.lng,
      address: location.name,
    };
    onChange(locationWithAddress);
    setLocalSearchTerm(location.name);
    setIsEditing(false);
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredLocations.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredLocations[highlightedIndex]) {
          handleSelectLocation(filteredLocations[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setIsEditing(false);
        break;
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
    setLocalSearchTerm(value?.address || '');
    setIsEditing(true);
    onFocus?.();
  };

  const handleClear = () => {
    setLocalSearchTerm('');
    setIsEditing(false);
    onChange(null);
    inputRef.current?.focus();
  };

  return (
    <div className={`location-search ${isActive ? 'active' : ''}`} ref={wrapperRef}>
      <label className="location-search-label">{label}</label>
      <div className="location-search-input-wrapper">
        <span className="location-search-icon">📍</span>
        <input
          ref={inputRef}
          type="text"
          className="location-search-input"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {displayValue && (
          <button
            type="button"
            className="location-search-clear"
            onClick={handleClear}
          >
            ×
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="location-search-dropdown">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location, index) => (
              <div
                key={`${location.name}-${index}`}
                className={`location-search-option ${
                  highlightedIndex === index ? 'highlighted' : ''
                } ${value?.address === location.name ? 'selected' : ''}`}
                onClick={() => handleSelectLocation(location)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span className="location-option-icon">🏙️</span>
                <div className="location-option-details">
                  <span className="location-option-name">{location.name}</span>
                  <span className="location-option-city">{location.city}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="location-search-no-results">
              <span>No locations found</span>
              <span className="location-search-hint">
                Try searching for a city like "Islamabad" or "Lahore"
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;

'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Building2, Globe, ChevronDown } from 'lucide-react';

interface AddressSectionProps {
  formData: { address: string; city: string; country: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

// Popular countries list with Kenya first
const countries = [
  'Kenya',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'South Africa',
  'Nigeria',
  'Ghana',
  'Tanzania',
  'Uganda',
  'Rwanda',
  'Ethiopia',
  'Germany',
  'France',
  'India',
  'China',
  'Japan',
  'Brazil',
  'Mexico',
  'Argentina',
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Armenia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Cape Verde',
  'Central African Republic',
  'Chad',
  'Chile',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'East Timor',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Fiji',
  'Finland',
  'Gabon',
  'Gambia',
  'Georgia',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Jordan',
  'Kazakhstan',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Thailand',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'United Arab Emirates',
  'Ukraine',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];

export default function AddressSection({ formData, onChange }: AddressSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set Kenya as default if country is empty
  useEffect(() => {
    if (!formData.country) {
      const syntheticEvent = {
        target: {
          name: 'country',
          value: 'Kenya',
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  }, []);

  // Filter countries based on search
  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country: string) => {
    const syntheticEvent = {
      target: {
        name: 'country',
        value: country,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Street Address Field - Full Width */}
      <div>
        <label htmlFor="address" className="block text-sm font-bold text-slate-700 mb-2.5">
          Street Address
        </label>
        <div className="relative group">
          <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            id="address"
            name="address"
            type="text"
            placeholder="123 Main Street"
            value={formData.address}
            onChange={onChange}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300"
          />
        </div>
      </div>

      {/* City and Country Fields - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* City Field */}
        <div>
          <label htmlFor="city" className="block text-sm font-bold text-slate-700 mb-2.5">
            City
          </label>
          <div className="relative group">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              id="city"
              name="city"
              type="text"
              placeholder="Nairobi"
              value={formData.city}
              onChange={onChange}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300"
            />
          </div>
        </div>

        {/* Country Field with Searchable Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <label htmlFor="country" className="block text-sm font-bold text-slate-700 mb-2.5">
            Country
          </label>
          <div className="relative group">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors z-10" />
            <input
              id="country"
              name="country"
              type="text"
              value={isOpen ? searchTerm : formData.country || 'Kenya'}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300 cursor-pointer"
              placeholder="Search country..."
              autoComplete="off"
            />
            <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} />
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white border-2 border-orange-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
              {filteredCountries.length > 0 ? (
                <div className="py-1">
                  {filteredCountries.map((country) => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={`w-full text-left px-4 py-3 transition-colors ${
                        formData.country === country 
                          ? 'bg-orange-100 text-orange-900 font-semibold' 
                          : 'hover:bg-orange-50 text-slate-700'
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <svg className="w-12 h-12 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-slate-500 text-sm">No countries found</p>
                  <p className="text-slate-400 text-xs mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
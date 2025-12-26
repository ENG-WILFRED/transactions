interface AddressSectionProps {
  formData: { address: string; city: string; country: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function AddressSection({ formData, onChange }: AddressSectionProps) {
  return (
    <div className="space-y-2 pb-4 mb-4 border-b">
      <h3 className="text-xs font-bold text-gray-900 uppercase mb-4 tracking-wider">Address</h3>

      <div className="mb-4">
        <label htmlFor="address" className="block text-xs font-medium text-gray-700 mb-0.5">
          Street Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={onChange}
          className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
          placeholder="Street"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={onChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="City"
            />
          </div>
  
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              value={formData.country}
              onChange={onChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="Country"
            />
          </div>

        <div></div>
      </div>
    </div>
  );
}

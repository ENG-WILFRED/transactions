interface PensionSectionProps {
  formData: { contributionRate?: number; retirementAge?: number };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function PensionSection({ formData, onChange }: PensionSectionProps) {
  return (
    <div className="space-y-2 pb-4 mb-4 border-b">
      <h3 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-wider">Pension Planning</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="contributionRate" className="block text-sm font-medium text-gray-700 mb-1">
            Contribution (%)
          </label>
          <select
            id="contributionRate"
            name="contributionRate"
            value={formData.contributionRate ?? ''}
            onChange={onChange}
            className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
          >
            <option value="">Select rate</option>
            <option value="2">2%</option>
            <option value="5">5%</option>
            <option value="10">10%</option>
            <option value="15">15%</option>
            <option value="20">20%</option>
          </select>
        </div>

        <div>
          <label htmlFor="retirementAge" className="block text-sm font-medium text-gray-700 mb-1">
            Retirement Age
          </label>
          <input
            id="retirementAge"
            name="retirementAge"
            type="number"
            min="50"
            max="80"
            step="1"
            value={formData.retirementAge || ''}
            onChange={onChange}
            className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="65"
          />
        </div>

        <div></div>
      </div>
    </div>
  );
}
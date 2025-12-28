interface EmploymentSectionProps {
  formData: { occupation: string; employer: string; salary?: number };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function EmploymentSection({ formData, onChange }: EmploymentSectionProps) {
  return (
    <div className="space-y-2 pb-4 mb-4 border-b">
      <h3 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-wider">Employment</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
            Occupation
          </label>
          <input
            id="occupation"
            name="occupation"
            type="text"
            value={formData.occupation}
            onChange={onChange}
            className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="Job"
          />
        </div>

        <div>
          <label htmlFor="employer" className="block text-sm font-medium text-gray-700 mb-1">
            Employer
          </label>
          <input
            id="employer"
            name="employer"
            type="text"
            value={formData.employer}
            onChange={onChange}
            className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="Company"
          />
        </div>

        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Salary
          </label>
          <input
            id="salary"
            name="salary"
            type="number"
            min="0"
            step="0.01"
            value={formData.salary || ''}
            onChange={onChange}
            className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );
}
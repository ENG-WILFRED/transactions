interface PersonalSectionProps {
  formData: {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    nationalId: string;
    maritalStatus: string;
    spouseName: string;
    spouseDob: string;
  };
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function PersonalSection({ formData, errors, onChange }: PersonalSectionProps) {
  const isMarried = formData.maritalStatus === 'Married';

  // Calculate max date (18 years ago from today)
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-2 pb-4 mb-4 border-b">
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Personal</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={onChange}
            className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="John"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={onChange}
            className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="Doe"
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={onChange}
            className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth <span className="text-xs text-gray-500">(Must be 18+)</span>
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            max={getMaxDate()}
            value={formData.dateOfBirth}
            onChange={onChange}
            className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-xs text-red-600">{errors.dateOfBirth}</p>
          )}
        </div>

        <div>
          <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-1">
            National ID
          </label>
          <input
            id="nationalId"
            name="nationalId"
            type="text"
            value={formData.nationalId}
            onChange={onChange}
            className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="ID"
          />
        </div>

        <div>
          <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Marital Status
          </label>
          <select
            id="maritalStatus"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={onChange}
            className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
      </div>

      {isMarried && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          <div>
            <label htmlFor="spouseName" className="block text-sm font-medium text-gray-700 mb-1">
              Spouse Name
            </label>
            <input
              id="spouseName"
              name="spouseName"
              type="text"
              value={formData.spouseName}
              onChange={onChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="Name"
            />
          </div>

          <div>
            <label htmlFor="spouseDob" className="block text-sm font-medium text-gray-700 mb-1">
              Spouse DOB <span className="text-xs text-gray-500">(Must be 18+)</span>
            </label>
            <input
              id="spouseDob"
              name="spouseDob"
              type="date"
              max={getMaxDate()}
              value={formData.spouseDob}
              onChange={onChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
        </div>
      )}
    </div>
  );
}
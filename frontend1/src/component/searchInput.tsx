
"use client";


interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => (
  <div className="px-5 pb-5">
    <input
      className="w-full px-4 py-3 bg-tertiary-bg border text-primary border-primary mt-3 h-[50px] rounded text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-4 focus:ring-[#58a6ff]/20"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search friends by name or email"
    />
  </div>
);

export default SearchInput;

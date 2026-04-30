import { type FormEvent } from "react";

export type SuggestionType = "town" | "category" | "pin";

export interface SearchSuggestion {
  id: string;
  type: SuggestionType;
  label: string;
  detail: string;
  query: string;
  pinId?: string;
}

interface PlanSearchPanelProps {
  dark: boolean;
  search: string;
  showSuggestions: boolean;
  searchSuggestions: SearchSuggestion[];
  textMuted: string;
  textSoft: string;
  onSubmit: (event?: FormEvent) => void;
  onSearchChange: (value: string) => void;
  onApplySuggestion: (suggestion: SearchSuggestion) => void;
  onClear: () => void;
}

export default function PlanSearchPanel({
  dark,
  search,
  showSuggestions,
  searchSuggestions,
  textMuted,
  textSoft,
  onSubmit,
  onSearchChange,
  onApplySuggestion,
  onClear,
}: PlanSearchPanelProps) {
  return (
    <>
      <form onSubmit={onSubmit} className={`flex max-w-xl items-center gap-2 rounded-full border px-4 py-3 shadow-xl ${dark ? "bg-[#050c16]/95 border-white/20" : "bg-white/95 border-black/10"}`}>
        <span className="text-sm">🔎</span>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search towns, fuel, water, beaches"
          enterKeyHint="search"
          className={`w-full bg-transparent text-base outline-none ${dark ? "text-white placeholder-slate-400" : "text-slate-950 placeholder-slate-500"}`}
        />
        {search && (
          <button type="button" onClick={onClear} className={`text-xs font-extrabold ${textMuted}`}>
            Clear
          </button>
        )}
        <button type="submit" className="rounded-full bg-jade px-3 py-1.5 text-xs font-extrabold text-white">
          Go
        </button>
      </form>

      {showSuggestions && searchSuggestions.length > 0 && (
        <div className="map-search-suggestions max-w-xl">
          {searchSuggestions.map((suggestion) => (
            <button key={suggestion.id} type="button" className="map-search-suggestion" onClick={() => onApplySuggestion(suggestion)}>
              <span className="block font-semibold">{suggestion.label}</span>
              <span className={`mt-1 block text-xs font-semibold ${textSoft}`}>{suggestion.detail}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

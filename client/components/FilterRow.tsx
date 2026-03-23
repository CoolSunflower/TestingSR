import React from "react";
import { DateRange } from "react-day-picker";
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";

export interface FilterRowProps {
  // Keywords
  keywordOptions: MultiSelectOption[];
  selectedKeywords: string[];
  onKeywordsChange: (keywords: string[]) => void;

  // Date range
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;

  // Sentiment
  sentimentOptions: MultiSelectOption[];
  selectedSentiment: string[];
  onSentimentChange: (sentiment: string[]) => void;

  // Platform
  platformOptions: MultiSelectOption[];
  selectedPlatforms: string[];
  onPlatformsChange: (platforms: string[]) => void;

  // Apply action
  onApplyFilters: () => void;
}

export function FilterRow({
  keywordOptions,
  selectedKeywords,
  onKeywordsChange,
  dateRange,
  onDateRangeChange,
  sentimentOptions,
  selectedSentiment,
  onSentimentChange,
  platformOptions,
  selectedPlatforms,
  onPlatformsChange,
  onApplyFilters,
}: FilterRowProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
        {/* Keywords */}
        <div className="space-y-1.5">
          {/* <label className="text-[10px] font-medium text-gray-800 tracking-[0.12em] uppercase">
            Keywords
          </label> */}
          <MultiSelect
            options={keywordOptions}
            selected={selectedKeywords}
            onChange={onKeywordsChange}
            placeholder="Select keywords..."
          />
        </div>

        {/* Date Range */}
        <div className="space-y-1.5">
          {/* <label className="text-[10px] font-medium text-gray-800 tracking-[0.12em] uppercase">
            Date Range
          </label> */}
          <DateRangePicker
            date={dateRange}
            onDateChange={onDateRangeChange}
          />
        </div>

        {/* Sentiment */}
        <div className="space-y-1.5">
          {/* <label className="text-[10px] font-medium text-gray-800 tracking-[0.12em] uppercase">
            Sentiment
          </label> */}
          <MultiSelect
            options={sentimentOptions}
            selected={selectedSentiment}
            onChange={onSentimentChange}
            placeholder="Select sentiment..."
          />
        </div>

        {/* Platform */}
        <div className="space-y-1.5">
          {/* <label className="text-[10px] font-medium text-gray-800 tracking-[0.12em] uppercase">
            Platform
          </label> */}
          <MultiSelect
            options={platformOptions}
            selected={selectedPlatforms}
            onChange={onPlatformsChange}
            placeholder="Select platforms..."
          />
        </div>

        {/* Apply Button */}
        <div className="space-y-1.5">
          {/* <label className="text-[10px] font-medium text-gray-800 tracking-[0.12em] uppercase">
            Action
          </label> */}
          <Button
            onClick={onApplyFilters}
            className="w-full h-10 bg-[#111827] hover:bg-[#1F2937] text-white"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}


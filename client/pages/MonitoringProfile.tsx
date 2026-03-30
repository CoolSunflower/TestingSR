import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, Edit2, Check, Twitter, Facebook, Linkedin, MessageCircle, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Platform = "Reddit" | "X" | "Facebook" | "LinkedIn" | "Web Alerts";

type Keyword = {
  id: number;
  keyword: string;
  platforms: Platform[];
  excludedLanguages?: string[];
  excludedKeywords?: string[];
};

const PLATFORM_OPTIONS: Platform[] = ["Reddit", "X", "Facebook", "LinkedIn", "Web Alerts"];

const LANGUAGE_OPTIONS = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese",
  "Russian", "Japanese", "Chinese", "Korean", "Arabic", "Hindi"
];

// Custom Reddit Icon Component
const RedditIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

const PLATFORM_ICONS = {
  Reddit: RedditIcon,
  X: Twitter,
  Facebook: Facebook,
  LinkedIn: Linkedin,
  "Web Alerts": Globe,
};

const PLATFORM_COLORS = {
  Reddit: "text-[#FF4500]",
  X: "text-sky-500",
  Facebook: "text-blue-600",
  LinkedIn: "text-blue-700",
  "Web Alerts": "text-purple-600",
};

function KeywordSetup() {
  const [keywords, setKeywords] = useState<Keyword[]>([
    {
      id: 1,
      keyword: "brand reputation",
      platforms: ["Reddit", "X", "Web Alerts"],
      excludedLanguages: ["Spanish", "French"],
      excludedKeywords: ["spam", "advertisement"]
    },
    {
      id: 2,
      keyword: "customer feedback",
      platforms: ["Facebook", "LinkedIn"],
      excludedLanguages: [],
      excludedKeywords: []
    },
  ]);
  const [newKeyword, setNewKeyword] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [excludedLanguages, setExcludedLanguages] = useState<string[]>([]);
  const [excludedKeywords, setExcludedKeywords] = useState<string[]>([]);
  const [excludedKeywordInput, setExcludedKeywordInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editKeyword, setEditKeyword] = useState("");
  const [editPlatforms, setEditPlatforms] = useState<Platform[]>([]);
  const [editExcludedLanguages, setEditExcludedLanguages] = useState<string[]>([]);
  const [editExcludedKeywords, setEditExcludedKeywords] = useState<string[]>([]);
  const [editExcludedKeywordInput, setEditExcludedKeywordInput] = useState("");

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const toggleEditPlatform = (platform: Platform) => {
    setEditPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const toggleExcludedLanguage = (language: string) => {
    setExcludedLanguages((prev) =>
      prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]
    );
  };

  const toggleEditExcludedLanguage = (language: string) => {
    setEditExcludedLanguages((prev) =>
      prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]
    );
  };

  const addExcludedKeyword = () => {
    if (excludedKeywordInput.trim() && !excludedKeywords.includes(excludedKeywordInput.trim())) {
      setExcludedKeywords([...excludedKeywords, excludedKeywordInput.trim()]);
      setExcludedKeywordInput("");
    }
  };

  const removeExcludedKeyword = (keyword: string) => {
    setExcludedKeywords(excludedKeywords.filter((k) => k !== keyword));
  };

  const addEditExcludedKeyword = () => {
    if (editExcludedKeywordInput.trim() && !editExcludedKeywords.includes(editExcludedKeywordInput.trim())) {
      setEditExcludedKeywords([...editExcludedKeywords, editExcludedKeywordInput.trim()]);
      setEditExcludedKeywordInput("");
    }
  };

  const removeEditExcludedKeyword = (keyword: string) => {
    setEditExcludedKeywords(editExcludedKeywords.filter((k) => k !== keyword));
  };

  const handleAdd = () => {
    if (newKeyword.trim() && selectedPlatforms.length > 0) {
      setKeywords([
        ...keywords,
        {
          id: Date.now(),
          keyword: newKeyword.trim(),
          platforms: selectedPlatforms,
          excludedLanguages,
          excludedKeywords,
        },
      ]);
      setNewKeyword("");
      setSelectedPlatforms([]);
      setExcludedLanguages([]);
      setExcludedKeywords([]);
      setExcludedKeywordInput("");
    }
  };

  const handleDelete = (id: number) => {
    setKeywords(keywords.filter((k) => k.id !== id));
  };

  const startEdit = (keyword: Keyword) => {
    setEditingId(keyword.id);
    setEditKeyword(keyword.keyword);
    setEditPlatforms(keyword.platforms);
    setEditExcludedLanguages(keyword.excludedLanguages || []);
    setEditExcludedKeywords(keyword.excludedKeywords || []);
    setEditExcludedKeywordInput("");
  };

  const saveEdit = (id: number) => {
    if (editKeyword.trim() && editPlatforms.length > 0) {
      setKeywords(
        keywords.map((k) =>
          k.id === id
            ? {
                ...k,
                keyword: editKeyword.trim(),
                platforms: editPlatforms,
                excludedLanguages: editExcludedLanguages,
                excludedKeywords: editExcludedKeywords,
              }
            : k
        )
      );
      setEditingId(null);
      setEditKeyword("");
      setEditPlatforms([]);
      setEditExcludedLanguages([]);
      setEditExcludedKeywords([]);
      setEditExcludedKeywordInput("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditKeyword("");
    setEditPlatforms([]);
    setEditExcludedLanguages([]);
    setEditExcludedKeywords([]);
    setEditExcludedKeywordInput("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Keyword Setup</h2>
        <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">
          {keywords.length} configured
        </Badge>
      </div>

      {/* Add New Keyword - Progressive Flow */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-visible transition-all duration-300">
        <div className="p-4">
          {/* Step 1: Keyword Input */}
          <Input
            placeholder="Enter keyword (e.g., brand reputation, customer service...)"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            className="h-11 text-[15px] transition-all duration-200 focus:ring-2 focus:ring-gray-900"
            onKeyDown={(e) => {
              if (e.key === "Enter" && selectedPlatforms.length > 0) handleAdd();
            }}
          />

          {/* Step 2: Platform Selector - Revealed when keyword has text */}
          <div
            className={cn(
              "grid transition-all duration-500 ease-out",
              newKeyword.trim().length > 0
                ? "grid-rows-[1fr] opacity-100 mt-3"
                : "max-h-0 opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Select Platforms
                  </label>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex flex-wrap gap-2 flex-1">
                    {PLATFORM_OPTIONS.map((platform) => {
                      const Icon = PLATFORM_ICONS[platform];
                      const isSelected = selectedPlatforms.includes(platform);
                      return (
                        <button
                          key={platform}
                          onClick={() => togglePlatform(platform)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border-2",
                            isSelected
                              ? "bg-gray-900 text-white border-gray-900 shadow-md"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-sm active:scale-95"
                          )}
                        >
                          <Icon size={16} className={!isSelected ? PLATFORM_COLORS[platform] : ""} />
                          {platform}
                          {isSelected && (
                            <Check size={14} className="animate-in zoom-in duration-200" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Button - appears inline with platforms */}
                  {selectedPlatforms.length > 0 && (
                    <Button
                      onClick={handleAdd}
                      disabled={!newKeyword.trim()}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-6 transition-all active:scale-95 shadow-sm hover:shadow-md animate-in fade-in slide-in-from-right-2 duration-300"
                    >
                      {/* <Plus size={16} className="mr-1" /> */}
                      Add Keyword
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Advanced Options - Revealed when at least one platform is selected */}
          <div
            className={cn(
              "grid transition-all duration-500 ease-out",
              selectedPlatforms.length > 0
                ? "grid-rows-[1fr] opacity-100 mt-3"
                : "max-h-0 opacity-0 mt-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Advanced Filters (Optional)
                  </label>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Excluded Languages */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600">
                      Excluded Languages
                    </label>
                    <div className="relative">
                      <Select
                        onValueChange={(value) => {
                          if (!excludedLanguages.includes(value)) {
                            setExcludedLanguages([...excludedLanguages, value]);
                          }
                        }}
                      >
                        <SelectTrigger className="h-10 border-gray-200 hover:border-gray-400 transition-colors">
                          <SelectValue placeholder="Select languages to exclude..." />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGE_OPTIONS.filter(lang => !excludedLanguages.includes(lang)).map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {excludedLanguages.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 animate-in fade-in duration-300">
                        {excludedLanguages.map((lang) => (
                          <Badge
                            key={lang}
                            variant="secondary"
                            className="bg-red-50 text-red-700 border-red-200 text-xs pl-2 pr-1 py-1 hover:bg-red-100 transition-colors"
                          >
                            {lang}
                            <button
                              onClick={() => setExcludedLanguages(excludedLanguages.filter((l) => l !== lang))}
                              className="ml-1 hover:text-red-900 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Excluded Keywords */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600">
                      Excluded Keywords
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add keyword to exclude..."
                        value={excludedKeywordInput}
                        onChange={(e) => setExcludedKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addExcludedKeyword();
                          }
                        }}
                        className="h-10 border-gray-200 hover:border-gray-400 transition-colors"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={addExcludedKeyword}
                        disabled={!excludedKeywordInput.trim()}
                        className="px-3 hover:bg-gray-100 transition-all active:scale-95"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    {excludedKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 animate-in fade-in duration-300">
                        {excludedKeywords.map((keyword) => (
                          <Badge
                            key={keyword}
                            variant="secondary"
                            className="bg-red-50 text-red-700 border-red-200 text-xs pl-2 pr-1 py-1 hover:bg-red-100 transition-colors"
                          >
                            {keyword}
                            <button
                              onClick={() => removeExcludedKeyword(keyword)}
                              className="ml-1 hover:text-red-900 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Add Button - Visible when platform is selected */}
          {/* {selectedPlatforms.length > 0 && (
            <div className="flex justify-end pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Button
                onClick={handleAdd}
                disabled={!newKeyword.trim()}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 transition-all active:scale-95 shadow-sm hover:shadow-md"
              >
                <Plus size={16} className="mr-1" />
                Add Keyword
              </Button>
            </div>
          )} */}
        </div>
      </div>

      {/* Keywords List */}
      {keywords.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-100">
            {keywords.map((keyword) => (
              <div key={keyword.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                {editingId === keyword.id ? (
                  <div className="space-y-4">
                    {/* Edit Keyword Input */}
                    <Input
                      value={editKeyword}
                      onChange={(e) => setEditKeyword(e.target.value)}
                      className="h-10"
                    />

                    {/* Edit Platforms */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Platforms
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {PLATFORM_OPTIONS.map((platform) => {
                          const Icon = PLATFORM_ICONS[platform];
                          const isSelected = editPlatforms.includes(platform);
                          return (
                            <button
                              key={platform}
                              onClick={() => toggleEditPlatform(platform)}
                              className={cn(
                                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border-2",
                                isSelected
                                  ? "bg-gray-900 text-white border-gray-900"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                              )}
                            >
                              <Icon size={14} className={!isSelected ? PLATFORM_COLORS[platform] : ""} />
                              {platform}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Edit Excluded Languages */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Excluded Languages
                      </label>
                      <Select
                        onValueChange={(value) => {
                          if (!editExcludedLanguages.includes(value)) {
                            setEditExcludedLanguages([...editExcludedLanguages, value]);
                          }
                        }}
                      >
                        <SelectTrigger className="h-9 border-gray-200">
                          <SelectValue placeholder="Select languages to exclude..." />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGE_OPTIONS.filter(lang => !editExcludedLanguages.includes(lang)).map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {editExcludedLanguages.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {editExcludedLanguages.map((lang) => (
                            <Badge
                              key={lang}
                              variant="secondary"
                              className="bg-red-50 text-red-700 border-red-200 text-xs pl-2 pr-1 py-1"
                            >
                              {lang}
                              <button
                                onClick={() => setEditExcludedLanguages(editExcludedLanguages.filter((l) => l !== lang))}
                                className="ml-1 hover:text-red-900"
                              >
                                <X size={12} />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Edit Excluded Keywords */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Excluded Keywords
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add keyword to exclude..."
                          value={editExcludedKeywordInput}
                          onChange={(e) => setEditExcludedKeywordInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addEditExcludedKeyword();
                            }
                          }}
                          className="h-9 border-gray-200"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={addEditExcludedKeyword}
                          disabled={!editExcludedKeywordInput.trim()}
                          className="px-3"
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                      {editExcludedKeywords.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {editExcludedKeywords.map((kw) => (
                            <Badge
                              key={kw}
                              variant="secondary"
                              className="bg-red-50 text-red-700 border-red-200 text-xs pl-2 pr-1 py-1"
                            >
                              {kw}
                              <button
                                onClick={() => removeEditExcludedKeyword(kw)}
                                className="ml-1 hover:text-red-900"
                              >
                                <X size={12} />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Save/Cancel Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => saveEdit(keyword.id)}
                        className="flex-1 bg-gray-900 hover:bg-gray-800"
                      >
                        <Check size={14} className="mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Keyword Name */}
                      <p className="text-[15px] font-semibold text-gray-900">{keyword.keyword}</p>

                      {/* Platforms */}
                      <div className="flex flex-wrap gap-1.5">
                        {keyword.platforms.map((platform) => {
                          const Icon = PLATFORM_ICONS[platform];
                          return (
                            <Badge
                              key={platform}
                              variant="secondary"
                              className="text-xs font-medium border bg-white hover:bg-gray-50 border-gray-200 flex items-center gap-1.5 transition-colors"
                            >
                              <Icon size={13} className={PLATFORM_COLORS[platform]} />
                              {platform}
                            </Badge>
                          );
                        })}
                      </div>

                      {/* Excluded Languages & Keywords */}
                      {((keyword.excludedLanguages && keyword.excludedLanguages.length > 0) ||
                        (keyword.excludedKeywords && keyword.excludedKeywords.length > 0)) && (
                        <div className="space-y-2 pt-1">
                          {keyword.excludedLanguages && keyword.excludedLanguages.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                Excluded Languages:
                              </span>
                              {keyword.excludedLanguages.map((lang) => (
                                <Badge
                                  key={lang}
                                  variant="secondary"
                                  className="bg-red-50 text-red-700 border-red-200 text-[10px] font-medium"
                                >
                                  {lang}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {keyword.excludedKeywords && keyword.excludedKeywords.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                Excluded Keywords:
                              </span>
                              {keyword.excludedKeywords.map((kw) => (
                                <Badge
                                  key={kw}
                                  variant="secondary"
                                  className="bg-red-50 text-red-700 border-red-200 text-[10px] font-medium"
                                >
                                  {kw}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEdit(keyword)}
                        className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(keyword.id)}
                        className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CompetitorNames() {
  const [competitors, setCompetitors] = useState<string[]>([
    "Competitor A",
    "Competitor B",
    "Competitor C",
  ]);
  const [newCompetitor, setNewCompetitor] = useState("");

  const handleAdd = () => {
    if (newCompetitor.trim()) {
      setCompetitors([...competitors, newCompetitor.trim()]);
      setNewCompetitor("");
    }
  };

  const handleDelete = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Competitor Names</h2>
        <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">
          {competitors.length} competitors
        </Badge>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex gap-2">
          <Input
            placeholder="Enter competitor name..."
            value={newCompetitor}
            onChange={(e) => setNewCompetitor(e.target.value)}
            className="flex-1 h-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <Button
            onClick={handleAdd}
            disabled={!newCompetitor.trim()}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Plus size={16} className="mr-1" />
            Add
          </Button>
        </div>
        {competitors.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {competitors.map((competitor, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 rounded-lg px-3 py-2 group hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium">{competitor}</span>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExcludedWords() {
  const [excludedWords, setExcludedWords] = useState<string[]>([
    "spam",
    "advertisement",
    "promotion",
  ]);
  const [newWord, setNewWord] = useState("");

  const handleAdd = () => {
    if (newWord.trim()) {
      setExcludedWords([...excludedWords, newWord.trim().toLowerCase()]);
      setNewWord("");
    }
  };

  const handleDelete = (index: number) => {
    setExcludedWords(excludedWords.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Excluded Words</h2>
        <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">
          {excludedWords.length} excluded
        </Badge>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex gap-2">
          <Input
            placeholder="Enter word to exclude..."
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="flex-1 h-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <Button
            onClick={handleAdd}
            disabled={!newWord.trim()}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Plus size={16} className="mr-1" />
            Add
          </Button>
        </div>
        {excludedWords.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {excludedWords.map((word, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg px-3 py-2 group hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium">{word}</span>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default function MonitoringProfile() {
  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <Navbar />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="0" y="0" width="5" height="5" rx="1" fill="url(#grad1)" />
              <rect x="7" y="0" width="5" height="5" rx="1" fill="url(#grad2)" />
              <rect x="0" y="7" width="5" height="5" rx="1" fill="url(#grad3)" />
              <rect x="7" y="7" width="5" height="5" rx="1" fill="url(#grad4)" />
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="5" y2="5">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
                <linearGradient id="grad2" x1="7" y1="0" x2="12" y2="5">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
                <linearGradient id="grad3" x1="0" y1="7" x2="5" y2="12">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="grad4" x1="7" y1="7" x2="12" y2="12">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>
            </svg>
            Workspace
          </span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 font-semibold">Monitoring Profile</span>
        </div>

        {/* Page header */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[48px] sm:text-[56px] lg:text-[64px] leading-[0.95] font-normal text-[#111827] tracking-[-0.03em]">
              Monitoring Profile
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Configure what to monitor across the web and social platforms
            </p>
          </div>
        </div>

        {/* Keyword Setup */}
        <KeywordSetup />

        {/* Competitor Names */}
        <CompetitorNames />

        {/* Excluded Words */}
        <ExcludedWords />

        {/* Footer */}
        <footer className="text-center py-4">
          <p className="text-[11px] text-gray-400 font-medium tracking-widest uppercase">
            © 2026 SocialRumr AI Engine • V4.2.0-Stable
          </p>
        </footer>
      </div>
    </div>
  );
}

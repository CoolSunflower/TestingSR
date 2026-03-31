import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, Edit2, Check, Twitter, Facebook, Linkedin, MessageCircle, Globe, ChevronDown, Bell, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select";

type Platform = "Reddit" | "X" | "Facebook" | "LinkedIn" | "Web Alerts";

type Keyword = {
  id: number;
  keyword: string;
  platforms: Platform[];
  excludedLanguages?: string[];
  excludedKeywords?: string[];
  alertConfigs?: AlertConfig[];
};

// Alert Types
type ScopeMode = "all-keywords" | "specific-keywords";

type TriggerType = 
  | "volume-spike" 
  | "sentiment-spike" 
  | "competitor-overtake"
  | "share-of-voice-drop"
  | "competitor-growth";

const ALL_TRIGGERS: TriggerType[] = [
  "volume-spike",
  "sentiment-spike",
  "competitor-overtake",
  "share-of-voice-drop",
  "competitor-growth"
];

const getTriggerDisplayText = (trigger: TriggerType): string => {
  const map: Record<TriggerType, string> = {
    "volume-spike": "Spike in mentions",
    "sentiment-spike": "Spike in negative sentiment",
    "competitor-overtake": "Competitors overtake me",
    "share-of-voice-drop": "My share of voice drops",
    "competitor-growth": "Competitors grow faster than me",
  };
  return map[trigger];
};

type Sensitivity = "low" | "medium" | "high";

type AlertConfig = {
  id: string;
  trigger: TriggerType;
  sensitivity: Sensitivity;
  inAppNotifications: boolean;
  emailNotifications: boolean;
};

type Alert = {
  id: number;
  scope: ScopeMode;
  selectedKeywords: string[]; // keyword names when scope is specific
  trigger: TriggerType;
  sensitivity: Sensitivity;
  inAppNotifications: boolean;
  emailNotifications: boolean;
  name: string; // auto-generated
};

const PLATFORM_OPTIONS: Platform[] = ["Reddit", "X", "Facebook", "LinkedIn", "Web Alerts"];

const LANGUAGE_OPTIONS = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese",
  "Russian", "Japanese", "Chinese", "Korean", "Arabic", "Hindi"
];

// Alert Name Generator
function generateAlertName(
  scope: ScopeMode,
  selectedKeywords: string[],
  trigger: TriggerType
): string {
  const scopeText = scope === "all-keywords" 
    ? "across all keywords" 
    : selectedKeywords.length === 1
    ? `for ${selectedKeywords[0]}`
    : `for ${selectedKeywords.slice(0, 2).join(" + ")}${selectedKeywords.length > 2 ? ` +${selectedKeywords.length - 2} more` : ""}`;

  const triggerText: Record<TriggerType, string> = {
    "volume-spike": "Spike in mentions",
    "sentiment-spike": "Spike in negative sentiment",
    "competitor-overtake": "Competitors overtook you",
    "share-of-voice-drop": "Share of voice drop",
    "competitor-growth": "Competitors growing faster"
  };

  return `${triggerText[trigger]} ${scopeText}`;
}

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

function KeywordSetup({ 
  keywords, 
  setKeywords, 
  alerts, 
  setAlerts 
}: { 
  keywords: Keyword[]; 
  setKeywords: React.Dispatch<React.SetStateAction<Keyword[]>>; 
  alerts: Alert[]; 
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>; 
}) {
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

  // Alert configuration state
  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const [alertTriggers, setAlertTriggers] = useState<TriggerType[]>([]);
  const [alertSensitivity, setAlertSensitivity] = useState<Sensitivity>("medium");
  const [alertInAppNotifications, setAlertInAppNotifications] = useState(true);
  const [alertEmailNotifications, setAlertEmailNotifications] = useState(true);
  const [savedAlertConfigs, setSavedAlertConfigs] = useState<AlertConfig[]>([]);

  // Edit mode alert configuration state
  const [editShowAlertMenu, setEditShowAlertMenu] = useState(false);
  const [editAlertTriggers, setEditAlertTriggers] = useState<TriggerType[]>([]);
  const [editAlertSensitivity, setEditAlertSensitivity] = useState<Sensitivity>("medium");
  const [editAlertInAppNotifications, setEditAlertInAppNotifications] = useState(true);
  const [editAlertEmailNotifications, setEditAlertEmailNotifications] = useState(true);
  const [editSavedAlertConfigs, setEditSavedAlertConfigs] = useState<AlertConfig[]>([]);

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

  // Alert configuration helper functions
  const toggleAlertTrigger = (trigger: TriggerType) => {
    setAlertTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]
    );
  };

  const toggleEditAlertTrigger = (trigger: TriggerType) => {
    setEditAlertTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]
    );
  };

  const saveAlertConfig = () => {
    if (alertTriggers.length === 0) return;

    const newConfigs: AlertConfig[] = alertTriggers.map(trigger => ({
      id: `${Date.now()}-${trigger}-${Math.random()}`,
      trigger,
      sensitivity: alertSensitivity,
      inAppNotifications: alertInAppNotifications,
      emailNotifications: alertEmailNotifications,
    }));

    setSavedAlertConfigs([...savedAlertConfigs, ...newConfigs]);
    
    // Reset alert form
    setAlertTriggers([]);
    setAlertSensitivity("medium");
    setAlertInAppNotifications(true);
    setAlertEmailNotifications(true);
    setShowAlertMenu(false);
  };

  const saveEditAlertConfig = () => {
    if (editAlertTriggers.length === 0) return;

    const newConfigs: AlertConfig[] = editAlertTriggers.map(trigger => ({
      id: `${Date.now()}-${trigger}-${Math.random()}`,
      trigger,
      sensitivity: editAlertSensitivity,
      inAppNotifications: editAlertInAppNotifications,
      emailNotifications: editAlertEmailNotifications,
    }));

    setEditSavedAlertConfigs([...editSavedAlertConfigs, ...newConfigs]);
    
    // Reset alert form
    setEditAlertTriggers([]);
    setEditAlertSensitivity("medium");
    setEditAlertInAppNotifications(true);
    setEditAlertEmailNotifications(true);
    setEditShowAlertMenu(false);
  };

  const removeAlertConfig = (configId: string) => {
    setSavedAlertConfigs(savedAlertConfigs.filter(c => c.id !== configId));
  };

  const removeEditAlertConfig = (configId: string) => {
    setEditSavedAlertConfigs(editSavedAlertConfigs.filter(c => c.id !== configId));
  };

  const handleAdd = () => {
    if (newKeyword.trim() && selectedPlatforms.length > 0) {
      const newKeywordObj: Keyword = {
        id: Date.now(),
        keyword: newKeyword.trim(),
        platforms: selectedPlatforms,
        excludedLanguages,
        excludedKeywords,
        alertConfigs: savedAlertConfigs.length > 0 ? savedAlertConfigs : undefined,
      };

      setKeywords([...keywords, newKeywordObj]);

      // Create alerts for this keyword if alertConfigs exist
      if (savedAlertConfigs.length > 0) {
        const newAlerts: Alert[] = savedAlertConfigs.map(config => ({
          id: Date.now() + Math.random(),
          scope: "specific-keywords" as ScopeMode,
          selectedKeywords: [newKeyword.trim()],
          trigger: config.trigger,
          sensitivity: config.sensitivity,
          inAppNotifications: config.inAppNotifications,
          emailNotifications: config.emailNotifications,
          name: generateAlertName("specific-keywords", [newKeyword.trim()], config.trigger),
        }));
        setAlerts([...alerts, ...newAlerts]);
      }

      // Reset form
      setNewKeyword("");
      setSelectedPlatforms([]);
      setExcludedLanguages([]);
      setExcludedKeywords([]);
      setExcludedKeywordInput("");
      setSavedAlertConfigs([]);
      setShowAlertMenu(false);
    }
  };

  const handleDelete = (id: number) => {
    const keywordToDelete = keywords.find(k => k.id === id);
    if (keywordToDelete) {
      // Remove alerts that reference this keyword
      setAlerts(alerts.filter(alert => {
        if (alert.scope === "specific-keywords") {
          // Remove the keyword from alert's selectedKeywords
          const remainingKeywords = alert.selectedKeywords.filter(kw => kw !== keywordToDelete.keyword);
          // If no keywords left, delete the alert
          return remainingKeywords.length > 0;
        }
        // Keep all-keywords scope alerts
        return true;
      }).map(alert => {
        // Update selectedKeywords for remaining alerts
        if (alert.scope === "specific-keywords" && alert.selectedKeywords.includes(keywordToDelete.keyword)) {
          return {
            ...alert,
            selectedKeywords: alert.selectedKeywords.filter(kw => kw !== keywordToDelete.keyword),
            name: generateAlertName(alert.scope, alert.selectedKeywords.filter(kw => kw !== keywordToDelete.keyword), alert.trigger),
          };
        }
        return alert;
      }));
    }
    
    // Delete the keyword
    setKeywords(keywords.filter((k) => k.id !== id));
  };

  const startEdit = (keyword: Keyword) => {
    setEditingId(keyword.id);
    setEditKeyword(keyword.keyword);
    setEditPlatforms(keyword.platforms);
    setEditExcludedLanguages(keyword.excludedLanguages || []);
    setEditExcludedKeywords(keyword.excludedKeywords || []);
    setEditExcludedKeywordInput("");
    setEditSavedAlertConfigs(keyword.alertConfigs || []);
  };

  const saveEdit = (id: number) => {
    if (editKeyword.trim() && editPlatforms.length > 0) {
      const oldKeyword = keywords.find(k => k.id === id);
      const oldKeywordName = oldKeyword?.keyword || "";

      // Update keyword
      setKeywords(
        keywords.map((k) =>
          k.id === id
            ? {
                ...k,
                keyword: editKeyword.trim(),
                platforms: editPlatforms,
                excludedLanguages: editExcludedLanguages,
                excludedKeywords: editExcludedKeywords,
                alertConfigs: editSavedAlertConfigs.length > 0 ? editSavedAlertConfigs : undefined,
              }
            : k
        )
      );

      // Delete old alerts associated with this keyword
      const updatedAlerts = alerts.filter(alert => {
        if (alert.scope === "specific-keywords" && alert.selectedKeywords.includes(oldKeywordName)) {
          return false;
        }
        return true;
      });

      // Create new alerts if alertConfigs exist
      if (editSavedAlertConfigs.length > 0) {
        const newAlerts: Alert[] = editSavedAlertConfigs.map(config => ({
          id: Date.now() + Math.random(),
          scope: "specific-keywords" as ScopeMode,
          selectedKeywords: [editKeyword.trim()],
          trigger: config.trigger,
          sensitivity: config.sensitivity,
          inAppNotifications: config.inAppNotifications,
          emailNotifications: config.emailNotifications,
          name: generateAlertName("specific-keywords", [editKeyword.trim()], config.trigger),
        }));
        setAlerts([...updatedAlerts, ...newAlerts]);
      } else {
        setAlerts(updatedAlerts);
      }

      // Reset edit state
      setEditingId(null);
      setEditKeyword("");
      setEditPlatforms([]);
      setEditExcludedLanguages([]);
      setEditExcludedKeywords([]);
      setEditExcludedKeywordInput("");
      setEditSavedAlertConfigs([]);
      setEditShowAlertMenu(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditKeyword("");
    setEditPlatforms([]);
    setEditExcludedLanguages([]);
    setEditExcludedKeywords([]);
    setEditExcludedKeywordInput("");
    setEditSavedAlertConfigs([]);
    setEditShowAlertMenu(false);
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
            <div className="overflow-visible">
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Advanced Filters (Optional)
                  </label>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
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
                        className="h-10 px-3 hover:bg-gray-100 transition-all active:scale-95"
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

                  {/* Alert Setup */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600">
                      Alert Setup
                    </label>

                    <div className="relative">
                      <button
                        onClick={() => setShowAlertMenu(!showAlertMenu)}
                        className={cn(
                          "h-10 w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-300",
                          showAlertMenu
                            ? "bg-gray-900 text-white border-gray-900 shadow-md"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <Bell size={14} />
                          Create Alert
                        </span>
                        <ChevronDown size={16} className={cn("transition-transform", showAlertMenu && "rotate-180")} />
                      </button>

                      {/* Alert Configuration Menu */}
                      {showAlertMenu && (
                        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                          {/* Trigger Selection */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Trigger Type
                            </label>
                            <div className="space-y-2">
                              {ALL_TRIGGERS.map((trigger) => (
                                <label key={trigger} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                                  <Checkbox
                                    checked={alertTriggers.includes(trigger)}
                                    onCheckedChange={() => toggleAlertTrigger(trigger)}
                                  />
                                  <span className="text-sm text-gray-700">{getTriggerDisplayText(trigger)}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Sensitivity */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Sensitivity
                            </label>
                            <div className="flex gap-2">
                              {(["low", "medium", "high"] as Sensitivity[]).map((level) => (
                                <button
                                  key={level}
                                  onClick={() => setAlertSensitivity(level)}
                                  className={cn(
                                    "flex-1 px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-300 border-2",
                                    alertSensitivity === level
                                      ? "bg-gray-900 text-white border-gray-900"
                                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                  )}
                                >
                                  {level}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Delivery Options */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Notify Via
                            </label>
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                  checked={alertInAppNotifications}
                                  onCheckedChange={(checked) => setAlertInAppNotifications(!!checked)}
                                />
                                <Bell size={14} className="text-gray-500" />
                                <span className="text-sm text-gray-700">In-app notifications</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                  checked={alertEmailNotifications}
                                  onCheckedChange={(checked) => setAlertEmailNotifications(!!checked)}
                                />
                                <Mail size={14} className="text-gray-500" />
                                <span className="text-sm text-gray-700">Email notifications</span>
                              </label>
                            </div>
                          </div>

                          {/* Save Button */}
                          <Button
                            onClick={saveAlertConfig}
                            disabled={alertTriggers.length === 0}
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white transition-all active:scale-95"
                          >
                            Save Alert Configuration
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Saved Alert Configs as Badges */}
                    {savedAlertConfigs.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 animate-in fade-in duration-300">
                        {savedAlertConfigs.map((config) => (
                          <Badge
                            key={config.id}
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 border-blue-200 text-xs pl-2 pr-1 py-1 hover:bg-blue-100 transition-colors"
                          >
                            {getTriggerDisplayText(config.trigger)} • {config.sensitivity}
                            <button
                              onClick={() => removeAlertConfig(config.id)}
                              className="ml-1 hover:text-blue-900 transition-colors"
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

                    {/* Edit Alert Setup */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Alert Setup
                      </label>

                      <div className="relative">
                        <button
                          onClick={() => setEditShowAlertMenu(!editShowAlertMenu)}
                          className={cn(
                            "h-10 w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-300",
                            editShowAlertMenu
                              ? "bg-gray-900 text-white border-gray-900 shadow-md"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <Bell size={14} />
                            Create Alert
                          </span>
                          <ChevronDown size={16} className={cn("transition-transform", editShowAlertMenu && "rotate-180")} />
                        </button>

                        {/* Edit Alert Configuration Menu */}
                        {editShowAlertMenu && (
                          // <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="mt-3 w-full bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                              {/* Trigger Selection */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Trigger Type
                              </label>
                              <div className="space-y-2">
                                {ALL_TRIGGERS.map((trigger) => (
                                  <label key={trigger} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                                    <Checkbox
                                      checked={editAlertTriggers.includes(trigger)}
                                      onCheckedChange={() => toggleEditAlertTrigger(trigger)}
                                    />
                                    <span className="text-sm text-gray-700">{getTriggerDisplayText(trigger)}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Sensitivity */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Sensitivity
                              </label>
                              <div className="flex gap-2">
                                {(["low", "medium", "high"] as Sensitivity[]).map((level) => (
                                  <button
                                    key={level}
                                    onClick={() => setEditAlertSensitivity(level)}
                                    className={cn(
                                      "flex-1 px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-300 border-2",
                                      editAlertSensitivity === level
                                        ? "bg-gray-900 text-white border-gray-900"
                                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                    )}
                                  >
                                    {level}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Delivery Options */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Notify Via
                              </label>
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <Checkbox
                                    checked={editAlertInAppNotifications}
                                    onCheckedChange={(checked) => setEditAlertInAppNotifications(!!checked)}
                                  />
                                  <Bell size={14} className="text-gray-500" />
                                  <span className="text-sm text-gray-700">In-app notifications</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <Checkbox
                                    checked={editAlertEmailNotifications}
                                    onCheckedChange={(checked) => setEditAlertEmailNotifications(!!checked)}
                                  />
                                  <Mail size={14} className="text-gray-500" />
                                  <span className="text-sm text-gray-700">Email notifications</span>
                                </label>
                              </div>
                            </div>

                            {/* Save Button */}
                            <Button
                              onClick={saveEditAlertConfig}
                              disabled={editAlertTriggers.length === 0}
                              className="w-full bg-gray-900 hover:bg-gray-800 text-white transition-all active:scale-95"
                            >
                              Save Alert Configuration
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Saved Edit Alert Configs as Badges */}
                      {editSavedAlertConfigs.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 animate-in fade-in duration-300">
                          {editSavedAlertConfigs.map((config) => (
                            <Badge
                              key={config.id}
                              variant="secondary"
                              className="bg-blue-50 text-blue-700 border-blue-200 text-xs pl-2 pr-1 py-1 hover:bg-blue-100 transition-colors"
                            >
                              {getTriggerDisplayText(config.trigger)} • {config.sensitivity}
                              <button
                                onClick={() => removeEditAlertConfig(config.id)}
                                className="ml-1 hover:text-blue-900 transition-colors"
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

function AlertsSetup({ 
  keywords, 
  alerts, 
  setAlerts 
}: { 
  keywords: Keyword[]; 
  alerts: Alert[]; 
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>; 
}) {
  // Remove local alerts state since it's now passed as prop
  // const [alerts, setAlerts] = useState<Alert[]>([]);

  // Creation form state
  const [scope, setScope] = useState<ScopeMode | "">("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  // const [trigger, setTrigger] = useState<TriggerType | "">("");
  const [triggers, setTriggers] = useState<TriggerType[]>([]);
  const [sensitivity, setSensitivity] = useState<Sensitivity>("medium");
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editScope, setEditScope] = useState<ScopeMode | "">("");
  const [editSelectedKeywords, setEditSelectedKeywords] = useState<string[]>([]);
  const [editTrigger, setEditTrigger] = useState<TriggerType | "">("");
  const [editSensitivity, setEditSensitivity] = useState<Sensitivity>("medium");
  const [editInAppNotifications, setEditInAppNotifications] = useState(true);
  const [editEmailNotifications, setEditEmailNotifications] = useState(true);

  const toggleTrigger = (value: TriggerType) => {
    setTriggers((prev) =>
      prev.includes(value)
        ? prev.filter((t) => t !== value)
        : [...prev, value]
    );
  };

  // Validation
  const isFormValid = () => {
    if (!triggers.length) return false;
    if (scope === "specific-keywords" && selectedKeywords.length === 0) return false;
    return true;
  };

  const isEditFormValid = () => {
    if (!editTrigger) return false;
    if (editScope === "specific-keywords" && editSelectedKeywords.length === 0) return false;
    return true;
  };

  // Create Alert
  const handleCreateAlert = () => {
    if (!isFormValid() || !scope) return;

    const newAlerts: Alert[] = triggers.map(trigger => ({
      id: Date.now() + Math.random(),
      scope,
      selectedKeywords: scope === "specific-keywords" ? selectedKeywords : [],
      trigger,
      sensitivity,
      inAppNotifications,
      emailNotifications,
      name: generateAlertName(scope, selectedKeywords, trigger),
    }));

    setAlerts([...alerts, ...newAlerts]);

    // Reset form
    setScope("");
    setSelectedKeywords([]);
    setTriggers([]);
    setSensitivity("medium");
    setInAppNotifications(true);
    setEmailNotifications(true);
  };

  // Edit Alert
  const startEdit = (alert: Alert) => {
    setEditingId(alert.id);
    setEditScope(alert.scope);
    setEditSelectedKeywords(alert.selectedKeywords);
    setEditTrigger(alert.trigger);
    setEditSensitivity(alert.sensitivity);
    setEditInAppNotifications(alert.inAppNotifications);
    setEditEmailNotifications(alert.emailNotifications);
  };

  const saveEdit = (id: number) => {
    if (!isEditFormValid() || !editScope || !editTrigger) return;

    setAlerts(
      alerts.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              scope: editScope,
              selectedKeywords: editScope === "specific-keywords" ? editSelectedKeywords : [],
              trigger: editTrigger,
              sensitivity: editSensitivity,
              inAppNotifications: editInAppNotifications,
              emailNotifications: editEmailNotifications,
              name: generateAlertName(editScope, editSelectedKeywords, editTrigger),
            }
          : alert
      )
    );

    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditScope("");
    setEditSelectedKeywords([]);
    setEditTrigger("");
    setEditSensitivity("medium");
    setEditInAppNotifications(true);
    setEditEmailNotifications(true);
  };

  // Delete Alert
  const handleDelete = (id: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  // Helper: Convert keywords to MultiSelect options
  const keywordOptions: MultiSelectOption[] = keywords.map((kw) => ({
    label: kw.keyword,
    value: kw.keyword,
  }));

  // Helper: Get trigger display text
  const getTriggerDisplayText = (triggerType: TriggerType): string => {
    const triggerMap: Record<TriggerType, string> = {
      "volume-spike": "Spike in mentions",
      "sentiment-spike": "Spike in negative sentiment",
      "competitor-overtake": "Competitors overtake me",
      "share-of-voice-drop": "My share of voice drops",
      "competitor-growth": "Competitors grow faster than me",
    };
    return triggerMap[triggerType];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Alerts</h2>
        <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">
          {alerts.length} configured
        </Badge>
      </div>

      {/* Add New Alert - Progressive Flow */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-visible transition-all duration-300">
        <div className="p-4">
          {/* Step 1: Scope Selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Alert Scope
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (scope === "all-keywords") {
                    setScope("");
                  } else {
                    setScope("all-keywords");
                    setSelectedKeywords([]);
                  }
                }}
                className={cn(
                  "flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 border-2",
                  scope === "all-keywords"
                    ? "bg-gray-900 text-white border-gray-900 shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-sm"
                )}
              >
                All Keywords
                {scope === "all-keywords" && (
                  <Check size={14} className="inline-block ml-2 animate-in zoom-in duration-200" />
                )}
              </button>
              <button
                onClick={() => {
                  if (scope === "specific-keywords") {
                    setScope("");
                    setSelectedKeywords([]);
                  } else {
                    setScope("specific-keywords");
                  }
                }}
                className={cn(
                  "flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 border-2",
                  scope === "specific-keywords"
                    ? "bg-gray-900 text-white border-gray-900 shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-sm"
                )}
              >
                Specific Keywords
                {scope === "specific-keywords" && (
                  <Check size={14} className="inline-block ml-2 animate-in zoom-in duration-200" />
                )}
              </button>
            </div>
          </div>

          {/* Step 1b: Multi-Keyword Selection (if specific scope) */}
          <div
            className={cn(
              "grid transition-all duration-500 ease-out",
              scope === "specific-keywords"
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Select Keywords
                </label>
                <MultiSelect
                  options={keywordOptions}
                  selected={selectedKeywords}
                  onChange={setSelectedKeywords}
                  placeholder="Choose keywords to monitor..."
                  className="h-11"
                />
                {selectedKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedKeywords.map((kw) => (
                      <Badge
                        key={kw}
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 border-blue-200 text-xs pl-2 pr-1 py-1"
                      >
                        {kw}
                        <button
                          onClick={() =>
                            setSelectedKeywords(selectedKeywords.filter((k) => k !== kw))
                          }
                          className="ml-1 hover:text-blue-900"
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

          {/* Step 2: Trigger Selection */}
          <div
            className={cn(
              "grid transition-all duration-500 ease-out",
              scope ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Trigger Type
                  </label>                  
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  <button
                    onClick={() =>
                      setTriggers(
                        triggers.length === ALL_TRIGGERS.length ? [] : ALL_TRIGGERS
                      )
                    }
                    className="text-xs text-gray-600 hover:underline"
                  >
                    {triggers.length === ALL_TRIGGERS.length ? "Clear All" : "Select All"}
                  </button>                
                </div>
                <div className="space-y-3">
                  {/* Primary Triggers - 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <button
                      // onClick={() => setTrigger(trigger === "volume-spike" ? "" : "volume-spike")}
                      onClick={() => toggleTrigger("volume-spike")}
                      className={cn(
                        "px-4 py-3 rounded-lg text-sm font-medium text-center transition-all duration-300 border-2",
                        triggers.includes("volume-spike")
                          ? "bg-gray-900 text-white border-gray-900 shadow-md"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-sm"
                      )}
                    >
                      Spike in mentions
                    </button>
                    <button
                      // onClick={() => setTrigger(trigger === "sentiment-spike" ? "" : "sentiment-spike")}
                      onClick={() => toggleTrigger("sentiment-spike")}
                      className={cn(
                        "px-4 py-3 rounded-lg text-sm font-medium text-center transition-all duration-300 border-2",
                        triggers.includes("sentiment-spike")
                          ? "bg-gray-900 text-white border-gray-900 shadow-md"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-sm"
                      )}
                    >
                      Spike in negative sentiment
                    </button>
                    <button
                      onClick={() => toggleTrigger("competitor-overtake")}
                      className={cn(
                        "px-4 py-3 rounded-lg text-sm font-medium text-center transition-all duration-300 border-2",
                        triggers.includes("competitor-overtake")
                          ? "bg-gray-900 text-white border-gray-900 shadow-md"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-sm"
                      )}
                    >
                      Competitors overtake me
                    </button>
                    <button
                      onClick={() => toggleTrigger("share-of-voice-drop")}
                      className={cn(
                        "px-4 py-3 rounded-lg text-sm font-medium text-center transition-all duration-300 border-2",
                        triggers.includes("share-of-voice-drop")
                          ? "bg-gray-900 text-white border-gray-900 shadow-md"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-sm"
                      )}
                    >
                      My share of voice drops
                    </button>
                    <button
                      onClick={() => toggleTrigger("competitor-growth")}
                      className={cn(
                        "px-4 py-3 rounded-lg text-sm font-medium text-center transition-all duration-300 border-2",
                        triggers.includes("competitor-growth")
                          ? "bg-gray-900 text-white border-gray-900 shadow-md"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-sm"
                      )}
                    >
                      Competitors grow faster than me
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 & 4: Sensitivity and Delivery */}
          <div
            className={cn(
              "grid transition-all duration-500 ease-out",
              triggers.length ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="space-y-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Sensitivity &amp; Delivery
                  </label>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Sensitivity */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Sensitivity
                    </label>
                    <div className="flex gap-2">
                      {(["low", "medium", "high"] as Sensitivity[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => setSensitivity(level)}
                          className={cn(
                            "flex-1 px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-300 border-2",
                            sensitivity === level
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                          )}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delivery */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Notify Via
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={inAppNotifications}
                          onCheckedChange={(checked) => setInAppNotifications(!!checked)}
                        />
                        <Bell size={14} className="text-gray-500" />
                        <span className="text-sm text-gray-700">In-app notifications</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={emailNotifications}
                          onCheckedChange={(checked) => setEmailNotifications(!!checked)}
                        />
                        <Mail size={14} className="text-gray-500" />
                        <span className="text-sm text-gray-700">Email notifications</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Create Button */}
                {isFormValid() && (
                  <Button
                    onClick={handleCreateAlert}
                    className="w-full bg-gray-900 mt-4 hover:bg-gray-800 text-white transition-all active:scale-95 shadow-sm hover:shadow-md animate-in fade-in slide-in-from-top-2 duration-300"
                  >
                    Create Alert
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert List */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <div className="p-4">
                {editingId === alert.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    {/* Edit Scope */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Alert Scope
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditScope("all-keywords");
                            setEditSelectedKeywords([]);
                          }}
                          className={cn(
                            "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border-2",
                            editScope === "all-keywords"
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                          )}
                        >
                          All Keywords
                        </button>
                        <button
                          onClick={() => setEditScope("specific-keywords")}
                          className={cn(
                            "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border-2",
                            editScope === "specific-keywords"
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                          )}
                        >
                          Specific Keywords
                        </button>
                      </div>
                    </div>

                    {/* Edit Keyword Selection */}
                    {editScope === "specific-keywords" && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Select Keywords
                        </label>
                        <MultiSelect
                          options={keywordOptions}
                          selected={editSelectedKeywords}
                          onChange={setEditSelectedKeywords}
                          placeholder="Choose keywords..."
                        />
                        {editSelectedKeywords.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {editSelectedKeywords.map((kw) => (
                              <Badge
                                key={kw}
                                variant="secondary"
                                className="bg-blue-50 text-blue-700 border-blue-200 text-xs pl-2 pr-1 py-1"
                              >
                                {kw}
                                <button
                                  onClick={() =>
                                    setEditSelectedKeywords(
                                      editSelectedKeywords.filter((k) => k !== kw)
                                    )
                                  }
                                  className="ml-1 hover:text-blue-900"
                                >
                                  <X size={12} />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Edit Trigger */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Trigger Type
                      </label>
                      <Select
                        value={editTrigger}
                        onValueChange={(value) => setEditTrigger(value as TriggerType)}
                      >
                        <SelectTrigger className="h-10 border-gray-200">
                          <SelectValue placeholder="Select trigger..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="volume-spike">Spike in mentions</SelectItem>
                          <SelectItem value="sentiment-spike">
                            Spike in negative sentiment
                          </SelectItem>
                          <SelectItem value="competitor-overtake">
                            Competitors overtake me
                          </SelectItem>
                          <SelectItem value="share-of-voice-drop">
                            My share of voice drops
                          </SelectItem>
                          <SelectItem value="competitor-growth">
                            Competitors grow faster than me
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Edit Sensitivity & Delivery */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Sensitivity
                        </label>
                        <div className="flex gap-2">
                          {(["low", "medium", "high"] as Sensitivity[]).map((level) => (
                            <button
                              key={level}
                              onClick={() => setEditSensitivity(level)}
                              className={cn(
                                "flex-1 px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all border-2",
                                editSensitivity === level
                                  ? "bg-gray-900 text-white border-gray-900"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                              )}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Notify Via
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={editInAppNotifications}
                              onCheckedChange={(checked) =>
                                setEditInAppNotifications(!!checked)
                              }
                            />
                            <Bell size={14} className="text-gray-500" />
                            <span className="text-sm text-gray-700">In-app</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={editEmailNotifications}
                              onCheckedChange={(checked) =>
                                setEditEmailNotifications(!!checked)
                              }
                            />
                            <Mail size={14} className="text-gray-500" />
                            <span className="text-sm text-gray-700">Email</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Save/Cancel */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveEdit(alert.id)}
                        disabled={!isEditFormValid()}
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
                  // Display Mode
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Alert Name */}
                      <p className="text-[15px] font-semibold text-gray-900">{alert.name}</p>

                      {/* Scope */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          Scope:
                        </span>
                        {alert.scope === "all-keywords" ? (
                          <Badge
                            variant="secondary"
                            className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] font-medium"
                          >
                            All Keywords
                          </Badge>
                        ) : (
                          <>
                            {alert.selectedKeywords.map((kw) => (
                              <Badge
                                key={kw}
                                variant="secondary"
                                className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-medium"
                              >
                                {kw}
                              </Badge>
                            ))}
                          </>
                        )}
                      </div>

                      {/* Trigger & Sensitivity */}
                      <div className="flex items-center gap-3 flex-wrap text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-500">Trigger:</span>
                          <span>{getTriggerDisplayText(alert.trigger)}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-500">Sensitivity:</span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px] font-medium capitalize",
                              alert.sensitivity === "high" &&
                                "bg-red-50 text-red-700 border-red-200",
                              alert.sensitivity === "medium" &&
                                "bg-yellow-50 text-yellow-700 border-yellow-200",
                              alert.sensitivity === "low" &&
                                "bg-green-50 text-green-700 border-green-200"
                            )}
                          >
                            {alert.sensitivity}
                          </Badge>
                        </div>
                      </div>

                      {/* Delivery */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          Delivery:
                        </span>
                        {alert.inAppNotifications && (
                          <Badge
                            variant="secondary"
                            className="bg-gray-50 text-gray-700 border-gray-200 text-[10px] font-medium flex items-center gap-1"
                          >
                            <Bell size={10} />
                            In-app
                          </Badge>
                        )}
                        {alert.emailNotifications && (
                          <Badge
                            variant="secondary"
                            className="bg-gray-50 text-gray-700 border-gray-200 text-[10px] font-medium flex items-center gap-1"
                          >
                            <Mail size={10} />
                            Email
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEdit(alert)}
                        className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(alert.id)}
                        className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MonitoringProfile() {
  // Shared keywords state for both KeywordSetup and AlertsSetup
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

  // Shared alerts state
  const [alerts, setAlerts] = useState<Alert[]>([]);

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
        <KeywordSetup keywords={keywords} setKeywords={setKeywords} alerts={alerts} setAlerts={setAlerts} />

        {/* Alerts */}
        <AlertsSetup keywords={keywords} alerts={alerts} setAlerts={setAlerts} />

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

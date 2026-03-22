const digestItems = [
  {
    type: "Reception Surge",
    dotColor: "bg-blue-400",
    title: "New UI launch success",
    description:
      "Sentiment is 85% positive regarding the new layout, primarily driven by influencers on X highlighting the minimalist design.",
  },
  {
    type: "Risk Detection",
    dotColor: "bg-red-400",
    title: "Login stability issues",
    description:
      'A 15% spike in negative mentions correlated with "session timeouts" over the last 4 hours on mobile platforms.',
  },
  {
    type: "Competitive Shift",
    dotColor: "bg-amber-400",
    title: "Pricing comparison overlap",
    description:
      "Discussions comparing our new enterprise tier to competitors have increased. Users are seeking more transparency.",
  },
];

export default function NarrativeDigest() {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z"
              fill="white"
              fillOpacity="0.9"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-white font-bold text-[17px]">
            24-Hour Narrative Digest
          </h2>
          <p className="text-gray-400 text-[13px] mt-0.5">
            AI-synthesized brand intelligence from 14.2k mentions
          </p>
        </div>
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {digestItems.map((item) => (
          <div key={item.type}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {item.type}
              </span>
            </div>
            <h3 className="text-white font-semibold text-[15px] mb-2">
              {item.title}
            </h3>
            <p className="text-gray-400 text-[13px] leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";

const QuickGuide = ({ showGuide, setShowGuide }) => {
  if (!showGuide) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-bold text-white">
            Quick Guide 🚀
          </h2>

          <button
            onClick={() => setShowGuide(false)}
            className="text-gray-400 hover:text-white transition text-xl"
          >
            ✕
          </button>

        </div>

        {/* ================= TRACKING RULES ================= */}
        <div className="mb-6">

          <h3 className="text-lg font-semibold text-blue-400 mb-3">
            Tracking Rules
          </h3>

          <ul className="space-y-3 text-gray-300 text-sm leading-relaxed">

            <li>
              ✅ Click on a box to mark a habit as completed.
            </li>

            <li>
              🔒 Future and past dates are locked for honest tracking.
            </li>

            <li>
              ⏰ If a habit is not completed before 11:58 PM,
              it will automatically be marked as missed.
            </li>

            <li>
              📅 You can track each habit only once per day.
            </li>

            <li>
              ❌ Hover on the X icon to delete habits.
            </li>

            <li>
              🎯 Trackiva is designed for real daily consistency,
              not fake streaks.
            </li>

          </ul>

        </div>

        {/* ================= TIPS ================= */}
        <div className="mb-6">

          <h3 className="text-lg font-semibold text-green-400 mb-3">
            Tips
          </h3>

          <ul className="space-y-3 text-gray-300 text-sm leading-relaxed">

            <li>
              🚀 Use the share button to invite friends.
            </li>

            <li>
              ⭐ If you seriously like Trackiva, you can add it to your
              Chrome bookmarks bar so you don’t need to search or login daily.
            </li>

            <li>
              📱 For the best mobile experience, use Trackiva in landscape mode.
            </li>

            <li>
              📲 You can also add Trackiva to your mobile home screen
              for a more app-like experience.
              <li>
  📲 On Android: Open Trackiva in Chrome → tap the
  3-dot menu → “Add to Home Screen”.

  <br />

  🍎 On iPhone: Open Trackiva in Safari → tap the
  Share icon → “Add to Home Screen”
  for an app-like experience.
</li>
            </li>

            <br />

            <li>
              🌅 Most users update their habits at the end of the day
              to maintain consistency.
            </li>

          </ul>

        </div>

        {/* ================= SUPPORT ================= */}
<div className="mb-2">

  <h3 className="text-lg font-semibold text-pink-400 mb-3">
    Support
  </h3>

  <ul className="space-y-3 text-gray-300 text-sm leading-relaxed">

    <li>
      🔐 Your habit data is private and securely stored.
    </li>

    <li>
      🛡️ Your data is safe. Trackiva is a completely safe application
      and we respect your privacy.
    </li>

    <li>
      💌 If you want any new features or changes in the app,
      feel free to message:
      <span className="text-blue-400 break-all">
        {" "}trackiva.app@gmail.com
      </span>
    </li>

  </ul>

</div>

        {/* Footer Button */}
        <button
          onClick={() => setShowGuide(false)}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600
                     transition-all duration-200
                     py-3 rounded-xl font-semibold
                     hover:scale-[1.01] active:scale-[0.99]"
        >
          Got it 
        </button>

      </div>

    </div>
  );
};

export default QuickGuide;
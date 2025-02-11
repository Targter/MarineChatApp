
import React from "react";
import { useSubscriptionPopup } from "../store/useStore";
import { Link } from "react-router-dom";

const UpgradeToPremium = () => {
  const { showUpgradePopup, setShowUpgradePopup } = useSubscriptionPopup();

  if (!showUpgradePopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
        <h3 className="text-lg font-semibold mb-4">Upgrade to Premium</h3>
        <p className="text-sm text-gray-600">
          You're currently on a trial plan. Upgrade to premium to unlock chat
          history and other exclusive features.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setShowUpgradePopup(false)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
          <Link
            to="/subscription" // ✅ Use Link instead of window.location.href
            className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            onClick={() => setShowUpgradePopup(false)} // ✅ Close popup when navigating
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpgradeToPremium;

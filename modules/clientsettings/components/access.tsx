// modules/clientsettings/components/access.tsx
import { useState } from 'react';

export default function AccessSettings() {
  const [accessLevel, setAccessLevel] = useState("user");

  const handleSave = () => {
    // Handle saving access settings
    console.log("Saved Access Settings", accessLevel);
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Access Settings</h2>
      <div>
        <label>Access Level</label>
        <select
          value={accessLevel}
          onChange={(e) => setAccessLevel(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
}

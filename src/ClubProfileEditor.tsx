import { useEffect, useRef, useState, type ReactNode } from "react";
import { generateProjectId, type ClubProfileV2, type ClubV2 } from "./project";

type ClubProfileEditorProps = {
  clubProfile: ClubProfileV2;
  onClubProfileChange: (profile: ClubProfileV2) => void;
  selectedClubId: string | null;
  onSelectedClubChange: (id: string) => void;
  onAnnounce: (message: string) => void;
  // Origin and target controls keep their state and geometry logic in HoleMap.
  children: ReactNode;
};

export function ClubProfileEditor({ clubProfile, onClubProfileChange, selectedClubId,
  onSelectedClubChange, onAnnounce, children }: ClubProfileEditorProps) {
  const [clubErrors, setClubErrors] = useState<Record<string, string>>({});
  const [deletedClub, setDeletedClub] = useState<{ club: ClubV2; index: number; selected: boolean } | null>(null);
  const clubUndoButton = useRef<HTMLButtonElement>(null);
  const [restoredClubId, setRestoredClubId] = useState<string | null>(null);
  const restoredClubInput = useRef<HTMLInputElement>(null);
  const expectedProfile = useRef(clubProfile);

  // A replacement project must not inherit undo history from the prior profile.
  useEffect(() => {
    if (expectedProfile.current !== clubProfile) setDeletedClub(null);
    expectedProfile.current = clubProfile;
  }, [clubProfile]);

  useEffect(() => {
    if (deletedClub) requestAnimationFrame(() => clubUndoButton.current?.focus());
  }, [deletedClub?.club.id]);

  function changeClubProfile(profile: ClubProfileV2) {
    expectedProfile.current = profile;
    onClubProfileChange(profile);
  }

  function addClub() {
    if (clubProfile.clubs.length >= 14) return;
    const used = new Set(clubProfile.clubs.map(({ label }) => label.normalize("NFC").toLowerCase()));
    let number = clubProfile.clubs.length + 1;
    while (used.has(`club ${number}`)) number += 1;
    const club: ClubV2 = { id: generateProjectId("club"), label: `Club ${number}`, carry: 150, longitudinal: 30, lateral: 20 };
    changeClubProfile({ clubs: [...clubProfile.clubs, club] });
    onSelectedClubChange(club.id);
    setDeletedClub((current) => current ? { ...current, selected: false } : null);
    onAnnounce(`${club.label} added to the club profile.`);
  }

  function updateClub(id: string, field: keyof Omit<ClubV2, "id">, raw: string): boolean {
    const key = `${id}-${field}`;
    let value: string | number;
    if (field === "label") {
      value = raw.trim().normalize("NFC");
      const comparison = value.toLowerCase();
      if (!value || [...value].length > 40 || clubProfile.clubs.some((club) => club.id !== id && club.label.normalize("NFC").toLowerCase() === comparison)) {
        const message = !value || [...value].length > 40
          ? "Use a club name from 1 to 40 characters."
          : "Club names must be unique, ignoring case.";
        setClubErrors((current) => ({ ...current, [key]: message }));
        onAnnounce(message);
        return false;
      }
    } else {
      value = Number(raw.trim());
      const maximum = field === "carry" ? 700 : 200;
      if (!/^\d+$/.test(raw.trim()) || !Number.isInteger(value) || value < 1 || value > maximum) {
        const message = `Use a whole-yard ${field} value from 1 to ${maximum}.`;
        setClubErrors((current) => ({ ...current, [key]: message }));
        onAnnounce(message);
        return false;
      }
    }
    changeClubProfile({ clubs: clubProfile.clubs.map((club) => club.id === id ? { ...club, [field]: value } : club) });
    setClubErrors((current) => ({ ...current, [key]: "" }));
    onAnnounce("Club profile updated.");
    return true;
  }

  return <>
    <div className="map-heading"><h4 id="dispersion-title">Club profile and dispersion</h4>
      <button className="secondary" type="button" disabled={clubProfile.clubs.length >= 14} onClick={addClub}>Add club</button></div>
    {deletedClub && <>
      <button ref={clubUndoButton} className="secondary" type="button" onClick={() => {
        const { club, index, selected } = deletedClub;
        if (clubProfile.clubs.length >= 14) {
          onAnnounce("Cannot restore club: the profile already has fourteen clubs. Existing clubs were kept.");
          return;
        }
        if (clubProfile.clubs.some((current) => current.id === club.id || current.label.normalize("NFC").toLowerCase() === club.label.normalize("NFC").toLowerCase())) {
          onAnnounce("Cannot restore club: its ID or name is already in use. Rename the conflicting club before retrying.");
          return;
        }
        changeClubProfile({ clubs: [...clubProfile.clubs.slice(0, index), club, ...clubProfile.clubs.slice(index)] });
        if (selected) onSelectedClubChange(club.id);
        setRestoredClubId(club.id);
        setDeletedClub(null);
        onAnnounce(`${club.label} restored to the club profile.`);
        requestAnimationFrame(() => restoredClubInput.current?.focus());
      }}>Undo delete club</button>
      <p className="hint">Restores the last deleted club at its original position. Current clubs are kept; fourteen-club and unique-name limits still apply.</p>
    </>}
    <p className="hint">Local dispersion guide only; it is not a shot recommendation or confidence estimate.</p>
    <p className="hint">The club profile is saved only in an exported project file. Loading a different course clears unsaved profile data.</p>
    {clubProfile.clubs.length === 0 ? <p>No clubs added.</p> : <ul className="club-list">
      {clubProfile.clubs.map((club) => <li key={club.id}>
        <label>Club name<input ref={club.id === restoredClubId ? restoredClubInput : undefined} key={`${club.id}-label-${club.label}`} defaultValue={club.label} maxLength={40}
          onBlur={(event) => { if (!updateClub(club.id, "label", event.currentTarget.value)) event.currentTarget.value = club.label; }}
          onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} /></label>
        {clubErrors[`${club.id}-label`] && <p className="warning">{clubErrors[`${club.id}-label`]}</p>}
        {(["carry", "longitudinal", "lateral"] as const).map((field) => <label key={field}>
          {field === "carry" ? "Carry yards" : field === "longitudinal" ? "Longitudinal full width yards" : "Lateral full width yards"}
          <input key={`${club.id}-${field}-${club[field]}`} inputMode="numeric" defaultValue={club[field]}
            onBlur={(event) => { if (!updateClub(club.id, field, event.currentTarget.value)) event.currentTarget.value = String(club[field]); }}
            onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} />
          {clubErrors[`${club.id}-${field}`] && <span className="warning">{clubErrors[`${club.id}-${field}`]}</span>}
        </label>)}
        <button className="secondary danger" type="button" onClick={() => {
          setDeletedClub({ club, index: clubProfile.clubs.findIndex(({ id }) => id === club.id), selected: selectedClubId === club.id });
          setClubErrors({});
          changeClubProfile({ clubs: clubProfile.clubs.filter(({ id }) => id !== club.id) });
          onAnnounce(`${club.label} deleted from the club profile.`);
        }}>Delete club</button>
      </li>)}
    </ul>}
    <div className="dispersion-controls">
      {children}
      <label>Dispersion club<select value={selectedClubId ?? ""} onChange={(event) => {
          onSelectedClubChange(event.target.value);
          setDeletedClub((current) => current ? { ...current, selected: false } : null);
        }} disabled={clubProfile.clubs.length === 0}>
        <option value="" disabled>Select club</option>
        {clubProfile.clubs.map((club) => <option key={club.id} value={club.id}>{club.label}</option>)}
      </select></label>
    </div>
  </>;
}

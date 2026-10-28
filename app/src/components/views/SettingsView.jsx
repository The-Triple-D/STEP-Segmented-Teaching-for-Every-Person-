const selectSettings = [
  ["font", "Font style", [["standard", "Standard sans serif"], ["dyslexia", "Dyslexia-friendly"]]],
  ["size", "Text size", [["normal", "Standard"], ["large", "Larger"]]],
  ["spacing", "Line spacing", [["normal", "Standard"], ["wide", "Relaxed"]]],
  ["contrast", "Display contrast", [["soft", "Soft"], ["high", "High contrast"]]]
];

export default function SettingsView({ preferences, onPreferenceChange }) {
  const renderSelect = (key, label, options, help = "") => (
    <div className="setting-row" key={key}>
      <label htmlFor={`setting-${key}`}>{label}{help && <small>{help}</small>}</label>
      <select id={`setting-${key}`} value={preferences[key]} onChange={event => onPreferenceChange(key, event.target.value)}>
        {options.map(([value, name]) => <option key={value} value={value}>{name}</option>)}
      </select>
    </div>
  );
  const renderSwitch = (key, label, help) => (
    <div className="setting-row" key={key}>
      <label htmlFor={`setting-${key}`}>{label}<small>{help}</small></label>
      <input className="switch" id={`setting-${key}`} type="checkbox" role="switch" checked={preferences[key]} onChange={event => onPreferenceChange(key, event.target.checked)} />
    </div>
  );
  return (
    <>
      <div className="page-head"><div><p className="eyebrow">Just for you</p><h1 id="settings-title">My preferences</h1><p className="lede">Set things up in a way that feels comfortable. Your choices work across every course.</p></div><span className="status done">Saved on this device</span></div>
      <div className="settings-layout">
        <div className="settings-list">
          <section className="setting-group"><h2>Reading comfort</h2><p>Choose how lesson text appears.</p>{selectSettings.map(item => renderSelect(item[0], item[1], item[2]))}</section>
          <section className="setting-group"><h2>Lesson format</h2><p>Choose the format that opens first. You can switch anytime.</p>{renderSelect("format", "Preferred format", [["watch", "Watch"], ["listen", "Listen"], ["read", "Read"], ["visual", "Visual summary"]])}</section>
          <section className="setting-group"><h2>Keep things calm</h2><p>Nothing plays or moves unless you choose it.</p>{renderSwitch("lowStimulation", "Low-stimulation mode", "Reduce extra visual effects")}{renderSwitch("sound", "Sound effects", "Off by default")}{renderSwitch("reduceMotion", "Reduce motion", "Honor your motion preference")}</section>
          <section className="setting-group"><h2>Reminders</h2><p>Optional nudges, at a pace you choose.</p>{renderSwitch("reminders", "Study reminders", "Choose whether to receive reminders")}{renderSelect("reminderTime", "Reminder time", [["Not set", "Not set"], ["Morning", "Morning"], ["Afternoon", "Afternoon"], ["Evening", "Evening"]])}</section>
        </div>
        <aside className="settings-preview"><h3>Reading preview</h3><div className="preview-paper"><strong>Encoding</strong> is the first step in memory. Information enters your brain through attention and experience.</div><p className="muted-copy">Changes apply right away.</p><p className="saved-note" aria-live="polite">Your preferences are saved.</p></aside>
      </div>
    </>
  );
}

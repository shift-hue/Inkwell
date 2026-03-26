const MOODS = [
  { key: "happy", emoji: "😊", label: "Happy", color: "var(--mood-happy)" },
  { key: "calm", emoji: "😌", label: "Calm", color: "var(--mood-calm)" },
  { key: "sad", emoji: "😢", label: "Sad", color: "var(--mood-sad)" },
  { key: "anxious", emoji: "😰", label: "Anxious", color: "var(--mood-anxious)" },
  { key: "angry", emoji: "😤", label: "Angry", color: "var(--mood-angry)" },
  { key: "meh", emoji: "😑", label: "Meh", color: "var(--mood-meh)" },
  { key: "excited", emoji: "🤩", label: "Excited", color: "var(--mood-excited)" },
];

type Props = { value: string; onChange: (mood: string) => void };

export default function MoodPicker({ value, onChange }: Props) {
  return (
    <div className="mood-grid">
      {MOODS.map((m) => (
        <button
          key={m.key}
          type="button"
          className={`mood-btn ${value === m.key ? "selected" : ""}`}
          onClick={() => onChange(value === m.key ? "" : m.key)}
        >
          <span>{m.emoji}</span>
          {m.label}
        </button>
      ))}
    </div>
  );
}

export { MOODS };

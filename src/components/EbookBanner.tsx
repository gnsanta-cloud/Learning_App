type EbookBannerProps = {
  url: string;
  label: string;
  note?: string;
  color: string;
  accent: string;
  compact?: boolean;
};

export function EbookBanner({
  url,
  label,
  note,
  color,
  accent,
  compact = false,
}: EbookBannerProps) {
  return (
    <div
      className={`ebook-banner ${compact ? "ebook-banner--compact" : ""}`}
      style={
        {
          "--subject-color": color,
          "--subject-accent": accent,
        } as React.CSSProperties
      }
    >
      <div className="ebook-banner-text">
        <span className="ebook-banner-icon" aria-hidden>
          📖
        </span>
        <div>
          <strong>{label}</strong>
          {note && <p>{note}</p>}
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-ebook"
      >
        e북 열기 ↗
      </a>
    </div>
  );
}

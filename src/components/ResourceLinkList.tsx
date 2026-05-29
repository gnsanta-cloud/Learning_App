import type { ResourceLink } from "../types";

type Props = {
  title: string;
  hint?: string;
  links: ResourceLink[];
  color: string;
};

export function ResourceLinkList({ title, hint, links, color }: Props) {
  return (
    <section
      className="resource-section"
      aria-label={title}
      style={{ "--subject-color": color } as React.CSSProperties}
    >
      <h2 className="section-title">{title}</h2>
      {hint && <p className="resource-hint">{hint}</p>}
      <ul className="resource-link-list">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.label}
              <span className="resource-link-arrow" aria-hidden>
                ↗
              </span>
              {link.note && <small>{link.note}</small>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

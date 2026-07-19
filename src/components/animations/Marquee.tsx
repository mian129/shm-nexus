"use client";

const items = [
  "Frontend Development",
  "Web Design",
  "UX Design",
  "SEO Optimization",
  "Brand Identity",
  "Social Media Marketing",
  "Graphic Design",
  "Video Editing",
];

export default function Marquee() {
  const repeated = [...items, ...items];

  return (
    <div className="marquee-wrapper">
      <div className="marquee-content">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center">
            {item}
            <span className="marquee-divider" />
          </span>
        ))}
      </div>
    </div>
  );
}

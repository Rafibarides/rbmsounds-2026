export default function StemList({ contents }) {
  return (
    <div className="stems">
      {contents.map((item) => (
        <div className="stem" key={item.label}>
          <span>{item.label}</span>
          <span>{item.count ?? ""}</span>
        </div>
      ))}
    </div>
  );
}

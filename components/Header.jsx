export default function Header() {
  const year = new Date().getFullYear();
  return (
    <div className="header">
      <div className="header-top">
        <div className="logo-circle"><span>UK</span></div>
        <div>
          <div className="brand-title">Rotaract Uwara Kik&apos;</div>
          <div className="brand-sub">Guatemala · {year}</div>
        </div>
      </div>
    </div>
  );
}

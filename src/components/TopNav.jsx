import "../styles/TopNav.css";

export default function TopNav() {
  return (
    <header className="topnav">
      <div className="left">
        <a className="navItem" href="#">
          <span className="play">▶</span> HOME
        </a>
        <a className="navItem" href="#">
          PRICING
        </a>
      </div>

      <div className="right">
        <a className="navItem" href="#">
          LOG-IN
        </a>
        <a className="navBtn" href="#">
          SIGN-UP
        </a>
        <span className="dot" />
      </div>
    </header>
  );
}

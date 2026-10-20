export function Cat() {
  return (
    <svg viewBox="0 0 120 80" className="cat-sprite" aria-hidden="true">
      <ellipse cx="59" cy="72" rx="41" ry="4" fill="#39261d" opacity=".13" />
      <g className="cat-tail">
        <path
          d="M31 48C8 49 9 22 20 26"
          fill="none"
          stroke="#cf8248"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path d="M20 26v5" stroke="#f3cb92" strokeWidth="8" strokeLinecap="round" />
      </g>
      <g className="cat-leg cat-leg-back">
        <path d="m40 49-6 20h9l9-19" fill="#d98e54" />
      </g>
      <g className="cat-leg cat-leg-front">
        <path d="m74 48 2 21h9l-1-22" fill="#d98e54" />
      </g>
      <g className="cat-body">
        <ellipse cx="58" cy="47" rx="30" ry="17" fill="#e9a869" />
        <path
          d="m42 33 4 9m6-11 4 9m7-8 4 9"
          stroke="#bf723e"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M68 40 66 17l13 8 13-2 11-10 1 28c0 22-35 23-36-1" fill="#e9a869" />
        <path d="m71 25-1-4 7 6m19-1 5-6v10" fill="none" stroke="#edc1aa" strokeWidth="3" />
        <ellipse cx="88" cy="45" rx="12" ry="8" fill="#f8dfb4" />
        <g className="cat-eyes">
          <ellipse cx="79" cy="36" rx="2" ry="3" fill="#3b4238" />
          <ellipse cx="97" cy="35" rx="2" ry="3" fill="#3b4238" />
        </g>
        <path d="m87 42 4-1-2 3z" fill="#a56461" />
        <path
          d="m76 44-12-2m13 5-12 2m30-6 14-3m-13 6 13 1"
          fill="none"
          stroke="#8f623e"
          strokeWidth="1"
        />
      </g>
      <g className="cat-leg cat-leg-front-alt">
        <path d="m66 53 1 17h10l-2-18" fill="#efb576" />
        <path d="M67 68h10" stroke="#fae5c4" strokeWidth="4" />
      </g>
      <g className="cat-leg cat-leg-back-alt">
        <path d="m34 51 9 19h10L44 50" fill="#efb576" />
        <path d="M43 68h10" stroke="#fae5c4" strokeWidth="4" />
      </g>
    </svg>
  );
}

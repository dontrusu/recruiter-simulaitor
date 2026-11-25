import { useEffect, useRef } from "react";

const width = 480;
const height = 260;

function paintMeadow(ctx: CanvasRenderingContext2D) {
  let seed = 140;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  const rect = (x: number, y: number, w: number, h: number, ink: string) => {
    ctx.fillStyle = ink;
    ctx.fillRect(Math.round(x), Math.round(y), w, h);
  };

  const sky = ctx.createLinearGradient(0, 0, 0, 185);
  sky.addColorStop(0, "#76b7ef");
  sky.addColorStop(1, "#c5eaf5");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  function cloud(x: number, y: number, scale: number) {
    const blocks = [
      [0, 15, 90, 5],
      [8, 10, 74, 6],
      [17, 6, 25, 5],
      [22, 2, 16, 6],
      [27, 0, 7, 3],
      [41, 10, 28, 5],
      [53, 5, 14, 6],
      [69, 13, 17, 4],
      [90, 17, 9, 3],
      [10, 20, 61, 3],
      [19, 23, 29, 2],
    ];
    for (const [dx, dy, w, h] of blocks) {
      rect(x + dx * scale, y + dy * scale, w * scale, h * scale, "#d9eafa");
    }
    for (const [dx, dy, w, h] of blocks.slice(0, 9)) {
      rect(
        x + dx * scale,
        y + (dy - 2) * scale,
        w * scale,
        h * scale,
        "#fffdf1",
      );
    }
  }
  cloud(-13, 37, 1.35);
  cloud(102, 88, 0.55);
  cloud(264, 29, 0.8);
  cloud(382, 57, 1.12);
  cloud(453, 102, 0.46);

  function hill(edge: (x: number) => number, main: string, light: string) {
    for (let x = 0; x < width; x += 2) {
      const y = Math.round(edge(x));
      rect(x, y, 2, height - y, main);
      if (random() > 0.27) rect(x, y, 2, 2 + Math.floor(random() * 4), light);
    }
  }
  hill(
    (x) => 143 + 13 * Math.sin(x / 42) - 6 * Math.cos(x / 25),
    "#639f9a",
    "#7eb19e",
  );
  hill((x) => 163 + 15 * Math.sin((x - 42) / 41), "#88b876", "#a4ca83");
  hill(
    (x) => 184 - 12 * Math.sin((x + 30) / 45) + 6 * Math.cos(x / 23),
    "#add489",
    "#c2df96",
  );
  hill(
    (x) => 221 + 9 * Math.sin(x / 64) - 7 * Math.cos(x / 34),
    "#9bc984",
    "#a6d189",
  );

  for (let i = 0; i < 1500; i++) {
    const x = Math.floor(random() * width);
    const y = 174 + Math.floor(random() * 86);
    const edge = 184 - 12 * Math.sin((x + 30) / 45) + 6 * Math.cos(x / 23);
    if (y < edge + 4) continue;
    const tint = ["#92c17c", "#b5d893", "#83b47c", "#a7cf83"][i % 4];
    rect(x, y, 2 + Math.floor(random() * 5), 1, tint);
    if (i % 5 === 0 && y > 200) rect(x + 2, y - 2, 1, 2, tint);
  }
  for (let i = 0; i < 75; i++) {
    const x = random() * width;
    const y = 215 + random() * 44;
    const dark = i % 3 ? "#70a875" : "#5e9b75";
    rect(x, y - 1, 1, 4, dark);
    rect(x - 1, y - 3, 1, 2, dark);
    rect(x + 1, y, 1, 2, dark);
    if (i % 4 !== 0) continue;
    rect(x - 2, y - 5, 5, 2, "#fffbed");
    rect(x, y - 7, 1, 6, "#fffbed");
    rect(x, y - 5, 1, 2, "#f8d661");
  }
}

export function Meadow() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (ctx) paintMeadow(ctx);
  }, []);
  return (
    <canvas
      ref={canvas}
      className="meadow"
      width={width}
      height={height}
      aria-hidden="true"
    />
  );
}

const sprites = {
  pool: [
    "................",
    "..........dd....",
    "..........dwd...",
    ".........ddwd...",
    "..dddddd.dwd....",
    ".ddhhhhdddddd...",
    "dhhhhhhhhhhdAd..",
    "dhhwwhhhhwdhAd..",
    "dbbhhhbbhhhhAd..",
    "dbbbbbwwbbbbAd..",
    "dbbwwbbbbbbAAd..",
    ".AdAAAbAAAAAdd..",
    "..dddddddddd....",
    "................",
    "................",
    "................",
  ],
  headphones: [
    "................",
    ".....dddddd.....",
    "...ddvvvvvvdd...",
    "..dvvvEEEEEvvd..",
    ".dvvEddddddEvvd.",
    ".dvEd......dEvd.",
    ".dEEd......dEEd.",
    ".dEd........dEd.",
    "ddEdd......ddEdd",
    "dFYEd......dEYFd",
    "dFYYd......dYYFd",
    "dYYod......doYYd",
    "dYood......dooYd",
    ".ddd........ddd.",
    "................",
    "................",
  ],
  compassion: [
    "................",
    "................",
    "..dddddddddddd..",
    ".ddwwwwwwwwwwdd.",
    ".dmpwwwwwwwwpmd.",
    ".dmmppwwwwppMmd.",
    ".dmmpMppppMmmmd.",
    ".dmmmppddppmmmd.",
    ".dmmmdrrdrdmmMd.",
    ".dmMdrrRrrRdMmd.",
    ".dMmmdRRRRdMmd..",
    "..ddddRdRddd....",
    ".....dRRd.......",
    "......dd........",
    "................",
    "................",
  ],
  reply: [
    "..........ddd...",
    ".........dFFFd..",
    "..ddddddddFYFd..",
    ".ddhhhhhhdYYYd..",
    ".dhwwwwwwwddd...",
    ".dhwwwwwwwwhAd..",
    ".dhwdddwwwwhAd..",
    ".dhwdAbdwwwhAd..",
    ".dhwdAAAAddhAd..",
    ".dhwddddAAdhAd..",
    ".dhwwwwdAAdhAd..",
    ".dAhhhhddhAAAd..",
    "..dddddddddAdd..",
    "....dAd..ddd....",
    "....dd..........",
    "................",
  ],

  stamp: [
    "................",
    "......dddd......",
    ".....drrRRd.....",
    "....drrRRRRd....",
    "....dRRRRRRd....",
    ".....dRRRdd.....",
    "......dRd.......",
    "......dmd.......",
    "....dddmdEdd....",
    "...ddvvvvvvdd...",
    "..dEEEEEEEEEd...",
    "..ddddddddddd...",
    "..dmmmmmmmmmd...",
    "...ddddddddd....",
    "................",
    "................",
  ],
  bingo: [
    "................",
    "..ddddddddddd...",
    "..dvvvEEEEEEdd..",
    "..dvwwwwwwwEdd..",
    "..ddddddddddEd..",
    "..dwwdwwdwwdEd..",
    "..dwwdwwdwwdEd..",
    "..ddddddddddEd..",
    "..dwwdYYdwwdEd..",
    "..dwwdFodwwdEd..",
    "..ddddddddddEd..",
    "..dwwdwwdYYdEd..",
    "..dwwdwwdFodEd..",
    "..ddddddddddd...",
    "................",
    "................",
  ],
  vacancy: [
    "................",
    "......dddd......",
    ".....dYooYd.....",
    ".....d....d.....",
    "..dddddddddddd..",
    ".ddooYYYYYYYYdd.",
    ".doPYYYYYYYYood.",
    ".doYYYYYYYYoood.",
    ".dddddddddddddd.",
    ".dopppdwwdpppod.",
    ".dopppdYYdpppod.",
    ".doopppopppood..",
    "..dddddddddddd..",
    "................",
    "................",
    "................",
  ],
  optimizer: [
    "................",
    "...ddddddddd....",
    "...dwwwwwwhdd...",
    "...dwwwwwwhAd...",
    "...dwddddwwAd...",
    "...dwwwwwwhAd...",
    "...dwddddwwAdd..",
    "...dwwwwwwdFYd..",
    "...dwdddwdFYod..",
    "...dwwwwdFYodd..",
    "...dwwddFYod....",
    "...dwddYYodAd...",
    "...dhdoddAAAAd..",
    "...ddddddddddd..",
    "................",
    "................",
  ],
  robot: [
    "................",
    "......dYYd......",
    "......dFFd......",
    ".......dd.......",
    "..dddddddddddd..",
    ".ddvvvvvvvvvEdd.",
    "ddvvvEEEEEvvEEdd",
    "dbddddddddddddbd",
    "dbdhhEhhEhhEddbd",
    "dbdbdEbdEbdEddbd",
    "dddddddddddddddd",
    ".dvvwwEEEEEEEd..",
    "..ddddddddddd...",
    "...ddEEEEEdd....",
    ".....ddddd......",
    "................",
  ],
  funnel: [
    "............",
    ".dddddddddd.",
    ".dYYYYYYYYd.",
    "..dYYYYYYd..",
    "...dYYYYd...",
    "....dYYd....",
    "....dYYd....",
    "....dYYd....",
    "....dYYd....",
    "....dYd.....",
    "....dd......",
    "............",
  ],
  certificate: [
    "................",
    "..dddddddddddd..",
    "..dwwwwwwwwwvd..",
    "..dwvvvvvvwwvd..",
    "..dwwwwwwwwwvd..",
    "..dwdddddddwwd..",
    "..dwwwwwwwwwvd..",
    "..dwddddwdYYdd..",
    "..dwwwwwwdFYod..",
    "..dwwwwwwdYYod..",
    "..ddddddddddod..",
    ".........dYYYYd.",
    ".........dYddYd.",
    ".........dd..dd.",
    "................",
    "................",
  ],
  chart: [
    "....dddd....",
    "....dEEd....",
    "....dddd....",
    ".....dd.....",
    ".....dd.....",
    "..dddddddd..",
    "..d..dd..d..",
    "..d..dd..d..",
    ".ddd.dd.ddd.",
    ".dgd.dYd.dEd",
    ".ddd.dd.ddd.",
    "............",
  ],
  trophy: [
    "..dddddddd..",
    ".ddYYYYYYdd.",
    "dwdYYYYYYdwd",
    "dwdYYYYYYdwd",
    ".ddYYYYYYdd.",
    "..ddYYYYdd..",
    "....dddd....",
    ".....dd.....",
    ".....dd.....",
    "....dYYd....",
    "...dddddd...",
    "...dEEEEd...",
  ],
  social: [
    "................",
    "..dddddddddddd..",
    "..dvvvvvvvvEEd..",
    "..dvvEEEvvEEEd..",
    "..dddddddddddd..",
    "..dwwwwwwwwwvd..",
    "..dwdPPddwwwvd..",
    "..dwdPPpdwwwvd..",
    "..dwdEEEdwwwvd..",
    "..dwwwwwdddwwd..",
    "..dwdddwwwwwwd..",
    "..dwwwwwwwwwwd..",
    "..dddddddddddd..",
    ".........dYd....",
    ".........ddd....",
    "................",
  ],
  cannon: [
    ".Y.....E....",
    "....g.....Y.",
    "..dd.....E..",
    ".dYYdd......",
    "dYYYYYdd....",
    ".dYYYYYYdd..",
    "..ddYYYYYYd.",
    "....ddYYYd..",
    ".....dddd...",
    "....dddddd..",
    "...dEEdEEd..",
    "....dd.dd...",
  ],
  calm: [
    ".....d......",
    "....dgd.....",
    "...dgggd....",
    "...dgggd....",
    "..dgggggd...",
    ".dgggdgggd..",
    "dgggdddgggd.",
    ".ddd.d.ddd..",
    ".....d......",
    "....ddd.....",
    "...dwwwd....",
    "....ddd.....",
  ],
  gift: [
    "...dd..dd...",
    "..dYYddYYd..",
    "...ddYYdd...",
    ".dddddddddd.",
    ".dEEEYYEEEd.",
    ".dddddddddd.",
    "..dEEYYEEd..",
    "..dEEYYEEd..",
    "..dEEYYEEd..",
    "..dEEYYEEd..",
    "..dddddddd..",
    "............",
  ],
  headcount: [
    "................",
    ".....dddddd.....",
    "....dcPPPccd....",
    "...dcPPPPPPpd...",
    "...dcPddPddpd...",
    "...dPPPPPPPpd...",
    "....dPPpPPpd....",
    ".....ddpddd.....",
    "...ddvvEEEEEdd..",
    "..dvvvEEEwEEEd..",
    "..dEEEEEEvEEEd..",
    "..dddddddddddd..",
    "...dFYooooYd....",
    "...ddddddddd....",
    "................",
    "................",
  ],
  eye: [
    "................",
    ".......E........",
    "...E...d...E....",
    "....d.....d.....",
    ".....dddddd.....",
    "...ddhhhhhhdd...",
    "..dwwhvvvvhwwd..",
    ".dwwhvddwvhwwwd.",
    "dwwwhvddEvhwwwwd",
    ".dwwhvEEEvhwwwd.",
    "..dwwhvvvvhwwd..",
    "...ddhhhhhhdd...",
    ".....dddddd.....",
    ".......E........",
    "................",
    "................",
  ],
  desk: [
    "................",
    "......dddddd....",
    ".....ddhvvhdd...",
    ".....dhhhvvEd...",
    ".....dhhvvEEd...",
    ".....dddddddd...",
    ".......dEd......",
    "...dddddddddd...",
    "..dFFYYYYYYood..",
    "..dddddddddddd..",
    "...dod....dod...",
    "...dod....dod...",
    "...ddd....ddd...",
    "................",
    "................",
    "................",
  ],

  swimmer: [
    "....ddddd....",
    "...dcccccd...",
    "..dcccccdd...",
    "..dccPPpPd...",
    "..dcPdPPPd...",
    "...dPPpPd....",
    "....dPPd.....",
    "...ddPPdd....",
    ".ddfffffffdd.",
    "dfffffffffffd",
    ".ddddddddddd.",
  ],
  plant: [
    ".......dd........",
    "....dd.gl.dd.....",
    "..ddlgdggglgdd...",
    ".dlgglgldggglgd..",
    "dgglgdgldgldggld.",
    "dldggdggldgldggd.",
    ".ddlgdggdggdldd..",
    "..dggldgdgldgd...",
    "..dldggddggdld...",
    "...ddgdgdgdgd....",
    "...dldgdgddld....",
    "....ddddddddd....",
    "....dPpppPpPd....",
    ".....dPppppd.....",
    ".....dPppppd.....",
    "......dPppd......",
    "......ddddd......",
  ],
  cup: [
    ".....s....s......",
    "....s....s.......",
    ".....s....s......",
    "......s....s.....",
    ".................",
    "..dddddddddd.....",
    "..dccccccccd.dd..",
    "..dwwwwwwwwddwd..",
    "..dwwdwwdwwd.wd..",
    "..dwwwwwwwwddwd..",
    "..dwwwddwwwddd...",
    "...dwwwwwwd......",
    "....dddddd.......",
    "..ssssssssss.....",
  ],
  orb: [
    "......dddd.......",
    "....ddllllEdd....",
    "...dllwwlllEEd...",
    "..dlwllllllllEd..",
    "..dlwllwlllllEd..",
    ".dllwllllllllEEd.",
    ".dlllwllwllllEEd.",
    ".dllllllllllEEEd.",
    "..dEEllllllEEEd..",
    "..dEEElllEEEEdd..",
    "...ddEEEEEEdd....",
    ".....dddddd......",
    "....ddPPPPdd.....",
    "...dddddddddd....",
  ],
  duck: [
    "....dddd.........",
    "...dYYYYd........",
    "..dYdYYYYd.......",
    "ddpYYYYYYd.......",
    "dppYYYYYYd..dd...",
    ".dddYYYYYdddYd...",
    "...dYYYYYYYYYd...",
    "...dYYYYYYYYd....",
    "....dYYYYYYd.....",
    ".....dddddd......",
  ],
};

const pixelColors: Record<string, string> = {
  d: "#252840",
  g: "#529267",
  l: "#a4d585",
  P: "#ffcf9c",
  p: "#dc956f",
  w: "#fff9e3",
  c: "#784e45",
  s: "#9a8d8f",
  E: "#6353af",
  Y: "#f5df49",
  f: "currentColor",
  h: "#a4e5ef",
  b: "#53bdd8",
  A: "#337d9a",
  v: "#a99be6",
  F: "#fff19c",
  o: "#d38d39",
  m: "#f5b5ca",
  M: "#cf789b",
  r: "#f88796",
  R: "#ce4f76",
};

export type SpriteKind = keyof typeof sprites;

export function Sprite({ kind }: { kind: SpriteKind }) {
  const pixels = sprites[kind];
  return (
    <svg
      className={`sprite sprite-${kind}`}
      viewBox={`0 0 ${pixels[0].length} ${pixels.length}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {pixels.flatMap((row, y) =>
        Array.from(row).flatMap((color, x) => {
          if (color === ".") return [];
          const fill =
            kind === "orb" && color === "l" ? "#9e9bef" : pixelColors[color];
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill={fill}
            />
          );
        }),
      )}
    </svg>
  );
}

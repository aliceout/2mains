/* PAGE FINALE — VERSION VIVANTE
   Base : Variation D / final-home.jsx
   Levers : + de couleurs (terracotta, rose, mousse, miel), formes organiques
   (blobs SVG, ronds, courbes), layouts libres (rotations, débordements, collages).
   Ton : brut, un peu moins propre, plus humain.
   PAS de portraits / pas de nouvelles sections. */

/* ============ PALETTE ÉLARGIE ============ */
const ORANGE_V = "#C84A21";     /* terracotta cuit */
const PEACH_V = "#F4D9C4";      /* pêche poudré */
const ROSE_V = "#E8A99D";       /* rose terreux */
const VIOLET_V = "#4A3D85";     /* violet profond */
const LAV_V = "#DBD4EB";        /* lavande pâle */
const MAUVE_V = "#B49DC9";      /* mauve poussiéreux */
const MOSS_V = "#8A9A7B";       /* vert mousse doux */
const HONEY_V = "#E8B85B";      /* jaune miel */
const CREAM_V = "#F5EFE3";      /* crème papier */
const INK_V = "#1F1A14";
const INK_2_V = "#3D362A";
const INK_3_V = "#6B6256";
const PAPER_V = "#FBF7EE";      /* léger fond papier teinté */

/* ============ ATOMES — BLOBS / FORMES ORGANIQUES ============ */

/* Blob asymétrique. seed change la forme. */
const Blob = ({ size = 200, color = ORANGE_V, seed = 1, opacity = 1, style = {} }) => {
  const paths = [
    "M50,15 C75,10 95,30 92,55 C90,80 70,95 45,90 C20,85 5,65 10,40 C15,20 30,18 50,15 Z",
    "M52,8 C80,12 90,40 85,65 C78,90 50,95 25,85 C5,78 5,50 18,30 C28,15 40,5 52,8 Z",
    "M45,12 C72,5 92,25 90,52 C88,80 60,92 35,82 C12,72 5,45 18,25 C28,15 35,15 45,12 Z",
    "M50,18 C78,15 88,35 90,60 C92,82 65,95 38,88 C15,82 5,55 12,32 C20,18 35,20 50,18 Z",
    "M55,10 C82,18 95,42 88,68 C80,92 50,98 28,85 C8,73 4,42 18,25 C30,12 42,8 55,10 Z",
  ];
  const d = paths[seed % paths.length];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", opacity, ...style }}>
      <path d={d} fill={color} />
    </svg>
  );
};

/* Underline ondulé manuscrit */
const HandUnderline = ({ width = 200, color = ORANGE_V, style = {} }) => (
  <svg width={width} height="14" viewBox="0 0 200 14" fill="none" style={{ display: "block", ...style }}>
    <path d="M2 9 C 30 4, 55 12, 80 7 S 130 11, 160 6 S 195 9, 198 8" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </svg>
);

/* Cercle dessiné main */
const HandCircle = ({ size = 80, color = ORANGE_V, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ display: "block", ...style }}>
    <path d="M50 8 C 75 8, 92 28, 92 50 C 92 72, 73 92, 50 92 C 27 91, 8 73, 9 50 C 10 27, 28 9, 50 8 Z" stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
  </svg>
);

/* Flèche manuscrite courbe */
const HandArrow = ({ width = 100, color = INK_V, style = {} }) => (
  <svg width={width} height="60" viewBox="0 0 120 60" fill="none" style={{ display: "block", ...style }}>
    <path d="M5 10 Q 40 5, 70 25 T 110 45" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M100 38 L 110 45 L 102 52" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ============ HERO VIVANT ============ */
const HeroVivantV2 = () => (
  <section style={{ background: PAPER_V, position: "relative", overflow: "hidden", borderBottom: `1px solid ${LINE}` }}>
    {/* Blobs de fond */}
    <Blob size={460} color={PEACH_V} seed={0} opacity={0.55} style={{ position: "absolute", top: -120, right: -100 }} />
    <Blob size={340} color={LAV_V} seed={2} opacity={0.65} style={{ position: "absolute", bottom: -80, left: -60 }} />
    <Blob size={160} color={HONEY_V} seed={3} opacity={0.55} style={{ position: "absolute", top: 120, right: "30%" }} />
    <Blob size={90} color={MOSS_V} seed={4} opacity={0.7} style={{ position: "absolute", bottom: 100, left: "42%" }} />

    <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: "140px 60px 120px" }}>
      <div style={{ maxWidth: 1000 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <Blob size={14} color={MOSS_V} seed={1} />
          <Eyebrow>— Association · Lyon · Depuis 2022</Eyebrow>
        </div>
        <h1 style={{
          ...fSerif,
          fontSize: 120,
          fontWeight: 400,
          letterSpacing: "-0.025em",
          lineHeight: 0.96,
          margin: "0 0 40px",
          color: INK_V,
          position: "relative",
        }}>
          Se <em style={{ color: VIOLET_V, fontWeight: 500, position: "relative", display: "inline-block" }}>
            (re)toucher
            <HandUnderline width={420} color={MAUVE_V} style={{ position: "absolute", bottom: -10, left: 0 }} />
          </em><br/>
          pour se <em style={{ color: ORANGE_V, fontWeight: 500, position: "relative", display: "inline-block" }}>
            (re)lier
            <HandUnderline width={340} color={ROSE_V} style={{ position: "absolute", bottom: -10, left: 0 }} />
          </em>.
        </h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 80, alignItems: "end", maxWidth: 1100, position: "relative" }}>
        <p style={{ fontSize: 22, color: INK_2_V, lineHeight: 1.5, maxWidth: "50ch", margin: 0, ...fSans }}>
          On lutte contre l'isolement corporel des femmes par le toucher relationnel —
          une innovation sociale pour faire revenir le lien là où il manque.
        </p>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <BtnPrimary>Faire un don <Arrow color="white" /></BtnPrimary>
          <BtnGhost>Découvrir l'asso</BtnGhost>
        </div>
      </div>
    </div>
  </section>
);

/* ============ NOS ACTIONS — cartes inclinées avec blobs ============ */
const NosActionsVivantV2 = () => (
  <section style={{ padding: "140px 40px", position: "relative", overflow: "hidden", background: PAPER_V }}>
    <Blob size={320} color={ROSE_V} seed={4} opacity={0.25} style={{ position: "absolute", top: 60, right: -100 }} />
    <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
      <div style={{ marginBottom: 80, maxWidth: 760 }}>
        <Eyebrow>— Nos actions</Eyebrow>
        <h2 style={{ ...fSerif, fontSize: 72, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.0, margin: "16px 0 24px", color: INK_V, position: "relative", display: "inline-block" }}>
          Trois <em style={{ color: VIOLET_V, fontWeight: 500 }}>chemins</em> qui<br/>
          se croisent.
          <HandCircle size={140} color={ORANGE_V} style={{ position: "absolute", top: 60, right: -50, opacity: 0.4 }} />
        </h2>
        <p style={{ fontSize: 18, color: INK_2_V, lineHeight: 1.55, maxWidth: "60ch", margin: 0, ...fSans }}>
          Trois portes, un même fil — la place du corps dans le lien.
          On agit avec des femmes, des structures et celles et ceux qui veulent comprendre.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, alignItems: "start" }}>
        {[
          { num: "01", emoji: "🤍", title: "Accompagner", body: "Parcours individuels et ateliers collectifs pour permettre aux femmes de renouer avec leur corps dans un cadre choisi.", link: "Voir les ateliers", color: ORANGE_V, bg: PEACH_V, blob: ROSE_V, rot: -1.5 },
          { num: "02", emoji: "🌿", title: "Former", body: "On accompagne les équipes professionnelles à intégrer la dimension corporelle dans les parcours qu'elles proposent.", link: "Inviter l'équipe", color: VIOLET_V, bg: LAV_V, blob: MAUVE_V, rot: 1.5 },
          { num: "03", emoji: "🍯", title: "Documenter", body: "On contribue à la reconnaissance de l'isolement corporel comme enjeu de santé mentale, sociale, et de genre.", link: "Lire le manifeste", color: ORANGE_V, bg: HONEY_V, blob: ORANGE_V, rot: -0.8 },
        ].map((it, i) => (
          <article key={i} style={{
            background: it.bg,
            padding: "40px 32px 36px",
            borderRadius: 18,
            display: "flex",
            flexDirection: "column",
            minHeight: 380,
            position: "relative",
            overflow: "hidden",
          }}>
            <Blob size={150} color={it.blob} seed={i+1} opacity={0.35} style={{ position: "absolute", bottom: -50, right: -40 }} />
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28, position: "relative" }}>
              <span style={{ ...fSerif, fontStyle: "italic", fontSize: 64, fontWeight: 500, color: it.color, lineHeight: 1, letterSpacing: "-0.02em" }}>{it.num}</span>
              <span style={{ fontSize: 32 }}>{it.emoji}</span>
            </div>
            <h3 style={{ ...fSerif, fontSize: 32, fontWeight: 500, margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.1, color: INK_V, position: "relative" }}>{it.title}</h3>
            <p style={{ fontSize: 15, color: INK_2_V, lineHeight: 1.6, marginBottom: 24, flex: 1, position: "relative", ...fSans }}>{it.body}</p>
            <div style={{ position: "relative" }}>
              <LinkArrow color={it.color}>{it.link}</LinkArrow>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ============ IMPENSÉ — chiffres en collage ============ */
const ImpenseVivantV2 = () => (
  <section style={{ background: VIOLET_V, color: PAPER_V, padding: "140px 40px", position: "relative", overflow: "hidden" }}>
    <Blob size={500} color={MAUVE_V} seed={2} opacity={0.4} style={{ position: "absolute", top: -120, left: -150 }} />
    <Blob size={300} color={HONEY_V} seed={4} opacity={0.18} style={{ position: "absolute", bottom: -80, right: -50 }} />
    <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <Eyebrow color={HONEY_V}>— Le vrai problème</Eyebrow>
          <h2 style={{ ...fSerif, fontSize: 72, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.0, margin: "16px 0 28px", maxWidth: "13ch", color: PAPER_V, position: "relative", display: "inline-block" }}>
            Un <em style={{ color: HONEY_V, fontWeight: 500, position: "relative" }}>
              impensé
              <HandUnderline width={280} color={HONEY_V} style={{ position: "absolute", bottom: -10, left: 0 }} />
            </em><br/>social.
          </h2>
          <p style={{ color: "rgba(251,247,238,0.85)", fontSize: 18, lineHeight: 1.6, maxWidth: "48ch", marginBottom: 0, ...fSans }}>
            L'isolement corporel, c'est l'absence durable de toucher bienveillant —
            ou l'inverse, des touchers uniquement intrusifs. Il touche surtout les
            femmes en précarité, les femmes âgées, et celles qui ont subi des violences.
          </p>
        </div>

        {/* Chiffres en collage — chaque stat est une carte qui flotte */}
        <div style={{ position: "relative", height: 480 }}>
          {[
            { num: "7M+", label: "personnes en isolement relationnel en France.", src: "Fondation de France · 2024", bg: PEACH_V, color: INK_V, rot: -3, top: 0, left: 0 },
            { num: "40 %", label: "de la population sans-abri à Lyon sont des femmes.", src: "Métropole · 2023", bg: ROSE_V, color: INK_V, rot: 4, top: 130, left: 180 },
            { num: "90 %", label: "des usagers des services dédiés sont des hommes.", src: "Métropole · 2023", bg: HONEY_V, color: INK_V, rot: -2, top: 280, left: 30 },
          ].map((s, i) => (
            <div key={i} style={{
              position: "absolute",
              top: s.top, left: s.left,
              width: 280,
              background: s.bg,
              padding: "24px 24px 22px",
              borderRadius: 14,
              boxShadow: "0 18px 40px -12px rgba(0,0,0,0.35), 0 4px 12px -4px rgba(0,0,0,0.25)",
            }}>
              <div style={{ ...fSerif, fontStyle: "italic", fontSize: 64, fontWeight: 500, color: s.color, lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: 10 }}>{s.num}</div>
              <p style={{ ...fSans, fontSize: 14, color: s.color, lineHeight: 1.4, margin: "0 0 8px" }}>{s.label}</p>
              <span style={{ ...fMono, fontSize: 10, color: s.color, opacity: 0.65, letterSpacing: "0.04em" }}>— {s.src}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ============ NOTRE RÉPONSE — composition typo + liste vivante ============ */
const NotreReponseVivantV2 = () => (
  <section style={{ padding: "140px 40px", background: PAPER_V, position: "relative", overflow: "hidden" }}>
    <Blob size={280} color={LAV_V} seed={1} opacity={0.5} style={{ position: "absolute", top: 40, left: -80 }} />
    <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", position: "relative" }}>
      {/* Composition typo "toucher" */}
      <div style={{
        aspectRatio: "4/5",
        background: CREAM_V,
        borderRadius: 18,
        padding: 48,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 50px -16px rgba(31,26,20,0.18)",
      }}>
        <Blob size={180} color={ROSE_V} seed={3} opacity={0.5} style={{ position: "absolute", bottom: -40, right: -40 }} />
        <Blob size={90} color={MOSS_V} seed={2} opacity={0.6} style={{ position: "absolute", top: 30, right: 30 }} />
        <div style={{ position: "relative" }}>
          <Eyebrow color={ORANGE_V}>— glossaire vivant</Eyebrow>
          <div style={{ ...fSerif, fontSize: 64, fontWeight: 500, marginTop: 20, color: INK_V, letterSpacing: "-0.025em", lineHeight: 1 }}>
            toucher,<br/>
            <em style={{ color: ORANGE_V }}>n.m.</em>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <p style={{ ...fSerif, fontStyle: "italic", fontSize: 24, color: INK_2_V, lineHeight: 1.4, margin: "0 0 12px", maxWidth: "20ch" }}>
            « contact volontaire entre deux corps qui se reconnaissent. »
          </p>
          <span style={{ ...fMono, fontSize: 11, color: INK_3_V, letterSpacing: "0.06em", textTransform: "uppercase" }}>— manifeste 2026</span>
        </div>
      </div>

      <div>
        <Eyebrow>— Notre réponse</Eyebrow>
        <h2 style={{ ...fSerif, fontSize: 72, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.0, margin: "16px 0 28px", maxWidth: "13ch", color: INK_V }}>
          Le <em style={{ color: ORANGE_V, fontWeight: 500 }}>toucher</em> relationnel.
        </h2>
        <p style={{ color: INK_2_V, fontSize: 18, lineHeight: 1.6, maxWidth: "48ch", marginBottom: 36, ...fSans }}>
          Une pratique de présence, à mi-chemin entre l'éducation populaire et l'accompagnement
          social. Ce n'est pas un soin, ni une thérapie — c'est un endroit où le corps existe
          autrement.
        </p>
        <ul style={{ paddingLeft: 0, listStyle: "none", display: "grid", gap: 16, fontSize: 15, color: INK_2_V, lineHeight: 1.55, ...fSans, marginBottom: 36 }}>
          {[
            { strong: "Le consentement, partout", rest: " — revérifié à chaque rencontre, par chacune des deux personnes.", c: ORANGE_V },
            { strong: "La personne d'abord", rest: " — c'est elle qui décide du contenu, du rythme, du cadre.", c: VIOLET_V },
            { strong: "Le temps long", rest: " — 3 à 12 séances selon les besoins. Pas de mise en pression.", c: MOSS_V },
            { strong: "L'exigence professionnelle", rest: " — accompagnante formée, supervisée, gestes documentés.", c: ROSE_V },
          ].map((it, i) => (
            <li key={i} style={{ paddingLeft: 28, position: "relative" }}>
              <span style={{
                position: "absolute", left: 0, top: 4,
                width: 14, height: 14, borderRadius: 999,
                background: it.c,
              }}></span>
              <strong style={{ color: INK_V, fontWeight: 500 }}>{it.strong}</strong>{it.rest}
            </li>
          ))}
        </ul>
        <LinkArrow color={ORANGE_V}>Découvrir notre méthode</LinkArrow>
      </div>
    </div>
  </section>
);

/* ============ PARCOURS EN ÉTAPES — chemin sinueux ============ */
const ParcoursVivantV2 = () => (
  <section style={{ background: CREAM_V, padding: "140px 40px", borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, position: "relative", overflow: "hidden" }}>
    <Blob size={260} color={MOSS_V} seed={3} opacity={0.18} style={{ position: "absolute", top: 80, right: 60 }} />
    <Blob size={180} color={ROSE_V} seed={1} opacity={0.4} style={{ position: "absolute", bottom: 60, left: -40 }} />
    <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 64, marginBottom: 64, alignItems: "end" }}>
        <div>
          <Eyebrow>— Comment ça se passe</Eyebrow>
          <h2 style={{ ...fSerif, fontSize: 60, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.0, margin: "16px 0 0", color: INK_V }}>
            Un <em style={{ color: ORANGE_V, fontWeight: 500 }}>chemin</em>,<br/>pas une procédure.
          </h2>
        </div>
        <p style={{ color: INK_2_V, fontSize: 18, lineHeight: 1.6, maxWidth: "55ch", margin: "0 0 14px", ...fSans }}>
          De la première prise de contact à la sortie choisie, chaque étape se construit
          avec la personne. Vous pouvez interrompre à tout moment, sans avoir à vous justifier.
        </p>
      </div>

      <div style={{ position: "relative" }}>
        {/* SVG sinueux qui relie les étapes */}
        <svg style={{ position: "absolute", top: 70, left: 60, width: "calc(100% - 120px)", height: 60, pointerEvents: "none" }} viewBox="0 0 1000 60" preserveAspectRatio="none">
          <path d="M 0 30 C 100 5, 200 50, 300 25 S 500 50, 600 25 S 800 5, 1000 30" stroke={ORANGE_V} strokeWidth="2" strokeDasharray="6 6" fill="none" strokeLinecap="round"/>
        </svg>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, position: "relative" }}>
          {[
            { t: "Premier contact", b: "Vous nous écrivez ou êtes orientée — échange initial sans engagement.", c: ORANGE_V, bg: PEACH_V },
            { t: "Entrée parcours", b: "Définition d'un cadre, du rythme et de vos objectifs.", c: VIOLET_V, bg: LAV_V },
            { t: "Séances", b: "Chaque séance construite à partir de votre demande.", c: ORANGE_V, bg: HONEY_V },
            { t: "Bilan", b: "À mi-parcours, on fait le point ensemble — on adapte.", c: MOSS_V, bg: "#D6DDC9" },
            { t: "Sortie choisie", b: "Le parcours dure de 3 à 12 séances selon vos besoins.", c: VIOLET_V, bg: ROSE_V },
          ].map((s, i) => (
            <div key={i} style={{ paddingTop: 70 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 999,
                background: s.bg, color: s.c,
                ...fSerif, fontStyle: "italic", fontWeight: 500, fontSize: 22,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16, marginLeft: -2,
                boxShadow: `0 0 0 4px ${CREAM_V}, 0 0 0 6px ${s.c}`,
                position: "absolute", top: 50, left: `calc(${i * 20}% + 10px)`,
              }}>{i+1}</div>
              <h3 style={{ ...fSerif, fontSize: 22, fontWeight: 500, margin: "0 0 10px", color: INK_V, letterSpacing: "-0.015em", lineHeight: 1.15 }}>{s.t}</h3>
              <p style={{ fontSize: 14, color: INK_2_V, lineHeight: 1.6, margin: 0, ...fSans }}>{s.b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ============ TÉMOIGNAGE — collage avec annotations ============ */
const TemoignageVivantV2 = () => (
  <section style={{ padding: "140px 40px", background: PAPER_V, position: "relative", overflow: "hidden" }}>
    <Blob size={400} color={LAV_V} seed={4} opacity={0.35} style={{ position: "absolute", top: -80, right: -100 }} />
    <Blob size={200} color={HONEY_V} seed={2} opacity={0.4} style={{ position: "absolute", bottom: 40, left: 80 }} />

    <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <Eyebrow>— les voix</Eyebrow>
        <h2 style={{ ...fSerif, fontSize: 56, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "16px 0 0", maxWidth: "20ch", marginInline: "auto", color: INK_V }}>
          Ce qu'<em style={{ color: ORANGE_V, fontWeight: 500 }}>elles</em> en disent.
        </h2>
      </div>

      {/* Trois post-its inclinés */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", gap: 32, alignItems: "start", marginBottom: 40 }}>
        {[
          {
            quote: "C'est la première fois depuis des années que quelqu'un me touche sans rien me demander en retour.",
            who: "LOLA · participante, 42 ans",
            bg: PEACH_V, rot: -2, fontSize: 22,
          },
          {
            quote: "Je suis venue parce que je voulais comprendre. Je suis restée parce que ça m'a fait du bien.",
            who: "SAMIRA · participante, 58 ans",
            bg: HONEY_V, rot: 1.5, fontSize: 24,
          },
          {
            quote: "Au début j'avais peur. Maintenant, c'est moi qui propose les ateliers à mon ehpad.",
            who: "MARTINE · résidente · partenaire EHPAD",
            bg: ROSE_V, rot: -1, fontSize: 22,
          },
        ].map((t, i) => (
          <div key={i} style={{
            background: t.bg,
            padding: "32px 28px 26px",
            borderRadius: 12,
            boxShadow: "0 18px 40px -14px rgba(31,26,20,0.22), 0 4px 10px -4px rgba(31,26,20,0.12)",
            marginTop: i === 1 ? 24 : 0,
          }}>
            <div style={{ ...fSerif, color: INK_V, fontSize: 64, lineHeight: 0.5, fontStyle: "italic", fontWeight: 500, marginBottom: 16 }}>“</div>
            <blockquote style={{ ...fSerif, fontStyle: "italic", fontSize: t.fontSize, lineHeight: 1.3, margin: "0 0 20px", fontWeight: 400, letterSpacing: "-0.01em", color: INK_V }}>
              {t.quote}
            </blockquote>
            <cite style={{ ...fMono, fontSize: 11, color: INK_2_V, letterSpacing: "0.06em", fontStyle: "normal" }}>
              — {t.who}
            </cite>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ============ AUDIENCES — 3 colonnes avec blobs ============ */
const AudiencesVivantV2 = () => (
  <section style={{ padding: "140px 40px", background: PAPER_V, borderTop: `1px solid ${LINE}` }}>
    <div style={{ maxWidth: 1240, margin: "0 auto" }}>
      <div style={{ marginBottom: 80, position: "relative" }}>
        <Eyebrow>— Trois portes d'entrée</Eyebrow>
        <h2 style={{ ...fSerif, fontSize: 60, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.0, margin: "16px 0 0", maxWidth: "20ch", color: INK_V }}>
          Selon qui vous êtes,<br/>ce <em style={{ color: VIOLET_V, fontWeight: 500 }}>qu'on vous propose</em>.
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {[
          {
            kind: "STRUCTURE D'ACCUEIL",
            title: "Vous accompagnez des femmes isolées.",
            body: "On intervient dans votre structure pour proposer des ateliers collectifs et un accompagnement individuel des femmes, en complément de votre travail.",
            link: "Pour les structures",
            color: ORANGE_V, bg: PEACH_V, blob: ROSE_V,
          },
          {
            kind: "ENTREPRISE & MÉCÈNE",
            title: "Vous voulez agir contre l'isolement.",
            body: "Mécénat financier, mécénat de compétences, mise à disposition de locaux — plusieurs formes d'engagement possibles, à partir de 1 000 €.",
            link: "Devenir mécène",
            color: VIOLET_V, bg: LAV_V, blob: MAUVE_V,
          },
          {
            kind: "FEMME CONCERNÉE",
            title: "Vous souhaitez être accompagnée.",
            body: "Vous pouvez nous contacter directement, sans passer par une structure. C'est gratuit, confidentiel, et le rythme reste le vôtre.",
            link: "Premier contact",
            color: VIOLET_V, bg: HONEY_V, blob: ORANGE_V,
          },
        ].map((a, i) => (
          <div key={i} style={{
            background: a.bg,
            padding: "44px 32px 36px",
            borderRadius: 18,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minHeight: 360,
          }}>
            <Blob size={130} color={a.blob} seed={i+2} opacity={0.4} style={{ position: "absolute", top: -30, right: -30 }} />
            <div style={{ ...fMono, fontSize: 11, letterSpacing: "0.14em", color: a.color, marginBottom: 20, position: "relative" }}>{a.kind}</div>
            <h3 style={{ ...fSerif, fontSize: 28, fontWeight: 500, margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.15, color: INK_V, maxWidth: "16ch", position: "relative" }}>{a.title}</h3>
            <p style={{ fontSize: 15, color: INK_2_V, lineHeight: 1.6, marginBottom: 24, ...fSans, flex: 1, position: "relative" }}>{a.body}</p>
            <div style={{ position: "relative" }}>
              <LinkArrow color={a.color}>{a.link}</LinkArrow>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ============ CTA DUO — version vivante ============ */
const CtaDuoVivantV2 = () => (
  <section style={{ background: PAPER_V, position: "relative", overflow: "hidden" }}>
    <Blob size={400} color={ROSE_V} seed={3} opacity={0.5} style={{ position: "absolute", top: -100, left: "40%" }} />
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "120px 60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "stretch", position: "relative" }}>
      {/* Soutenir */}
      <div style={{
        background: ORANGE_V, color: PAPER_V,
        padding: "60px 50px",
        borderRadius: 22,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 30px 60px -20px rgba(200,74,33,0.4)",
        minHeight: 440,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}>
        <Blob size={260} color={HONEY_V} seed={4} opacity={0.35} style={{ position: "absolute", bottom: -80, right: -60 }} />
        <Blob size={120} color={ROSE_V} seed={1} opacity={0.5} style={{ position: "absolute", top: 30, right: 40 }} />
        <div style={{ position: "relative" }}>
          <Eyebrow color={HONEY_V}>— Soutenir</Eyebrow>
          <h2 style={{ ...fSerif, fontSize: 52, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.0, margin: "16px 0 24px", maxWidth: "12ch", color: PAPER_V }}>
            On <em style={{ color: HONEY_V, fontWeight: 500 }}>tient debout</em> grâce à vous.
          </h2>
          <p style={{ fontSize: 17, color: "rgba(251,247,238,0.9)", lineHeight: 1.55, maxWidth: "36ch", marginBottom: 0, ...fSans }}>
            Un don de 50 € permet à une femme de bénéficier d'une séance.
            <br/>Adhérer, donner, devenir bénévole — chaque geste compte.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, position: "relative", flexWrap: "wrap" }}>
          <a href="#" style={{ background: PAPER_V, color: ORANGE_V, padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, ...fSans }}>
            Faire un don <Arrow color={ORANGE_V} />
          </a>
          <a href="#" style={{ border: `1.5px solid ${PAPER_V}`, color: PAPER_V, padding: "14px 24px", borderRadius: 8, fontSize: 14, textDecoration: "none", ...fSans }}>
            Devenir bénévole
          </a>
        </div>
      </div>

      {/* Newsletter */}
      <div style={{
        background: LAV_V,
        padding: "60px 50px",
        borderRadius: 22,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 30px 60px -20px rgba(74,61,133,0.25)",
        minHeight: 440,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}>
        <Blob size={300} color={MAUVE_V} seed={2} opacity={0.45} style={{ position: "absolute", bottom: -100, right: -80 }} />
        <div style={{
          position: "absolute", top: 40, right: 50,
          ...fSerif, fontStyle: "italic",
          fontSize: 200, color: "rgba(255,255,255,0.4)",
          lineHeight: 0.85, fontWeight: 500,
          pointerEvents: "none", letterSpacing: "-0.04em",
        }}>+</div>
        <div style={{ position: "relative" }}>
          <Eyebrow color={VIOLET_V}>— Newsletter</Eyebrow>
          <h3 style={{ ...fSerif, fontSize: 48, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "16px 0 16px", maxWidth: "14ch", color: INK_V }}>
            Rester en <em style={{ color: VIOLET_V, fontWeight: 500 }}>lien</em>.
          </h3>
          <p style={{ fontSize: 16, color: INK_2_V, lineHeight: 1.55, maxWidth: "34ch", marginBottom: 0, ...fSans }}>
            Une lettre par saison — actualités, ateliers, lectures et ressources.
            Pas de spam.
          </p>
        </div>
        <form style={{ display: "flex", gap: 8, position: "relative" }} onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="votre@email.fr" style={{ flex: 1, padding: "14px 18px", borderRadius: 10, border: `1.5px solid ${MAUVE_V}`, fontSize: 14, ...fSans, background: "rgba(255,255,255,0.85)", color: INK_V }} />
          <button style={{ background: VIOLET_V, color: "white", border: "none", padding: "14px 22px", borderRadius: 10, fontSize: 14, ...fSans, cursor: "pointer", fontWeight: 500 }}>S'abonner</button>
        </form>
      </div>
    </div>
  </section>
);

/* ============ PAGE ASSEMBLÉE ============ */

const HomePageVivantV2 = () => (
  <>
    <HeroVivantV2 />
    <NosActionsVivantV2 />
    <ImpenseVivantV2 />
    <NotreReponseVivantV2 />
    <ParcoursVivantV2 />
    <TemoignageVivantV2 />
    <AudiencesVivantV2 />
    <CtaDuoVivantV2 />
  </>
);

Object.assign(window, {
  HomePageVivantV2,
  /* tokens vivants pour réutilisation page blocs si besoin */
  PEACH_V, ROSE_V, MAUVE_V, MOSS_V, HONEY_V, CREAM_V, PAPER_V,
  LAV_V, INK_V, INK_2_V, INK_3_V, ORANGE_V, VIOLET_V,
  Blob, HandUnderline, HandCircle, HandArrow,
});

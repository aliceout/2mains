/* PAGES FINALES — basées sur Variation D
   Direction Éditorial : Newsreader serif + Inter Tight + JetBrains Mono
   Structure : splits, sections teintées, watermarks typographiques,
   compositions à la place des photos. */

const ORANGE = "#C84A21";
const ORANGE_SOFT = "#E8633A";
const VIOLET = "#4A3D85";
const VIOLET_SOFT = "#6B5BA8";
const INK = "#1F1A14";
const INK_2 = "#3D362A";
const INK_3 = "#6B6256";
const PAPER_WHITE = "#FBFAF6";
const PAPER_CREAM = "#F5EFE3";
const PAPER_PEACH = "#F4D9C4";
const PAPER_LAV = "#DBD4EB";
const PAPER_LAV_LIGHT = "#F1EEF7";
const PAPER_CREAM_LIGHT = "#F8EFE0";
const LINE = "#D8CFBF";
const LINE_LAV = "#C7BCE0";

/* ============ ATOMES ============ */

const fSerif = { fontFamily: "Newsreader, serif" };
const fSans = { fontFamily: "Inter Tight, system-ui, sans-serif" };
const fMono = { fontFamily: "JetBrains Mono, ui-monospace, monospace" };

const Arrow = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: "inline-block", marginLeft: 4, verticalAlign: "-1px" }}>
    <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Plus = ({ open = false }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "rotate(0)" }}>
    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const VLogo = () => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M22 8 a8 8 0 1 0 0 16" stroke={ORANGE_SOFT} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M10 24 a8 8 0 1 0 0 -16" stroke={VIOLET_SOFT} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
    <span style={{ display: "flex", flexDirection: "column", lineHeight: 1, ...fSerif }}>
      <span style={{ fontSize: 19, color: ORANGE, fontWeight: 500 }}>2mains</span>
      <span style={{ fontSize: 14, color: VIOLET, fontStyle: "italic", marginTop: 2 }}>de femmes</span>
    </span>
  </span>
);

const Eyebrow = ({ children, color = ORANGE }) => (
  <span style={{
    ...fMono,
    fontSize: 11,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color,
  }}>{children}</span>
);

const BtnPrimary = ({ children, href = "#" }) => (
  <a href={href} style={{ background: ORANGE, color: "white", padding: "12px 22px", borderRadius: 6, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, ...fSans }}>
    {children}
  </a>
);
const BtnGhost = ({ children, href = "#", color = INK }) => (
  <a href={href} style={{ border: `1px solid ${color}`, color, padding: "12px 22px", borderRadius: 6, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, ...fSans }}>
    {children}
  </a>
);
const BtnViolet = ({ children, href = "#" }) => (
  <a href={href} style={{ background: VIOLET, color: "white", padding: "12px 22px", borderRadius: 6, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, ...fSans }}>
    {children}
  </a>
);
const LinkArrow = ({ children, href = "#", color = ORANGE }) => (
  <a href={href} style={{ color, ...fSerif, fontStyle: "italic", fontSize: 16, textDecoration: "none", borderBottom: `1px solid ${color}`, paddingBottom: 2, alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 6 }}>
    {children} →
  </a>
);

/* ============ NAV / FOOTER ============ */

const NavBar = ({ active = "Accueil", page, setPage }) => (
  <nav style={{ background: PAPER_WHITE, borderBottom: `1px solid ${LINE}`, position: "sticky", top: 0, zIndex: 50 }}>
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "20px 40px", display: "flex", alignItems: "center", gap: 40 }}>
      <a href="#" onClick={(e) => { e.preventDefault(); setPage("home"); }} style={{ textDecoration: "none" }}>
        <VLogo />
      </a>
      <div style={{ display: "flex", gap: 28, fontSize: 14, color: INK, ...fSans }}>
        {[
          { label: "Accueil", key: "home" },
          { label: "Structures", key: "structure" },
          { label: "Femmes accompagnées", key: "femme" },
          { label: "Entreprises", key: "entreprise" },
          { label: "Bibliothèque", key: "blocks" },
        ].map((l, i) => (
          <a key={i} href="#" onClick={(e) => { e.preventDefault(); setPage(l.key); }}
             style={{ color: l.label === active ? ORANGE : INK, textDecoration: "none", borderBottom: l.label === active ? `1.5px solid ${ORANGE}` : "1.5px solid transparent", paddingBottom: 2, cursor: "pointer" }}>
            {l.label}
          </a>
        ))}
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
        <BtnPrimary>Faire un don <Arrow /></BtnPrimary>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer style={{ background: "#2B2419", color: "#D8CFBF", padding: "80px 40px 32px", borderTop: `2px solid ${INK}` }}>
    <div style={{ maxWidth: 1240, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 64, marginBottom: 64 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
              <path d="M22 8 a8 8 0 1 0 0 16" stroke={ORANGE_SOFT} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M10 24 a8 8 0 1 0 0 -16" stroke={VIOLET_SOFT} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </svg>
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1, ...fSerif }}>
              <span style={{ fontSize: 22, color: ORANGE_SOFT, fontWeight: 500 }}>2mains</span>
              <span style={{ fontSize: 16, color: "#A39DBF", fontStyle: "italic", marginTop: 2 }}>de femmes</span>
            </span>
          </div>
          <p style={{ fontSize: 14, color: "#9C9080", maxWidth: "32ch", lineHeight: 1.6, ...fSans }}>
            Nous luttons contre l'isolement corporel des femmes par le toucher relationnel.
          </p>
          <div style={{ marginTop: 24, ...fMono, fontSize: 12, color: "#9C9080", letterSpacing: "0.04em" }}>
            Lyon, France · contact@2mainsdefemmes.fr
          </div>
        </div>
        {[
          { title: "Agir & soutenir", links: ["Faire un don", "Devenir bénévole", "Mécénat entreprises", "Newsletter"] },
          { title: "L'association", links: ["Qui sommes-nous", "Notre mission", "Notre équipe", "Partenaires"] },
          { title: "Infos", links: ["Mentions légales", "Politique de confidentialité", "Accessibilité", "Presse"] },
        ].map((col, i) => (
          <div key={i}>
            <h4 style={{ ...fMono, fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 20px", color: PAPER_WHITE }}>{col.title}</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, fontSize: 14, ...fSans }}>
              {col.links.map((l, j) => <li key={j}><a href="#" style={{ color: "#9C9080", textDecoration: "none" }}>{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid #3D352A`, paddingTop: 24, display: "flex", justifyContent: "space-between", ...fMono, fontSize: 11, color: "#6B6256", letterSpacing: "0.04em" }}>
        <span>© 2026 · 2mains de femmes · Association loi 1901</span>
        <span>Site refait avec ♥ — printemps 2026</span>
      </div>
    </div>
  </footer>
);

/* ============ COMPOSITIONS TYPO (à la place des photos) ============ */

const RepeatedWord = ({ word = "(re)lier", color = ORANGE, lines = 6, size = 64 }) => (
  <div style={{
    ...fSerif,
    fontStyle: "italic",
    fontWeight: 500,
    fontSize: size,
    lineHeight: 1.05,
    letterSpacing: "-0.025em",
    color,
    userSelect: "none",
  }}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} style={{ opacity: 1 - (i * 0.13) }}>{word}</div>
    ))}
  </div>
);

const TypoComposition = ({ kind = "relier" }) => {
  if (kind === "relier") {
    return (
      <div style={{
        aspectRatio: "4/5",
        background: PAPER_WHITE,
        borderRadius: 8,
        padding: 40,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${LINE_LAV}`,
      }}>
        <Eyebrow color={VIOLET}>— manifeste</Eyebrow>
        <div><RepeatedWord word="(re)lier" color={ORANGE} lines={5} /></div>
        <div style={{ ...fMono, fontSize: 11, color: INK_3, letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "right" }}>
          verbe transitif · faire revenir le lien
        </div>
      </div>
    );
  }
  if (kind === "definition") {
    return (
      <div style={{
        aspectRatio: "4/5",
        background: PAPER_CREAM_LIGHT,
        borderRadius: 8,
        padding: 40,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}>
        <div>
          <Eyebrow color={ORANGE}>— glossaire</Eyebrow>
          <div style={{ ...fSerif, fontSize: 56, fontWeight: 500, marginTop: 16, color: INK, letterSpacing: "-0.025em" }}>
            toucher,<br/>
            <em style={{ color: ORANGE }}>n.m.</em>
          </div>
        </div>
        <p style={{ ...fSerif, fontStyle: "italic", fontSize: 22, color: INK_2, lineHeight: 1.4, margin: 0, maxWidth: "20ch" }}>
          « contact volontaire entre deux corps qui se reconnaissent — sans l'autre forme, c'est une intrusion. »
        </p>
        <div style={{ ...fMono, fontSize: 11, color: INK_3, letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "right" }}>
          Manifeste 2026
        </div>
      </div>
    );
  }
  return null;
};

/* ============ HERO PRINCIPAL ============ */

const Hero = () => (
  <section style={{ borderBottom: `1px solid ${LINE}` }}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 640 }}>
      <div style={{ padding: "100px 60px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Eyebrow>— Association · Lyon</Eyebrow>
        <h1 style={{
          ...fSerif,
          fontSize: 80,
          fontWeight: 400,
          letterSpacing: "-0.025em",
          lineHeight: 1.0,
          margin: "20px 0 28px",
          maxWidth: "14ch",
          color: INK,
        }}>
          Se <em style={{ color: VIOLET, fontWeight: 500 }}>(re)toucher</em>
          <br/>pour se <em style={{ color: ORANGE, fontWeight: 500 }}>(re)lier</em>.
        </h1>
        <p style={{ fontSize: 18, color: INK_2, lineHeight: 1.55, maxWidth: "44ch", marginBottom: 36, ...fSans }}>
          Nous luttons contre l'isolement corporel des femmes par le toucher relationnel —
          une innovation sociale pour faire revenir le lien là où il manque.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <BtnPrimary>Faire un don <Arrow color="white" /></BtnPrimary>
          <BtnGhost>Découvrir l'association</BtnGhost>
        </div>
      </div>
      <div style={{
        background: PAPER_CREAM,
        padding: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: -40, right: -20,
          ...fSerif,
          fontStyle: "italic",
          fontSize: 320,
          color: "#E8DDC6",
          lineHeight: 0.85,
          fontWeight: 500,
          pointerEvents: "none",
          letterSpacing: "-0.04em",
        }}>(re)</div>
        <div style={{ position: "relative" }}>
          <Eyebrow color={INK_3}>— prochain rendez-vous</Eyebrow>
          <div style={{ ...fMono, fontSize: 12, color: INK_3, marginTop: 12, letterSpacing: "0.04em" }}>
            15 MAI 2026 · 14:00 · LA MÉDIANE, LYON 3
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <h3 style={{ ...fSerif, fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 16px", maxWidth: "16ch", color: INK }}>
            Atelier découverte — auto-massages et toucher du consentement.
          </h3>
          <LinkArrow>S'inscrire / en savoir plus</LinkArrow>
        </div>
      </div>
    </div>
  </section>
);

/* ============ NOS ACTIONS ============ */

const NosActions = () => (
  <section style={{ padding: "120px 40px" }}>
    <div style={{ maxWidth: 1240, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 72 }}>
        <Eyebrow>— Nos actions</Eyebrow>
        <h2 style={{ ...fSerif, fontSize: 64, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "16px auto 20px", maxWidth: "20ch", color: INK }}>
          Trois axes <em style={{ color: VIOLET, fontWeight: 500 }}>complémentaires</em>.
        </h2>
        <p style={{ fontSize: 18, color: INK_2, lineHeight: 1.55, maxWidth: "60ch", margin: "0 auto", ...fSans }}>
          Qui agissent simultanément sur la place du corps, du lien social et de l'égalité de
          genre dans les parcours de vie.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {[
          { num: "01", title: "Accompagnement corporel", body: "Parcours individuels et ateliers collectifs pour permettre aux femmes de renouer avec leur corps dans un cadre bienveillant et choisi.", link: "En savoir plus", color: ORANGE, bg: PAPER_CREAM_LIGHT },
          { num: "02", title: "Sensibilisation & formation", body: "Nous accompagnons les équipes professionnelles et bénévoles à l'intégration de la dimension corporelle dans les parcours.", link: "Organiser une intervention", color: VIOLET, bg: PAPER_LAV_LIGHT },
          { num: "03", title: "Recherche-action & plaidoyer", body: "Nous contribuons à la reconnaissance de l'isolement corporel comme enjeu de santé mentale et de lien social.", link: "Comprendre", color: ORANGE, bg: PAPER_CREAM_LIGHT },
        ].map((it, i) => (
          <article key={i} style={{ background: it.bg, padding: 36, borderRadius: 8, display: "flex", flexDirection: "column", minHeight: 360 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 28 }}>
              <span style={{ ...fSerif, fontStyle: "italic", fontSize: 56, fontWeight: 500, color: it.color, lineHeight: 1, letterSpacing: "-0.02em" }}>{it.num}</span>
              <span style={{ flex: 1, height: 1, background: it.color, opacity: 0.3 }}></span>
            </div>
            <h3 style={{ ...fSerif, fontSize: 28, fontWeight: 500, margin: "0 0 14px", letterSpacing: "-0.015em", lineHeight: 1.15, color: INK }}>{it.title}</h3>
            <p style={{ fontSize: 15, color: INK_2, lineHeight: 1.6, marginBottom: 24, flex: 1, ...fSans }}>{it.body}</p>
            <LinkArrow color={it.color}>{it.link}</LinkArrow>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ============ IMPENSÉ SOCIAL (constat + chiffres) ============ */

const ImpenseSocial = () => (
  <section style={{ background: PAPER_LAV_LIGHT, padding: "120px 40px" }}>
    <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
      <div>
        <Eyebrow color={VIOLET}>— Le constat</Eyebrow>
        <h2 style={{ ...fSerif, fontSize: 64, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "16px 0 28px", maxWidth: "14ch", color: INK }}>
          Un <em style={{ color: VIOLET, fontWeight: 500 }}>impensé</em> social.
        </h2>
        <p style={{ color: INK_2, fontSize: 17, lineHeight: 1.6, maxWidth: "48ch", marginBottom: 40, ...fSans }}>
          L'isolement corporel, c'est l'absence durable de toucher bienveillant —
          ou la présence de touchers uniquement toxiques ou intrusifs. Il touche
          en particulier les femmes en situation de précarité, les femmes âgées,
          et les femmes ayant subi des violences.
        </p>
        <div style={{ display: "grid", gap: 20 }}>
          {[
            { num: "7M+", label: "personnes en isolement relationnel en France.", src: "Fondation de France · 2024" },
            { num: "40 %", label: "de la population sans-abri à Lyon sont des femmes.", src: "Diagnostic Métropole · 2023" },
            { num: "90 %", label: "des usagers des services dédiés à la grande précarité sont des hommes.", src: "Diagnostic Métropole · 2023" },
          ].map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 20, alignItems: "baseline", paddingBottom: 18, borderBottom: `1px solid ${LINE_LAV}` }}>
              <div style={{ ...fSerif, fontStyle: "italic", fontSize: 60, lineHeight: 0.95, color: ORANGE, fontWeight: 500, letterSpacing: "-0.025em" }}>{s.num}</div>
              <div>
                <p style={{ fontSize: 15, color: INK_2, lineHeight: 1.5, margin: "0 0 6px", ...fSans }}>{s.label}</p>
                <span style={{ ...fMono, fontSize: 11, color: INK_3, letterSpacing: "0.04em" }}>— {s.src}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TypoComposition kind="relier" />
    </div>
  </section>
);

/* ============ NOTRE RÉPONSE — toucher relationnel ============ */

const NotreReponse = () => (
  <section style={{ padding: "120px 40px" }}>
    <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
      <TypoComposition kind="definition" />
      <div>
        <Eyebrow>— Notre réponse</Eyebrow>
        <h2 style={{ ...fSerif, fontSize: 64, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "16px 0 28px", maxWidth: "14ch", color: INK }}>
          Le <em style={{ color: ORANGE, fontWeight: 500 }}>toucher</em> relationnel.
        </h2>
        <p style={{ color: INK_2, fontSize: 17, lineHeight: 1.6, maxWidth: "48ch", marginBottom: 28, ...fSans }}>
          Une pratique de présence, à mi-chemin entre l'éducation populaire et l'accompagnement
          social. Elle n'est ni médicale, ni psychothérapeutique — elle vient en complément, à
          la demande de la personne.
        </p>
        <ul style={{ paddingLeft: 0, listStyle: "none", display: "grid", gap: 14, fontSize: 15, color: INK_2, lineHeight: 1.55, ...fSans, marginBottom: 32 }}>
          {[
            { strong: "Un cadre fondé sur le consentement", rest: " — revérifié à chaque rencontre, par chacune des deux personnes." },
            { strong: "Une approche centrée sur la personne", rest: " — c'est elle qui décide du contenu, du rythme, du cadre." },
            { strong: "Une logique de cheminement long-terme", rest: " — 3 à 12 séances selon les besoins exprimés." },
            { strong: "Une exigence professionnelle", rest: " — accompagnante formée et supervisée, gestes documentés." },
          ].map((it, i) => (
            <li key={i} style={{ paddingLeft: 22, position: "relative" }}>
              <span style={{ position: "absolute", left: 0, color: ORANGE, ...fSerif, fontStyle: "italic", fontWeight: 500 }}>+</span>
              <strong style={{ color: INK, fontWeight: 500 }}>{it.strong}</strong>{it.rest}
            </li>
          ))}
        </ul>
        <LinkArrow color={ORANGE}>Découvrir notre méthode</LinkArrow>
      </div>
    </div>
  </section>
);

/* ============ PARCOURS / ÉTAPES ============ */

const Parcours = () => (
  <section style={{ background: PAPER_CREAM, padding: "120px 40px", borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
    <div style={{ maxWidth: 1240, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64, marginBottom: 56, alignItems: "end" }}>
        <div>
          <Eyebrow>— Comment ça se passe</Eyebrow>
          <h2 style={{ ...fSerif, fontSize: 56, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "16px 0 0", color: INK }}>
            Le <em style={{ color: ORANGE, fontWeight: 500 }}>parcours type</em>.
          </h2>
        </div>
        <p style={{ color: INK_2, fontSize: 17, lineHeight: 1.6, maxWidth: "55ch", margin: 0, ...fSans }}>
          Un cheminement progressif, du premier contact à la sortie choisie. Chaque étape se
          construit avec vous. Vous pouvez interrompre à tout moment.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, position: "relative" }}>
        {[
          { t: "Premier contact", b: "Vous nous écrivez ou êtes orientée — échange initial sans engagement." },
          { t: "Entrée dans le parcours", b: "Définition d'un cadre, du rythme et de vos objectifs." },
          { t: "Séances", b: "Chaque séance construite à partir de votre demande." },
          { t: "Bilan intermédiaire", b: "À mi-parcours, on fait le point — on adapte." },
          { t: "Sortie choisie", b: "Le parcours dure 3 à 12 séances selon vos besoins." },
        ].map((s, i) => (
          <div key={i} style={{ borderTop: `2px solid ${i === 2 ? VIOLET : ORANGE}`, paddingTop: 16 }}>
            <div style={{ ...fSerif, fontStyle: "italic", fontWeight: 500, fontSize: 32, color: i === 2 ? VIOLET : ORANGE, lineHeight: 1, marginBottom: 12 }}>
              0{i+1}.
            </div>
            <h3 style={{ ...fSerif, fontSize: 19, fontWeight: 500, margin: "0 0 10px", color: INK, letterSpacing: "-0.01em" }}>{s.t}</h3>
            <p style={{ fontSize: 13.5, color: INK_2, lineHeight: 1.55, margin: 0, ...fSans }}>{s.b}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ============ TÉMOIGNAGE ============ */

const Temoignage = () => (
  <section style={{ padding: "120px 40px" }}>
    <div style={{ maxWidth: 1240, margin: "0 auto" }}>
      <div style={{ background: PAPER_CREAM_LIGHT, padding: "80px 80px", borderRadius: 8, display: "grid", gridTemplateColumns: "auto 1fr", gap: 60, alignItems: "start" }}>
        <div style={{ ...fSerif, color: ORANGE, fontSize: 200, lineHeight: 0.7, fontWeight: 500, fontStyle: "italic" }}>“</div>
        <div>
          <Eyebrow color={INK_3}>— une voix</Eyebrow>
          <blockquote style={{
            ...fSerif,
            fontStyle: "italic",
            fontSize: 36,
            lineHeight: 1.3,
            margin: "16px 0 28px",
            fontWeight: 400,
            letterSpacing: "-0.015em",
            color: INK,
            maxWidth: "32ch",
          }}>
            Pendant longtemps, je pensais que mon corps était juste un problème.
            Là, c'est la première fois depuis des années que quelqu'un me touche
            sans rien me demander en retour.
          </blockquote>
          <cite style={{ ...fMono, fontSize: 12, color: INK_3, letterSpacing: "0.06em", fontStyle: "normal" }}>
            — LOLA · PARTICIPANTE, 42 ANS · LYON
          </cite>
        </div>
      </div>
    </div>
  </section>
);

/* ============ AUDIENCES (3 publics) ============ */

const Audiences = () => (
  <section style={{ padding: "120px 40px", borderTop: `1px solid ${LINE}` }}>
    <div style={{ maxWidth: 1240, margin: "0 auto" }}>
      <div style={{ marginBottom: 56 }}>
        <Eyebrow>— Trois portes d'entrée</Eyebrow>
        <h2 style={{ ...fSerif, fontSize: 56, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "16px 0 0", maxWidth: "20ch", color: INK }}>
          Selon qui vous êtes, ce que <em style={{ color: ORANGE, fontWeight: 500 }}>nous proposons</em>.
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: `1px solid ${INK}` }}>
        {[
          { kind: "STRUCTURE D'ACCUEIL", title: "Vous accompagnez des femmes isolées.", body: "Nous intervenons dans votre structure pour proposer des ateliers collectifs et un accompagnement individuel des femmes, en complément de votre travail.", link: "Pour les structures", color: ORANGE },
          { kind: "ENTREPRISE & MÉCÈNE", title: "Vous voulez agir contre l'isolement.", body: "Mécénat financier, mécénat de compétences, ou mise à disposition de locaux — plusieurs formes d'engagement possibles, à partir de 1 000 €.", link: "Devenir mécène", color: VIOLET },
          { kind: "FEMME CONCERNÉE", title: "Vous souhaitez être accompagnée.", body: "Vous pouvez nous contacter directement, sans passer par une structure. L'accompagnement est gratuit et confidentiel.", link: "Premier contact", color: ORANGE },
        ].map((a, i) => (
          <div key={i} style={{
            padding: "40px 32px 40px 0",
            borderRight: i < 2 ? `1px solid ${LINE}` : "none",
            paddingLeft: i > 0 ? 32 : 0,
          }}>
            <div style={{ ...fMono, fontSize: 11, letterSpacing: "0.12em", color: a.color, marginBottom: 20 }}>{a.kind}</div>
            <h3 style={{ ...fSerif, fontSize: 26, fontWeight: 500, margin: "0 0 16px", letterSpacing: "-0.015em", lineHeight: 1.15, color: INK, maxWidth: "18ch" }}>{a.title}</h3>
            <p style={{ fontSize: 14.5, color: INK_2, lineHeight: 1.6, marginBottom: 20, ...fSans }}>{a.body}</p>
            <LinkArrow color={a.color}>{a.link}</LinkArrow>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ============ CTA — duo soutien / newsletter ============ */

const CtaDuo = () => (
  <section style={{ borderTop: `1px solid ${LINE}` }}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      <div style={{ background: PAPER_PEACH, padding: "100px 60px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 480, position: "relative", overflow: "hidden" }}>
        <div>
          <Eyebrow color={INK}>— Soutenir</Eyebrow>
          <h2 style={{ ...fSerif, fontSize: 56, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "16px 0 20px", maxWidth: "14ch", color: INK }}>
            L'association tient debout grâce à <em style={{ color: ORANGE, fontWeight: 500 }}>vous</em>.
          </h2>
          <p style={{ fontSize: 17, color: INK_2, lineHeight: 1.55, maxWidth: "40ch", marginBottom: 32, ...fSans }}>
            Adhérer, donner ou devenir bénévole — chaque engagement compte.
            Un don de 50 € permet à une femme de bénéficier d'une séance.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="#" style={{ background: INK, color: "white", padding: "14px 24px", borderRadius: 6, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, ...fSans }}>
            Faire un don <Arrow color="white" />
          </a>
          <a href="#" style={{ border: `1px solid ${INK}`, color: INK, padding: "14px 24px", borderRadius: 6, fontSize: 14, textDecoration: "none", ...fSans }}>
            Devenir bénévole
          </a>
        </div>
      </div>
      <div style={{ background: PAPER_LAV, padding: "100px 60px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 480, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute",
          bottom: -80, right: -30,
          ...fSerif,
          fontStyle: "italic",
          fontSize: 320,
          color: "rgba(255,255,255,0.4)",
          lineHeight: 0.85,
          fontWeight: 500,
          pointerEvents: "none",
          letterSpacing: "-0.04em",
        }}>+</div>
        <div style={{ position: "relative" }}>
          <Eyebrow color={VIOLET}>— Newsletter</Eyebrow>
          <h3 style={{ ...fSerif, fontSize: 44, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.1, margin: "16px 0 12px", maxWidth: "16ch", color: INK }}>
            Rester en <em style={{ color: VIOLET, fontWeight: 500 }}>lien</em>.
          </h3>
          <p style={{ fontSize: 16, color: INK_2, lineHeight: 1.55, maxWidth: "36ch", marginBottom: 28, ...fSans }}>
            Une lettre par saison — actualités, ateliers à venir, lectures et ressources.
            Pas de spam, désinscription en un clic.
          </p>
        </div>
        <form style={{ display: "flex", gap: 8, position: "relative" }} onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="votre@email.fr" style={{ flex: 1, padding: "14px 16px", borderRadius: 6, border: `1px solid ${VIOLET_SOFT}`, fontSize: 14, ...fSans, background: "rgba(255,255,255,0.7)", color: INK }} />
          <button style={{ background: VIOLET, color: "white", border: "none", padding: "14px 22px", borderRadius: 6, fontSize: 14, ...fSans, cursor: "pointer" }}>S'abonner</button>
        </form>
      </div>
    </div>
  </section>
);

/* ============ PAGE ACCUEIL ============ */

const HomePage = () => (
  <>
    <Hero />
    <NosActions />
    <ImpenseSocial />
    <NotreReponse />
    <Parcours />
    <Temoignage />
    <Audiences />
    <CtaDuo />
  </>
);

Object.assign(window, {
  HomePage,
  NavBar,
  Footer,
  /* atomes pour la page blocs */
  Eyebrow, Arrow, Plus, BtnPrimary, BtnGhost, BtnViolet, LinkArrow, VLogo,
  RepeatedWord, TypoComposition,
  /* tokens */
  ORANGE, ORANGE_SOFT, VIOLET, VIOLET_SOFT, INK, INK_2, INK_3,
  PAPER_WHITE, PAPER_CREAM, PAPER_PEACH, PAPER_LAV, PAPER_LAV_LIGHT, PAPER_CREAM_LIGHT,
  LINE, LINE_LAV,
  fSerif, fSans, fMono,
});

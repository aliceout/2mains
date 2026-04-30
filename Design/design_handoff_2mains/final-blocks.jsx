/* PAGE DÉMO BLOCS — basée sur Variation D
   21 blocs réutilisables, chacun encadré et numéroté. */

const BlockHeading = ({ num, title, subtitle }) => (
  <div style={{ marginBottom: 24, marginTop: 64 }}>
    <div style={{
      ...fMono,
      fontSize: 11,
      color: INK_3,
      letterSpacing: "0.16em",
      marginBottom: 8,
      textTransform: "uppercase",
    }}>
      <span style={{ color: ORANGE }}>{num}</span> · BLOC
    </div>
    <h3 style={{
      ...fSerif,
      fontSize: 32,
      fontWeight: 500,
      letterSpacing: "-0.02em",
      margin: "0 0 8px",
      color: INK,
    }}>
      {title}
    </h3>
    {subtitle && (
      <p style={{ color: INK_3, fontSize: 14.5, maxWidth: "70ch", lineHeight: 1.55, margin: 0, ...fSans }}>{subtitle}</p>
    )}
  </div>
);

const BlockFrame = ({ children, padded = true, bg = "white" }) => (
  <div style={{
    border: `1px dashed ${LINE}`,
    borderRadius: 8,
    padding: padded ? 40 : 0,
    background: bg,
    overflow: "hidden",
  }}>
    {children}
  </div>
);

/* ============ B01 — Hero principal ============ */
const Block01 = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 480 }}>
    <div style={{ padding: "60px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Eyebrow>— Association · Lyon</Eyebrow>
      <h1 style={{ ...fSerif, fontSize: 60, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.0, margin: "16px 0 20px", color: INK, maxWidth: "14ch" }}>
        Se <em style={{ color: VIOLET, fontWeight: 500 }}>(re)toucher</em> pour se <em style={{ color: ORANGE, fontWeight: 500 }}>(re)lier</em>.
      </h1>
      <p style={{ fontSize: 16, color: INK_2, lineHeight: 1.55, maxWidth: "44ch", marginBottom: 28, ...fSans }}>
        Nous luttons contre l'isolement corporel des femmes par le toucher relationnel.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <BtnPrimary>Faire un don <Arrow color="white" /></BtnPrimary>
        <BtnGhost>Découvrir</BtnGhost>
      </div>
    </div>
    <div style={{ background: PAPER_CREAM, padding: 60, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: -30, right: -10, ...fSerif, fontStyle: "italic", fontSize: 240, color: "#E8DDC6", lineHeight: 0.85, fontWeight: 500, pointerEvents: "none", letterSpacing: "-0.04em" }}>(re)</div>
      <div style={{ position: "relative" }}>
        <Eyebrow color={INK_3}>— prochain rendez-vous</Eyebrow>
        <div style={{ ...fSerif, fontSize: 26, fontWeight: 500, marginTop: 12, color: INK, maxWidth: "16ch", letterSpacing: "-0.015em", lineHeight: 1.15 }}>
          Atelier découverte — 15 mai 2026.
        </div>
      </div>
    </div>
  </div>
);

/* ============ B02 — Texte éditorial ============ */
const Block02 = () => (
  <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 48 }}>
    <div>
      <div style={{ ...fSerif, fontStyle: "italic", fontSize: 56, color: ORANGE, lineHeight: 1, marginBottom: 8, fontWeight: 500 }}>§ I</div>
      <Eyebrow color={INK_3}>L'association</Eyebrow>
    </div>
    <div>
      <h3 style={{ ...fSerif, fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 16px", color: INK }}>Notre mission</h3>
      <p style={{ color: INK_2, maxWidth: "65ch", lineHeight: 1.65, marginBottom: 28, fontSize: 16, ...fSans }}>
        Améliorer la santé, l'insertion sociale et le pouvoir d'agir des femmes en promouvant,
        défendant et mettant en action le toucher relationnel comme réponse à l'isolement
        corporel et social, et comme vecteur de liens sociaux, dans un contexte d'inégalités de genre.
      </p>
      <h3 style={{ ...fSerif, fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 16px", color: INK }}>Notre vision</h3>
      <p style={{ color: INK_2, maxWidth: "65ch", lineHeight: 1.65, margin: 0, fontSize: 16, ...fSans }}>
        Un monde où le toucher et la tendresse sont créateurs de liens sociaux équilibrés,
        où les femmes se sentent bien dans leur corps, et dans leur pouvoir d'agir.
      </p>
    </div>
  </div>
);

/* ============ B03 — Triptyque de cartes ============ */
const Block03 = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
    {[
      { num: "01", t: "Premier titre", b: "Description courte de la carte, factuelle et orientée action.", bg: PAPER_CREAM_LIGHT, color: ORANGE },
      { num: "02", t: "Deuxième titre", b: "Description courte de la carte, factuelle et orientée action.", bg: PAPER_LAV_LIGHT, color: VIOLET },
      { num: "03", t: "Troisième titre", b: "Description courte de la carte, factuelle et orientée action.", bg: PAPER_CREAM_LIGHT, color: ORANGE },
    ].map((it, i) => (
      <article key={i} style={{ background: it.bg, padding: 28, borderRadius: 8, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
          <span style={{ ...fSerif, fontStyle: "italic", fontSize: 44, fontWeight: 500, color: it.color, lineHeight: 1, letterSpacing: "-0.02em" }}>{it.num}</span>
          <span style={{ flex: 1, height: 1, background: it.color, opacity: 0.3 }}></span>
        </div>
        <h3 style={{ ...fSerif, fontSize: 22, fontWeight: 500, margin: "0 0 12px", letterSpacing: "-0.015em", color: INK }}>{it.t}</h3>
        <p style={{ fontSize: 14, color: INK_2, lineHeight: 1.6, marginBottom: 16, flex: 1, ...fSans }}>{it.b}</p>
        <LinkArrow color={it.color}>En savoir plus</LinkArrow>
      </article>
    ))}
  </div>
);

/* ============ B04 — Stats ============ */
const Block04 = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, borderTop: `1px solid ${INK}`, paddingTop: 32 }}>
    {[
      { num: "7M+", l: "Personnes en isolement relationnel en France.", s: "Fondation de France · 2024" },
      { num: "40 %", l: "de la population sans-abri à Lyon sont des femmes.", s: "Diagnostic Métropole · 2023" },
      { num: "90 %", l: "des usagers des services dédiés sont des hommes.", s: "Diagnostic Métropole · 2023" },
    ].map((s, i) => (
      <div key={i}>
        <div style={{ ...fSerif, fontStyle: "italic", fontWeight: 500, fontSize: 80, lineHeight: 0.95, color: ORANGE, letterSpacing: "-0.03em", marginBottom: 16 }}>{s.num}</div>
        <p style={{ fontSize: 14.5, color: INK_2, lineHeight: 1.55, marginBottom: 10, ...fSans }}>{s.l}</p>
        <div style={{ ...fMono, fontSize: 11, color: INK_3, letterSpacing: "0.04em" }}>— {s.s}</div>
      </div>
    ))}
  </div>
);

/* ============ B05 — Audience strip ============ */
const Block05 = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: `1px solid ${INK}` }}>
    {[
      { kind: "STRUCTURE D'ACCUEIL", t: "Vous accompagnez des femmes isolées.", b: "Nous intervenons dans votre structure pour proposer ateliers et accompagnement individuel.", color: ORANGE },
      { kind: "ENTREPRISE", t: "Vous voulez agir contre l'isolement.", b: "Mécénat financier, mécénat de compétences, mise à disposition de locaux.", color: VIOLET },
      { kind: "FEMME CONCERNÉE", t: "Vous souhaitez être accompagnée.", b: "Vous pouvez nous contacter directement, sans passer par une structure.", color: ORANGE },
    ].map((a, i) => (
      <div key={i} style={{ padding: i === 0 ? "32px 32px 0 0" : i === 2 ? "32px 0 0 32px" : "32px", borderRight: i < 2 ? `1px solid ${LINE}` : "none" }}>
        <div style={{ ...fMono, fontSize: 11, letterSpacing: "0.12em", color: a.color, marginBottom: 16 }}>{a.kind}</div>
        <h3 style={{ ...fSerif, fontSize: 22, fontWeight: 500, margin: "0 0 12px", letterSpacing: "-0.015em", color: INK }}>{a.t}</h3>
        <p style={{ fontSize: 14, color: INK_2, lineHeight: 1.6, marginBottom: 16, ...fSans }}>{a.b}</p>
        <LinkArrow color={a.color}>Découvrir</LinkArrow>
      </div>
    ))}
  </div>
);

/* ============ B06 — Citation / témoignage ============ */
const Block06 = () => (
  <div style={{ background: PAPER_CREAM_LIGHT, padding: "60px 60px", borderRadius: 8, display: "grid", gridTemplateColumns: "auto 1fr", gap: 48, alignItems: "start" }}>
    <div style={{ ...fSerif, color: ORANGE, fontSize: 160, lineHeight: 0.7, fontWeight: 500, fontStyle: "italic" }}>“</div>
    <div>
      <Eyebrow color={INK_3}>— une voix</Eyebrow>
      <blockquote style={{ ...fSerif, fontStyle: "italic", fontSize: 30, lineHeight: 1.3, margin: "12px 0 24px", fontWeight: 400, letterSpacing: "-0.015em", color: INK, maxWidth: "32ch" }}>
        Pendant longtemps, je pensais que mon corps était juste un problème.
        Là, c'est la première fois depuis des années que quelqu'un me touche
        sans rien me demander en retour.
      </blockquote>
      <cite style={{ ...fMono, fontSize: 12, color: INK_3, letterSpacing: "0.06em", fontStyle: "normal" }}>
        — LOLA · PARTICIPANTE, 42 ANS
      </cite>
    </div>
  </div>
);

/* ============ B07 — Parcours en étapes ============ */
const Block07 = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
    {[
      { t: "Premier contact", b: "Vous nous écrivez ou êtes orientée — échange initial." },
      { t: "Entrée parcours", b: "Définition d'un cadre, du rythme et de vos objectifs." },
      { t: "Séances", b: "Chaque séance construite à partir de votre demande." },
      { t: "Bilan", b: "À mi-parcours, on fait le point — on adapte." },
      { t: "Sortie choisie", b: "Le parcours dure 3 à 12 séances selon vos besoins." },
    ].map((s, i) => (
      <div key={i} style={{ borderTop: `2px solid ${i === 2 ? VIOLET : ORANGE}`, paddingTop: 14 }}>
        <div style={{ ...fSerif, fontStyle: "italic", fontWeight: 500, fontSize: 26, color: i === 2 ? VIOLET : ORANGE, lineHeight: 1, marginBottom: 10 }}>0{i+1}.</div>
        <h4 style={{ ...fSerif, fontSize: 16, fontWeight: 500, margin: "0 0 8px", color: INK, letterSpacing: "-0.01em" }}>{s.t}</h4>
        <p style={{ fontSize: 12.5, color: INK_2, lineHeight: 1.55, margin: 0, ...fSans }}>{s.b}</p>
      </div>
    ))}
  </div>
);

/* ============ B08 — Callouts ============ */
const Block08 = () => (
  <div style={{ display: "grid", gap: 16 }}>
    <div style={{ background: PAPER_LAV_LIGHT, borderLeft: `3px solid ${VIOLET}`, padding: "20px 28px", borderRadius: 6 }}>
      <div style={{ ...fMono, fontSize: 11, letterSpacing: "0.12em", color: VIOLET, marginBottom: 8, textTransform: "uppercase" }}>— Info importante</div>
      <p style={{ ...fSans, fontSize: 15, color: INK_2, lineHeight: 1.55, margin: 0 }}>
        L'accompagnement reste entièrement volontaire et le consentement est revérifié à chaque rencontre. Vous pouvez interrompre à tout moment.
      </p>
    </div>
    <div style={{ background: PAPER_CREAM_LIGHT, borderLeft: `3px solid ${ORANGE}`, padding: "20px 28px", borderRadius: 6 }}>
      <div style={{ ...fMono, fontSize: 11, letterSpacing: "0.12em", color: ORANGE, marginBottom: 8, textTransform: "uppercase" }}>— À noter</div>
      <p style={{ ...fSans, fontSize: 15, color: INK_2, lineHeight: 1.55, margin: 0 }}>
        Cette pratique n'a pas vocation à se substituer à un suivi médical ou psychothérapeutique — elle vient en complément, à votre demande.
      </p>
    </div>
  </div>
);

/* ============ B09 — FAQ ============ */
const Block09 = () => {
  const [openIdx, setOpenIdx] = React.useState(0);
  const items = [
    { q: "Comment se déroule un premier contact ?", a: "Un appel ou un échange en présentiel pour comprendre vos attentes. Aucun engagement, et le rythme reste le vôtre." },
    { q: "Le toucher relationnel, c'est un soin ?", a: "Non. Ce n'est ni médical, ni psychothérapeutique. C'est une pratique de présence, à mi-chemin entre l'éducation populaire et l'accompagnement social." },
    { q: "Est-ce gratuit ?", a: "Oui — l'accompagnement individuel et les ateliers sont gratuits pour les femmes accueillies. L'association est financée par des fonds de dotation et du mécénat." },
    { q: "Faut-il être inscrite à une structure d'accueil ?", a: "Non, plusieurs voies existent. Vous pouvez nous contacter directement." },
  ];
  return (
    <div>
      {items.map((it, i) => {
        const open = openIdx === i;
        return (
          <div key={i} style={{ borderTop: `1px solid ${LINE}`, ...(i === items.length - 1 ? { borderBottom: `1px solid ${LINE}` } : {}) }}>
            <button onClick={() => setOpenIdx(open ? -1 : i)} style={{ width: "100%", background: "none", border: "none", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", ...fSerif, fontSize: 22, fontWeight: 500, color: INK, letterSpacing: "-0.015em" }}>
              <span>{it.q}</span>
              <span style={{ color: open ? ORANGE : INK_3 }}><Plus open={open} /></span>
            </button>
            {open && (
              <div style={{ padding: "0 0 24px", color: INK_2, fontSize: 15, lineHeight: 1.65, maxWidth: "65ch", ...fSans }}>{it.a}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ============ B10 — Statistique en majesté ============ */
const Block10 = () => (
  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 56, alignItems: "center" }}>
    <div style={{ ...fSerif, fontStyle: "italic", fontSize: 180, lineHeight: 0.85, letterSpacing: "-0.04em", color: ORANGE, fontWeight: 500 }}>90 %</div>
    <div>
      <Eyebrow>— constat</Eyebrow>
      <p style={{ fontSize: 22, color: INK, maxWidth: "44ch", lineHeight: 1.4, margin: "12px 0 16px", ...fSerif, fontWeight: 400, letterSpacing: "-0.015em" }}>
        des usagers des services dédiés à la grande précarité à Lyon sont des hommes,
        alors que <em style={{ color: VIOLET }}>40 %</em> de la population sans-abri sont des femmes.
      </p>
      <div style={{ ...fMono, fontSize: 12, color: INK_3, letterSpacing: "0.04em" }}>— Diagnostic Métropole, 2023</div>
    </div>
  </div>
);

/* ============ B11 — Documents ============ */
const Block11 = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
    {[
      { meta: "PROJET ASSOCIATIF · SEPTEMBRE 2025", t: "Document de projet — Lyon Habitat Métropole 2025", b: "« Se (re)toucher pour se (re)lier : une innovation au service des femmes isolées. »", status: "Disponible sur demande", color: ORANGE },
      { meta: "RAPPORT D'ACTIVITÉ · À PARAÎTRE", t: "Rapport d'activité 2025", b: "Bilan des actions, participantes, partenariats et finances de l'année écoulée.", status: "À paraître", color: VIOLET },
    ].map((d, i) => (
      <div key={i} style={{ background: "white", border: `1px solid ${LINE}`, padding: 28, borderRadius: 8, display: "flex", flexDirection: "column" }}>
        <div style={{ ...fMono, fontSize: 11, letterSpacing: "0.1em", color: d.color, marginBottom: 16 }}>— {d.meta}</div>
        <h4 style={{ ...fSerif, fontSize: 22, fontWeight: 500, margin: "0 0 12px", color: INK, letterSpacing: "-0.015em", lineHeight: 1.2 }}>{d.t}</h4>
        <p style={{ ...fSans, fontSize: 14, color: INK_2, lineHeight: 1.6, marginBottom: 20, flex: 1 }}>{d.b}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: `1px solid ${LINE}` }}>
          <span style={{ ...fMono, fontSize: 11, color: INK_3, letterSpacing: "0.04em", textTransform: "uppercase" }}>{d.status}</span>
          <a href="#" style={{ ...fSerif, fontStyle: "italic", color: d.color, textDecoration: "none", fontSize: 14 }}>Télécharger →</a>
        </div>
      </div>
    ))}
  </div>
);

/* ============ B12 — CTA band ============ */
const Block12 = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
    <div style={{ background: PAPER_PEACH, padding: "60px 50px", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 320 }}>
      <Eyebrow color={INK}>— Soutenir</Eyebrow>
      <h2 style={{ ...fSerif, fontSize: 40, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.05, margin: "12px 0 20px", maxWidth: "14ch", color: INK }}>
        L'association tient debout grâce à <em style={{ color: ORANGE, fontWeight: 500 }}>vous</em>.
      </h2>
      <div style={{ display: "flex", gap: 12 }}>
        <a href="#" style={{ background: INK, color: "white", padding: "12px 22px", borderRadius: 6, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, ...fSans }}>Faire un don <Arrow color="white" /></a>
        <BtnGhost>Bénévole</BtnGhost>
      </div>
    </div>
    <div style={{ background: PAPER_LAV, padding: "60px 50px", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 320 }}>
      <Eyebrow color={VIOLET}>— Prochain rendez-vous</Eyebrow>
      <div style={{ ...fMono, fontSize: 12, color: VIOLET, marginTop: 12, marginBottom: 8, letterSpacing: "0.04em" }}>15 MAI 2026 · 14:00 · LA MÉDIANE, LYON 3</div>
      <h3 style={{ ...fSerif, fontSize: 26, fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.2, margin: "0 0 16px", maxWidth: "20ch", color: INK }}>
        Atelier découverte — auto-massages et toucher du consentement.
      </h3>
      <LinkArrow color={VIOLET}>S'inscrire</LinkArrow>
    </div>
  </div>
);

/* ============ B13 — Image + texte ( bloc compositionnel ) ============ */
const Block13 = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "stretch" }}>
    <TypoComposition kind="definition" />
    <div style={{ paddingTop: 12 }}>
      <Eyebrow>— Notre méthode</Eyebrow>
      <h3 style={{ ...fSerif, fontSize: 36, fontWeight: 500, marginTop: 12, marginBottom: 20, letterSpacing: "-0.02em", color: INK, lineHeight: 1.1 }}>
        Une méthode fondée sur le <em style={{ color: ORANGE }}>consentement</em>
      </h3>
      <ul style={{ paddingLeft: 0, listStyle: "none", display: "grid", gap: 14, fontSize: 15, color: INK_2, lineHeight: 1.55, ...fSans }}>
        {[
          "Un cadre clairement fondé sur le consentement.",
          "Une approche centrée sur la personne.",
          "La co-construction des objectifs partenaires.",
          "Une logique de cheminement long-terme.",
        ].map((t, i) => (
          <li key={i} style={{ paddingLeft: 22, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, color: ORANGE, ...fSerif, fontStyle: "italic", fontWeight: 500 }}>+</span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

/* ============ B14 — Quatre valeurs ============ */
const Block14 = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
    {[
      { name: "Tendresse", body: "Hériter la tendresse comme puissance d'action. Pour nous, la tendresse est une force — une émotion d'accueil, d'écoute, de respect.", color: ORANGE, bg: PAPER_CREAM_LIGHT },
      { name: "Sororité", body: "Se reconnaître, s'entraider, s'écouter entre femmes. La sororité n'est pas une attitude posée a priori : c'est une pratique exigeante.", color: VIOLET, bg: PAPER_LAV_LIGHT },
      { name: "Souveraineté du corps", body: "Reconnaître à chaque femme l'autorité de ce qui se vit dans son corps : choix, respect, refus, désirs et sensations.", color: VIOLET, bg: PAPER_LAV_LIGHT },
      { name: "Lien social", body: "Partir du corps pour aller vers le lien. Le toucher relationnel comme appui pour la co-présence et la lutte contre l'isolement.", color: ORANGE, bg: PAPER_CREAM_LIGHT },
    ].map((v, i) => (
      <div key={i} style={{ background: v.bg, padding: 28, borderRadius: 8 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
          <span style={{ ...fSerif, fontStyle: "italic", fontSize: 32, fontWeight: 500, color: v.color, lineHeight: 1, letterSpacing: "-0.02em" }}>0{i+1}</span>
          <span style={{ ...fSerif, fontWeight: 500, fontSize: 22, color: INK, letterSpacing: "-0.015em" }}>{v.name}</span>
        </div>
        <p style={{ ...fSans, fontSize: 14, color: INK_2, lineHeight: 1.6, margin: 0 }}>{v.body}</p>
      </div>
    ))}
  </div>
);

/* ============ B15 — Équipe ============ */
const Block15 = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, borderTop: `1px solid ${LINE}` }}>
    {[
      { n: "Audrey Rolandeau", r: "Fondatrice · Présidente" },
      { n: "Sylvie Bouro", r: "Vice-présidente" },
      { n: "Elsa Moulin", r: "Vice-présidente" },
      { n: "Michel Rolandeau", r: "Secrétaire" },
      { n: "Estelle Pourcelot", r: "Trésorière" },
      { n: "Noémie Auguste", r: "Administratrice" },
    ].map((m, i) => (
      <div key={i} style={{
        padding: "20px 24px",
        borderBottom: `1px solid ${LINE}`,
        borderRight: (i+1) % 3 !== 0 ? `1px solid ${LINE}` : "none",
      }}>
        <div style={{ ...fSerif, fontSize: 19, fontWeight: 500, color: INK, marginBottom: 4, letterSpacing: "-0.01em" }}>{m.n}</div>
        <div style={{ ...fMono, fontSize: 11, color: INK_3, letterSpacing: "0.06em", textTransform: "uppercase" }}>— {m.r}</div>
      </div>
    ))}
  </div>
);

/* ============ B16 — Partenaires ============ */
const Block16 = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
    {[
      "Lyon Métropole Habitat", "L'Éclaircie — Le MAS", "SALVA — Le MAS", "Olympe — Le MAS",
      "ALPIL", "Un Chez Soi d'Abord", "EHPAD Médot", "La Maison des femmes",
    ].map((name, i) => (
      <div key={i} style={{
        background: i % 2 === 0 ? PAPER_CREAM_LIGHT : PAPER_LAV_LIGHT,
        padding: "20px",
        borderRadius: 6,
      }}>
        <div style={{ ...fMono, fontSize: 10, letterSpacing: "0.1em", color: i % 2 === 0 ? ORANGE : VIOLET, marginBottom: 8 }}>— PARTENAIRE</div>
        <div style={{ ...fSerif, fontSize: 16, fontWeight: 500, color: INK, letterSpacing: "-0.01em" }}>{name}</div>
      </div>
    ))}
  </div>
);

/* ============ B17 — Événement ============ */
const Block17 = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
    {[
      {
        date: "15 MAI 2026 · 14:00–18:00 · LA MÉDIANE, LYON 3",
        title: "Atelier découverte — auto-massages et toucher du consentement",
        tags: [{ l: "femmes concernées", c: ORANGE, bg: PAPER_CREAM_LIGHT }, { l: "gratuit", c: VIOLET, bg: PAPER_LAV_LIGHT }],
        desc: "Format court pour expérimenter les bases du toucher relationnel, exercices de respiration, temps d'échange.",
        cta: "S'inscrire / en savoir plus",
        accent: ORANGE,
      },
      {
        date: "27 MAI 2026 · 18:30 · PÔLE PIXEL, LYON 8",
        title: "Apéro des bénévoles",
        tags: [{ l: "actif·ves", c: VIOLET, bg: PAPER_LAV_LIGHT }, { l: "gratuit", c: VIOLET, bg: PAPER_LAV_LIGHT }],
        desc: "Moment convivial mensuel : accueil, point sur les chantiers, partage d'actualités.",
        cta: "S'inscrire",
        accent: VIOLET,
      },
    ].map((e, i) => (
      <div key={i} style={{ background: "white", border: `1px solid ${LINE}`, borderRadius: 8, padding: 28, borderTop: `3px solid ${e.accent}` }}>
        <div style={{ ...fMono, fontSize: 11, letterSpacing: "0.06em", color: INK_3, marginBottom: 14 }}>— {e.date}</div>
        <h4 style={{ ...fSerif, fontSize: 22, fontWeight: 500, margin: "0 0 14px", color: INK, letterSpacing: "-0.015em", lineHeight: 1.2 }}>{e.title}</h4>
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {e.tags.map((t, j) => (
            <span key={j} style={{ ...fMono, fontSize: 10, padding: "3px 10px", borderRadius: 999, background: t.bg, color: t.c, letterSpacing: "0.06em", textTransform: "uppercase" }}>{t.l}</span>
          ))}
        </div>
        <p style={{ ...fSans, fontSize: 14, color: INK_2, lineHeight: 1.55, marginBottom: 16 }}>{e.desc}</p>
        <LinkArrow color={e.accent}>{e.cta}</LinkArrow>
      </div>
    ))}
  </div>
);

/* ============ B18 — Boutons ============ */
const Block18 = () => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
    <BtnPrimary>Bouton primaire <Arrow color="white" /></BtnPrimary>
    <BtnViolet>Bouton violet</BtnViolet>
    <BtnGhost>Bouton fantôme</BtnGhost>
    <LinkArrow color={ORANGE}>Lien orange</LinkArrow>
    <LinkArrow color={VIOLET}>Lien violet</LinkArrow>
  </div>
);

/* ============ B19 — Fil d'Ariane ============ */
const Block19 = () => (
  <div style={{ ...fMono, fontSize: 12, color: INK_3, letterSpacing: "0.06em", textTransform: "uppercase" }}>
    accueil <span style={{ margin: "0 8px", color: LINE }}>/</span>
    l'association <span style={{ margin: "0 8px", color: LINE }}>/</span>
    <span style={{ color: ORANGE }}>qui sommes-nous</span>
  </div>
);

/* ============ B20 — Liste à puces typée ============ */
const Block20 = () => (
  <ul style={{ paddingLeft: 0, listStyle: "none", display: "grid", gap: 18, fontSize: 16, color: INK_2, lineHeight: 1.6, maxWidth: "70ch", margin: 0, ...fSans }}>
    {[
      { v: "Rendre actrice", d: "les femmes concernées décident du contenu des séances, co-construisent les ateliers, choisissent les ressources." },
      { v: "Aller vers", d: "nous nous déplaçons sur les lieux où des femmes sont déjà accueillies, plutôt que d'attendre qu'elles viennent." },
      { v: "Innover", d: "penser et documenter une approche encore marginale en France." },
      { v: "Coopérer", d: "avec les associations, les professionnel·les du soin et du social." },
    ].map((it, i) => (
      <li key={i} style={{ paddingLeft: 26, position: "relative" }}>
        <span style={{ position: "absolute", left: 0, color: ORANGE, ...fSerif, fontStyle: "italic", fontWeight: 500, fontSize: 18 }}>+</span>
        <strong style={{ color: INK, fontWeight: 500, ...fSerif, fontStyle: "italic" }}>{it.v}</strong>
        <span style={{ color: INK_3 }}> — </span>
        {it.d}
      </li>
    ))}
  </ul>
);

/* ============ B21 — Séparateur arcs ============ */
const Block21 = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, color: INK_3, padding: "16px 0" }}>
    <div style={{ flex: 1, height: 1, background: LINE }}></div>
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path d="M22 8 a8 8 0 1 0 0 16" stroke={ORANGE_SOFT} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M10 24 a8 8 0 1 0 0 -16" stroke={VIOLET_SOFT} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
    <div style={{ flex: 1, height: 1, background: LINE }}></div>
  </div>
);

/* ============ PAGE BLOCS ============ */

const BlocksPage = () => {
  const blocks = [
    { num: "B01", t: "Hero principal", s: "Split texte / bloc crème avec watermark serif italique. Eyebrow + titre serif + lede + CTA.", el: <Block01 />, padded: false },
    { num: "B02", t: "Section texte éditorial", s: "Pour les pages d'association, mission, vision, problématique. Marginalia § à gauche.", el: <Block02 /> },
    { num: "B03", t: "Triptyque de cartes", s: "Trois cartes pleines, fond pêche/lavande alterné, gros numéros italique + filet horizontal.", el: <Block03 /> },
    { num: "B04", t: "Bandeau de chiffres", s: "Trois statistiques avec source en mono. Idéal pour le constat.", el: <Block04 /> },
    { num: "B05", t: "Trio de publics", s: "Variante du triptyque, sans fond — colonnes séparées par filets.", el: <Block05 />, padded: false },
    { num: "B06", t: "Citation / témoignage", s: "Voix d'une participante, encadrée d'un grand guillemet italique.", el: <Block06 />, padded: false },
    { num: "B07", t: "Parcours en étapes", s: "5 étapes alignées avec filet coloré supérieur. Numéros serif italique.", el: <Block07 /> },
    { num: "B08", t: "Callouts", s: "Encarts info / à noter, fond teinté + filet vertical.", el: <Block08 /> },
    { num: "B09", t: "Questions fréquentes", s: "Liste accordéon, séparateurs fins, titre serif. Évite les boîtes arrondies épaisses.", el: <Block09 /> },
    { num: "B10", t: "Statistique en majesté", s: "Chiffre seul, en italique géant — pour un fait marquant.", el: <Block10 /> },
    { num: "B11", t: "Carte document", s: "Pour rapports d'activité, projet associatif, plaquettes.", el: <Block11 /> },
    { num: "B12", t: "Bandeau d'appel à action", s: "Soutenir l'association — sur fond chaud doux, duo pêche / lavande.", el: <Block12 />, padded: false },
    { num: "B13", t: "Composition + texte", s: "Composition typographique à gauche, texte à droite. Remplace l'image.", el: <Block13 /> },
    { num: "B14", t: "Quatre valeurs", s: "Grille 2×2, gros numéros italique, fond pêche/lavande alterné.", el: <Block14 /> },
    { num: "B15", t: "Liste membres équipe", s: "Nom serif + rôle en mono. Sobre, accessible, économique.", el: <Block15 />, padded: false },
    { num: "B16", t: "Grille partenaires", s: "Type de partenaire en sur-titre, nom de la structure en serif.", el: <Block16 /> },
    { num: "B17", t: "Événement / agenda", s: "Date + lieu en mono, titre serif, tags couleur, description, lien.", el: <Block17 /> },
    { num: "B18", t: "Boutons & liens", s: "Trois primaires, un fantôme, lien-flèche italique.", el: <Block18 /> },
    { num: "B19", t: "Fil d'Ariane", s: "Discret, en haut des pages internes. Mono, slash en couleur ligne.", el: <Block19 /> },
    { num: "B20", t: "Liste à puces typée", s: "Verbe en italique serif + définition. Pour nos principes d'action.", el: <Block20 /> },
    { num: "B21", t: "Séparateur arcs", s: "Petit motif qui rappelle la signature graphique (logo).", el: <Block21 /> },
  ];

  return (
    <>
      {/* Hero blocs */}
      <section style={{ background: PAPER_WHITE, padding: "80px 40px 60px", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ ...fMono, fontSize: 12, color: INK_3, letterSpacing: "0.06em", marginBottom: 20, textTransform: "uppercase" }}>
            accueil <span style={{ margin: "0 8px", color: LINE }}>/</span>
            <span style={{ color: ORANGE }}>design system</span>
          </div>
          <Eyebrow>— Bibliothèque de blocs</Eyebrow>
          <h1 style={{ ...fSerif, fontSize: 80, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.0, margin: "16px 0 24px", color: INK, maxWidth: "16ch" }}>
            Tous les <em style={{ color: ORANGE, fontWeight: 500 }}>blocs</em>.
          </h1>
          <p style={{ ...fSans, fontSize: 18, color: INK_2, lineHeight: 1.55, maxWidth: "60ch", margin: 0 }}>
            Référence visuelle des 21 composants disponibles pour construire les pages du site.
            Chaque bloc respecte le système typographique et chromatique de la direction Éditorial.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 40px 120px" }}>
        {blocks.map((b, i) => (
          <div key={i}>
            <BlockHeading num={b.num} title={b.t} subtitle={b.s} />
            <BlockFrame padded={b.padded !== false}>{b.el}</BlockFrame>
          </div>
        ))}
      </div>
    </>
  );
};

Object.assign(window, { BlocksPage });

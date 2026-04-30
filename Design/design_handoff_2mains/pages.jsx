/* PAGES SECONDAIRES — Structure d'accueil, Femme concernée, Entreprise.
   Réutilisent les atomes (Eyebrow, BtnPrimary, BtnGhost, LinkArrow, Arrow, Plus, Blob,
   HandUnderline, HandCircle), les fonts (fSerif, fSans, fMono) et la palette élargie
   (ORANGE, VIOLET, ROSE_V, HONEY_V, MOSS_V, MAUVE_V, etc.).

   Chaque page démontre comment décliner le système :
   - Hero distinctif avec ton de couleur dominante
   - Blocs réutilisés (chiffres, FAQ, parcours, citation, CTA)
   - Vocabulaire visuel cohérent : blobs en fond, soulignés manuscrits sur les mots-clés. */

const Crumbs = ({ items }) => (
  <div style={{ ...fMono, fontSize: 12, color: INK_3, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 24 }}>
    {items.map((item, i) => (
      <React.Fragment key={i}>
        {i > 0 && <span style={{ margin: "0 8px", color: LINE }}>/</span>}
        <span style={{ color: i === items.length - 1 ? ORANGE : INK_3 }}>{item}</span>
      </React.Fragment>
    ))}
  </div>
);

/* ============ PAGE — STRUCTURE D'ACCUEIL (accent VIOLET / LAV / MOSS) ============ */

const StructurePage = () => (
  <>
    {/* Hero */}
    <section style={{ background: PAPER_V, position: "relative", overflow: "hidden", borderBottom: `1px solid ${LINE}` }}>
      <Blob size={460} color={LAV_V} seed={0} opacity={0.7} style={{ position: "absolute", top: -120, right: -100 }} />
      <Blob size={300} color={MAUVE_V} seed={2} opacity={0.4} style={{ position: "absolute", bottom: -60, left: -40 }} />
      <Blob size={120} color={MOSS_V} seed={3} opacity={0.55} style={{ position: "absolute", top: 200, left: "55%" }} />

      <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: "100px 60px 110px" }}>
        <Crumbs items={["Accueil", "Structure d'accueil"]} />
        <Eyebrow color={VIOLET}>— Pour les structures qui accompagnent</Eyebrow>
        <h1 style={{ ...fSerif, fontSize: 96, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 0.96, margin: "16px 0 32px", color: INK, maxWidth: "16ch" }}>
          On <em style={{ color: VIOLET, fontWeight: 500, position: "relative", display: "inline-block" }}>
            intervient
            <HandUnderline width={350} color={MAUVE_V} style={{ position: "absolute", bottom: -10, left: 0 }} />
          </em><br/>
          chez vous, avec vous.
        </h1>
        <p style={{ fontSize: 21, color: INK_2_V, lineHeight: 1.5, maxWidth: "55ch", margin: "0 0 36px", ...fSans }}>
          Foyer d'hébergement, EHPAD, accueil de jour, association, hôpital — nous montons un parcours
          de toucher relationnel adapté aux femmes que vous accueillez, en complément de votre travail.
        </p>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <BtnViolet>Demander un rendez-vous <Arrow color="white" /></BtnViolet>
          <BtnGhost>Télécharger le dossier</BtnGhost>
        </div>
      </div>
    </section>

    {/* Texte éditorial — pourquoi nous solliciter */}
    <section style={{ padding: "120px 40px", background: PAPER_V }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "200px 1fr", gap: 48 }}>
        <div>
          <div style={{ ...fSerif, fontStyle: "italic", fontSize: 56, color: VIOLET, lineHeight: 1, marginBottom: 8, fontWeight: 500 }}>§ I</div>
          <Eyebrow color={INK_3}>Pourquoi nous</Eyebrow>
        </div>
        <div>
          <h3 style={{ ...fSerif, fontSize: 40, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 16px", color: INK }}>Le corps, le grand absent.</h3>
          <p style={{ color: INK_2_V, maxWidth: "65ch", lineHeight: 1.65, marginBottom: 24, fontSize: 17, ...fSans }}>
            Dans la plupart des accompagnements sociaux ou médico-sociaux, la place du corps est limitée
            au soin technique. Le toucher bienveillant — celui qui n'a rien à demander en retour — est
            rarement un objet de travail à part entière. Pourtant, les femmes que vous accompagnez en parlent.
          </p>
          <p style={{ color: INK_2_V, maxWidth: "65ch", lineHeight: 1.65, margin: 0, fontSize: 17, ...fSans }}>
            Nous proposons un cadre clair, professionnel et conforme à votre projet de structure. Nous ne
            remplaçons rien : nous ouvrons un espace que vous pouvez documenter, évaluer, et faire
            évoluer avec nous.
          </p>
        </div>
      </div>
    </section>

    {/* Triptyque — ce qu'on propose */}
    <section style={{ padding: "120px 40px", background: CREAM_V, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, position: "relative", overflow: "hidden" }}>
      <Blob size={280} color={LAV_V} seed={1} opacity={0.4} style={{ position: "absolute", bottom: 40, right: -60 }} />
      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
        <div style={{ marginBottom: 56, maxWidth: 700 }}>
          <Eyebrow color={VIOLET}>— Trois formats</Eyebrow>
          <h2 style={{ ...fSerif, fontSize: 56, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.0, margin: "16px 0 0", color: INK }}>
            Selon ce que vous accompagnez,<br/><em style={{ color: VIOLET, fontWeight: 500 }}>ce que nous proposons</em>.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { num: "01", t: "Atelier collectif", b: "Demi-journée ou journée — exercices d'auto-massage, respiration, temps de parole. 6 à 12 personnes, dans vos locaux ou les nôtres.", price: "à partir de 600 € / atelier", color: VIOLET, bg: LAV_V },
            { num: "02", t: "Accompagnement individuel", b: "Cycle de 3 à 12 séances avec une personne accompagnée. Cadre construit ensemble, supervision possible avec votre équipe.", price: "à partir de 80 € / séance", color: ORANGE, bg: PEACH_V },
            { num: "03", t: "Formation d'équipe", b: "Demi-journée ou journée, pour vos professionnel·les : posture, gestes, cadre du consentement, retours d'expérience.", price: "à partir de 1 200 € / journée", color: VIOLET, bg: HONEY_V },
          ].map((it, i) => (
            <article key={i} style={{ background: it.bg, padding: 32, borderRadius: 14, display: "flex", flexDirection: "column", minHeight: 360, position: "relative", overflow: "hidden" }}>
              <Blob size={120} color={it.color} seed={i + 2} opacity={0.2} style={{ position: "absolute", bottom: -30, right: -30 }} />
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 22, position: "relative" }}>
                <span style={{ ...fSerif, fontStyle: "italic", fontSize: 56, fontWeight: 500, color: it.color, lineHeight: 1, letterSpacing: "-0.02em" }}>{it.num}</span>
                <span style={{ flex: 1, height: 1, background: it.color, opacity: 0.3 }}></span>
              </div>
              <h3 style={{ ...fSerif, fontSize: 26, fontWeight: 500, margin: "0 0 12px", letterSpacing: "-0.015em", lineHeight: 1.15, color: INK, position: "relative" }}>{it.t}</h3>
              <p style={{ fontSize: 14.5, color: INK_2_V, lineHeight: 1.6, marginBottom: 20, flex: 1, position: "relative", ...fSans }}>{it.b}</p>
              <div style={{ paddingTop: 16, borderTop: `1px solid ${it.color}22`, position: "relative" }}>
                <div style={{ ...fMono, fontSize: 11, letterSpacing: "0.06em", color: INK_3, textTransform: "uppercase", marginBottom: 8 }}>Indicatif</div>
                <div style={{ ...fSerif, fontWeight: 500, fontSize: 16, color: it.color, fontStyle: "italic" }}>{it.price}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* Témoignage partenaire */}
    <section style={{ padding: "120px 40px", background: PAPER_V, position: "relative", overflow: "hidden" }}>
      <Blob size={350} color={HONEY_V} seed={4} opacity={0.25} style={{ position: "absolute", top: 60, right: -80 }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div style={{ background: CREAM_V, padding: "72px 64px", borderRadius: 14, display: "grid", gridTemplateColumns: "auto 1fr", gap: 56, alignItems: "start", position: "relative", overflow: "hidden" }}>
          <Blob size={160} color={LAV_V} seed={3} opacity={0.5} style={{ position: "absolute", bottom: -40, right: -40 }} />
          <div style={{ ...fSerif, color: VIOLET, fontSize: 180, lineHeight: 0.7, fontWeight: 500, fontStyle: "italic", position: "relative" }}>“</div>
          <div style={{ position: "relative" }}>
            <Eyebrow color={INK_3}>— une voix de partenaire</Eyebrow>
            <blockquote style={{ ...fSerif, fontStyle: "italic", fontSize: 32, lineHeight: 1.3, margin: "12px 0 28px", fontWeight: 400, letterSpacing: "-0.015em", color: INK, maxWidth: "32ch" }}>
              On a vu nos résidentes parler du toucher comme d'un sujet ordinaire, alors que c'était
              tabou il y a six mois. Ça change la dynamique de la maison.
            </blockquote>
            <cite style={{ ...fMono, fontSize: 12, color: INK_3, letterSpacing: "0.06em", fontStyle: "normal" }}>
              — DOMINIQUE B. · DIRECTRICE, EHPAD MÉDOT, LYON 7
            </cite>
          </div>
        </div>
      </div>
    </section>

    {/* Comment on travaille — étapes */}
    <section style={{ background: CREAM_V, padding: "120px 40px", borderTop: `1px solid ${LINE}` }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 64, marginBottom: 56, alignItems: "end" }}>
          <div>
            <Eyebrow color={VIOLET}>— Comment on travaille</Eyebrow>
            <h2 style={{ ...fSerif, fontSize: 52, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "16px 0 0", color: INK }}>
              Du <em style={{ color: VIOLET, fontWeight: 500 }}>premier appel</em>
              <br/>au bilan annuel.
            </h2>
          </div>
          <p style={{ color: INK_2_V, fontSize: 17, lineHeight: 1.6, maxWidth: "55ch", margin: "0 0 12px", ...fSans }}>
            On commence toujours par un échange — on cale ensemble la commande, le format, le périmètre,
            et un cadre éthique partagé.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { t: "Premier appel", b: "30 min, sans engagement. On comprend votre contexte, vos contraintes, vos attentes." },
            { t: "Convention", b: "On rédige une convention courte qui pose le cadre, les rôles, l'éthique." },
            { t: "Mise en œuvre", b: "Atelier, accompagnement individuel ou formation, selon ce qui a été convenu." },
            { t: "Bilan", b: "À 3 et 12 mois, on fait le point ensemble. On documente, on adapte." },
          ].map((s, i) => (
            <div key={i} style={{ borderTop: `2px solid ${i % 2 === 0 ? VIOLET : ORANGE}`, paddingTop: 16 }}>
              <div style={{ ...fSerif, fontStyle: "italic", fontWeight: 500, fontSize: 32, color: i % 2 === 0 ? VIOLET : ORANGE, lineHeight: 1, marginBottom: 12 }}>0{i+1}.</div>
              <h3 style={{ ...fSerif, fontSize: 19, fontWeight: 500, margin: "0 0 10px", color: INK, letterSpacing: "-0.01em" }}>{s.t}</h3>
              <p style={{ fontSize: 13.5, color: INK_2_V, lineHeight: 1.55, margin: 0, ...fSans }}>{s.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Callouts éthiques */}
    <section style={{ padding: "120px 40px", background: PAPER_V }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <Eyebrow>— Cadre éthique</Eyebrow>
          <h2 style={{ ...fSerif, fontSize: 48, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "16px 0 0", color: INK, maxWidth: "20ch" }}>
            Ce qu'il faut <em style={{ color: ORANGE, fontWeight: 500 }}>savoir</em> avant de nous solliciter.
          </h2>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ background: LAV_V, borderLeft: `3px solid ${VIOLET}`, padding: "22px 28px", borderRadius: 6 }}>
            <div style={{ ...fMono, fontSize: 11, letterSpacing: "0.12em", color: VIOLET, marginBottom: 8, textTransform: "uppercase" }}>— Consentement</div>
            <p style={{ ...fSans, fontSize: 15.5, color: INK_2_V, lineHeight: 1.55, margin: 0 }}>
              Aucune participation n'est obligatoire, jamais. Le consentement est revérifié à chaque
              séance, à chaque geste. Une personne peut se retirer sans avoir à se justifier.
            </p>
          </div>
          <div style={{ background: PEACH_V, borderLeft: `3px solid ${ORANGE}`, padding: "22px 28px", borderRadius: 6 }}>
            <div style={{ ...fMono, fontSize: 11, letterSpacing: "0.12em", color: ORANGE, marginBottom: 8, textTransform: "uppercase" }}>— Cadre</div>
            <p style={{ ...fSans, fontSize: 15.5, color: INK_2_V, lineHeight: 1.55, margin: 0 }}>
              Notre pratique n'est ni médicale, ni psychothérapeutique. Elle vient en complément de
              ce que vous proposez déjà — elle ne s'y substitue pas.
            </p>
          </div>
          <div style={{ background: HONEY_V, borderLeft: `3px solid ${ORANGE}`, padding: "22px 28px", borderRadius: 6 }}>
            <div style={{ ...fMono, fontSize: 11, letterSpacing: "0.12em", color: ORANGE, marginBottom: 8, textTransform: "uppercase" }}>— Confidentialité</div>
            <p style={{ ...fSans, fontSize: 15.5, color: INK_2_V, lineHeight: 1.55, margin: 0 }}>
              Ce qui est dit en séance reste en séance. Nous ne transmettons aucune information
              individuelle à votre équipe sans accord explicite de la personne concernée.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{ background: PAPER_V, position: "relative", overflow: "hidden", borderTop: `1px solid ${LINE}` }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "120px 60px" }}>
        <div style={{ background: VIOLET, color: PAPER_V, padding: "72px 64px", borderRadius: 22, position: "relative", overflow: "hidden", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 48, alignItems: "center" }}>
          <Blob size={300} color={MAUVE_V} seed={2} opacity={0.45} style={{ position: "absolute", bottom: -100, right: -80 }} />
          <Blob size={140} color={HONEY_V} seed={3} opacity={0.3} style={{ position: "absolute", top: 30, right: 60 }} />
          <div style={{ position: "relative" }}>
            <Eyebrow color={HONEY_V}>— Prochaine étape</Eyebrow>
            <h2 style={{ ...fSerif, fontSize: 56, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.0, margin: "16px 0 20px", maxWidth: "16ch", color: PAPER_V }}>
              On <em style={{ color: HONEY_V, fontWeight: 500 }}>prend rendez-vous</em> ?
            </h2>
            <p style={{ fontSize: 18, color: "rgba(251,247,238,0.85)", lineHeight: 1.55, maxWidth: "44ch", marginBottom: 0, ...fSans }}>
              Un premier appel de 30 minutes pour comprendre votre contexte. Sans engagement,
              et sans dossier à monter avant.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
            <a href="#" style={{ background: PAPER_V, color: VIOLET, padding: "16px 26px", borderRadius: 8, fontSize: 15, fontWeight: 500, textDecoration: "none", textAlign: "center", ...fSans }}>
              Demander un rendez-vous →
            </a>
            <a href="#" style={{ border: `1.5px solid ${PAPER_V}`, color: PAPER_V, padding: "16px 26px", borderRadius: 8, fontSize: 15, textDecoration: "none", textAlign: "center", ...fSans }}>
              Télécharger le dossier
            </a>
            <span style={{ ...fMono, fontSize: 11, color: "rgba(251,247,238,0.6)", letterSpacing: "0.06em", textAlign: "center", marginTop: 8 }}>
              CONTACT@2MAINSDEFEMMES.FR
            </span>
          </div>
        </div>
      </div>
    </section>
  </>
);

/* ============ PAGE — FEMME CONCERNÉE (accent ROSE / PEACH, ton plus doux) ============ */

const FemmePage = () => {
  const [openFaq, setOpenFaq] = React.useState(0);
  const faqItems = [
    { q: "Comment se passe le premier contact ?", a: "Vous nous écrivez ou vous nous appelez. On échange une demi-heure, sans engagement, pour comprendre ce dont vous avez envie. Vous décidez ensuite si vous voulez aller plus loin." },
    { q: "Faut-il avoir vécu quelque chose de précis ?", a: "Non. Vous n'avez pas à raconter, à expliquer, ni à justifier. Le toucher relationnel n'est pas un soin — c'est un endroit où le corps existe autrement." },
    { q: "Est-ce gratuit ?", a: "Oui, l'accompagnement est gratuit pour les femmes accueillies. L'association est financée par du mécénat et des fonds de dotation." },
    { q: "Et si je n'aime pas, ou si je veux arrêter ?", a: "Vous pouvez interrompre à n'importe quelle séance, à n'importe quel moment d'une séance. Sans avoir à vous justifier. C'est votre choix." },
    { q: "C'est confidentiel ?", a: "Oui, complètement. Ce qui est dit ou vécu en séance reste en séance. Aucune information n'est partagée sans votre accord explicite." },
    { q: "Et si je ne veux pas être touchée ?", a: "C'est possible aussi. Certaines séances se passent uniquement par la parole, par la présence, par le partage d'espace. Le toucher n'est jamais imposé." },
  ];

  return (
    <>
      {/* Hero */}
      <section style={{ background: PAPER_V, position: "relative", overflow: "hidden", borderBottom: `1px solid ${LINE}` }}>
        <Blob size={500} color={ROSE_V} seed={0} opacity={0.5} style={{ position: "absolute", top: -150, right: -120 }} />
        <Blob size={300} color={PEACH_V} seed={2} opacity={0.7} style={{ position: "absolute", bottom: -80, left: -50 }} />
        <Blob size={150} color={HONEY_V} seed={3} opacity={0.5} style={{ position: "absolute", top: 220, right: "35%" }} />
        <Blob size={70} color={MOSS_V} seed={4} opacity={0.6} style={{ position: "absolute", bottom: 120, left: "50%" }} />

        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: "100px 60px 120px" }}>
          <Crumbs items={["Accueil", "Femme concernée"]} />
          <Eyebrow color={ORANGE}>— Pour vous</Eyebrow>
          <h1 style={{ ...fSerif, fontSize: 100, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 0.96, margin: "16px 0 32px", color: INK, maxWidth: "16ch" }}>
            Ce qu'on vous <em style={{ color: ORANGE, fontWeight: 500, position: "relative", display: "inline-block" }}>
              propose
              <HandUnderline width={280} color={ROSE_V} style={{ position: "absolute", bottom: -10, left: 0 }} />
            </em>,<br/>
            si ça vous parle.
          </h1>
          <p style={{ fontSize: 22, color: INK_2_V, lineHeight: 1.5, maxWidth: "52ch", margin: "0 0 36px", ...fSans }}>
            Un espace pour vous. Sans rendez-vous médical, sans dossier à monter, sans avoir à expliquer.
            Juste un endroit où votre corps peut être, autrement.
          </p>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <BtnPrimary>Premier contact <Arrow color="white" /></BtnPrimary>
            <span style={{ ...fSerif, fontStyle: "italic", color: INK_3_V, fontSize: 17, marginLeft: 8 }}>
              ou simplement nous écrire — c'est ok →
            </span>
          </div>
        </div>
      </section>

      {/* Lettre — adresse directe */}
      <section style={{ padding: "120px 40px", background: PAPER_V }}>
        <div style={{ maxWidth: 880, margin: "0 auto", position: "relative" }}>
          <Eyebrow color={ORANGE}>— Une lettre, à vous</Eyebrow>
          <div style={{ ...fSerif, fontSize: 26, lineHeight: 1.55, color: INK, marginTop: 24, fontWeight: 400, letterSpacing: "-0.005em" }}>
            <p style={{ margin: "0 0 24px", fontStyle: "italic", color: ORANGE }}>Bonjour,</p>
            <p style={{ margin: "0 0 24px" }}>
              Si vous lisez ces lignes, peut-être que quelque chose dans votre vie vous a amenée jusqu'ici.
              Peut-être que vous ne savez pas trop. Peut-être que vous cherchez juste à comprendre ce qu'on
              fait, sans rien décider.
            </p>
            <p style={{ margin: "0 0 24px" }}>
              On vous propose un endroit. Pas un soin. Pas un programme. Un endroit où votre corps peut
              <em style={{ color: VIOLET, fontWeight: 500 }}> exister</em> sans devoir performer, sans
              devoir expliquer, sans devoir guérir.
            </p>
            <p style={{ margin: "0 0 24px" }}>
              On commence par un appel — ou un mail, si parler vous demande trop. On y va à votre rythme.
              Vous décidez de tout, à chaque pas.
            </p>
            <p style={{ margin: "0", ...fSerif, fontStyle: "italic", color: INK_3 }}>— l'équipe.</p>
          </div>
        </div>
      </section>

      {/* Ce qu'on vous propose — 4 valeurs */}
      <section style={{ padding: "120px 40px", background: CREAM_V, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, position: "relative", overflow: "hidden" }}>
        <Blob size={320} color={PEACH_V} seed={1} opacity={0.4} style={{ position: "absolute", top: 60, right: -80 }} />
        <Blob size={200} color={LAV_V} seed={3} opacity={0.4} style={{ position: "absolute", bottom: 40, left: -60 }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ marginBottom: 56 }}>
            <Eyebrow>— Ce qu'on garantit</Eyebrow>
            <h2 style={{ ...fSerif, fontSize: 56, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.0, margin: "16px 0 0", maxWidth: "16ch", color: INK }}>
              Quatre <em style={{ color: ORANGE, fontWeight: 500 }}>repères</em> pour vous.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { name: "Vous décidez de tout", body: "Du contenu de la séance, de son rythme, de ses limites. Vous décidez aussi de partir — à n'importe quel moment.", c: ORANGE, bg: PEACH_V },
              { name: "Le consentement, partout", body: "À chaque rencontre, à chaque geste, on revérifie. Vous pouvez dire non, et vous pouvez changer d'avis.", c: VIOLET, bg: LAV_V },
              { name: "Pas de jugement, pas d'attente", body: "Pas de progression à respecter, pas d'objectif à atteindre. Vous venez comme vous êtes, ce jour-là.", c: VIOLET, bg: HONEY_V },
              { name: "C'est gratuit, c'est confidentiel", body: "Aucun frais, et ce qui se passe en séance reste en séance. On ne transmet rien sans votre accord explicite.", c: ORANGE, bg: ROSE_V },
            ].map((v, i) => (
              <div key={i} style={{ background: v.bg, padding: "30px 28px 28px", borderRadius: 14, position: "relative", overflow: "hidden" }}>
                <Blob size={100} color={v.c} seed={i + 1} opacity={0.18} style={{ position: "absolute", bottom: -20, right: -20 }} />
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14, position: "relative" }}>
                  <span style={{ ...fSerif, fontStyle: "italic", fontSize: 36, fontWeight: 500, color: v.c, lineHeight: 1, letterSpacing: "-0.02em" }}>0{i+1}</span>
                  <span style={{ ...fSerif, fontWeight: 500, fontSize: 24, color: INK, letterSpacing: "-0.015em" }}>{v.name}</span>
                </div>
                <p style={{ ...fSans, fontSize: 15, color: INK_2_V, lineHeight: 1.6, margin: 0, position: "relative" }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages — mosaïque */}
      <section style={{ padding: "120px 40px", background: PAPER_V, position: "relative", overflow: "hidden" }}>
        <Blob size={350} color={LAV_V} seed={4} opacity={0.3} style={{ position: "absolute", top: 80, right: -80 }} />
        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Eyebrow>— Les voix</Eyebrow>
            <h2 style={{ ...fSerif, fontSize: 52, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "16px auto 0", maxWidth: "20ch", color: INK }}>
              Ce qu'<em style={{ color: ORANGE, fontWeight: 500 }}>elles</em> en disent.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {[
              { quote: "C'est la première fois depuis des années que quelqu'un me touche sans rien me demander en retour.", who: "LOLA · 42 ans", bg: PEACH_V, c: ORANGE },
              { quote: "Je suis venue parce que je voulais comprendre. Je suis restée parce que ça m'a fait du bien.", who: "SAMIRA · 58 ans", bg: HONEY_V, c: ORANGE },
              { quote: "J'ai mis trois séances avant d'accepter qu'on me prenne la main. Et ça a été ma main, pas une autre.", who: "ANNE · 67 ans", bg: ROSE_V, c: VIOLET },
            ].map((t, i) => (
              <div key={i} style={{ background: t.bg, padding: "30px 28px", borderRadius: 12, position: "relative" }}>
                <div style={{ ...fSerif, color: t.c, fontSize: 56, lineHeight: 0.5, fontStyle: "italic", fontWeight: 500, marginBottom: 14 }}>“</div>
                <blockquote style={{ ...fSerif, fontStyle: "italic", fontSize: 21, lineHeight: 1.35, margin: "0 0 18px", fontWeight: 400, letterSpacing: "-0.01em", color: INK }}>
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

      {/* FAQ */}
      <section style={{ padding: "120px 40px", background: CREAM_V, borderTop: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <Eyebrow>— Questions fréquentes</Eyebrow>
            <h2 style={{ ...fSerif, fontSize: 52, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "16px 0 0", color: INK }}>
              Ce que vous nous <em style={{ color: ORANGE, fontWeight: 500 }}>demandez</em> souvent.
            </h2>
          </div>
          <div>
            {faqItems.map((it, i) => {
              const open = openFaq === i;
              return (
                <div key={i} style={{ borderTop: `1px solid ${LINE}`, ...(i === faqItems.length - 1 ? { borderBottom: `1px solid ${LINE}` } : {}) }}>
                  <button onClick={() => setOpenFaq(open ? -1 : i)} style={{ width: "100%", background: "none", border: "none", padding: "22px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", ...fSerif, fontSize: 22, fontWeight: 500, color: INK, letterSpacing: "-0.015em" }}>
                    <span>{it.q}</span>
                    <span style={{ color: open ? ORANGE : INK_3 }}><Plus open={open} /></span>
                  </button>
                  {open && (
                    <div style={{ padding: "0 0 24px", color: INK_2_V, fontSize: 16, lineHeight: 1.65, maxWidth: "65ch", ...fSans }}>{it.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "120px 40px", background: PAPER_V, position: "relative", overflow: "hidden" }}>
        <Blob size={400} color={ROSE_V} seed={2} opacity={0.45} style={{ position: "absolute", top: -100, left: "30%" }} />
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <Eyebrow color={ORANGE}>— Premier pas</Eyebrow>
          <h2 style={{ ...fSerif, fontSize: 64, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.0, margin: "16px 0 24px", color: INK }}>
            On <em style={{ color: ORANGE, fontWeight: 500 }}>commence</em> quand vous voulez.
          </h2>
          <p style={{ fontSize: 19, color: INK_2_V, lineHeight: 1.55, maxWidth: "50ch", margin: "0 auto 36px", ...fSans }}>
            Vous nous écrivez. On répond sous 48 heures. On prend un rendez-vous quand vous le souhaitez —
            ou pas. C'est ok aussi.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
            <BtnPrimary>Écrire un mail <Arrow color="white" /></BtnPrimary>
            <BtnGhost>Appeler — 04 ●● ●● ●● ●●</BtnGhost>
          </div>
          <span style={{ ...fMono, fontSize: 12, color: INK_3, letterSpacing: "0.06em" }}>
            CONFIDENTIEL · GRATUIT · SANS ENGAGEMENT
          </span>
        </div>
      </section>
    </>
  );
};

/* ============ PAGE — ENTREPRISE / MÉCÈNE (accent VIOLET / HONEY, ton sérieux et chiffré) ============ */

const EntreprisePage = () => (
  <>
    {/* Hero */}
    <section style={{ background: PAPER_V, position: "relative", overflow: "hidden", borderBottom: `1px solid ${LINE}` }}>
      <Blob size={500} color={HONEY_V} seed={0} opacity={0.4} style={{ position: "absolute", top: -130, right: -110 }} />
      <Blob size={320} color={LAV_V} seed={2} opacity={0.55} style={{ position: "absolute", bottom: -90, left: -50 }} />
      <Blob size={140} color={MOSS_V} seed={3} opacity={0.5} style={{ position: "absolute", top: 220, left: "60%" }} />

      <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: "100px 60px 110px" }}>
        <Crumbs items={["Accueil", "Entreprises & mécènes"]} />
        <Eyebrow color={VIOLET}>— Engagement structurel</Eyebrow>
        <h1 style={{ ...fSerif, fontSize: 96, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 0.96, margin: "16px 0 32px", color: INK, maxWidth: "18ch" }}>
          <em style={{ color: ORANGE, fontWeight: 500, position: "relative", display: "inline-block" }}>
            Soutenir
            <HandUnderline width={250} color={HONEY_V} style={{ position: "absolute", bottom: -10, left: 0 }} />
          </em> ce qui répare<br/>le lien social.
        </h1>
        <p style={{ fontSize: 21, color: INK_2_V, lineHeight: 1.5, maxWidth: "55ch", margin: "0 0 36px", ...fSans }}>
          Mécénat financier, mécénat de compétences, mise à disposition de locaux — plusieurs voies pour
          engager votre entreprise auprès d'une innovation sociale ancrée à Lyon.
        </p>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <BtnPrimary>Devenir mécène <Arrow color="white" /></BtnPrimary>
          <BtnGhost>Télécharger le projet associatif</BtnGhost>
        </div>
      </div>
    </section>

    {/* Statistique en majesté */}
    <section style={{ padding: "120px 40px", background: PAPER_V }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr", gap: 56, alignItems: "center" }}>
        <div style={{ ...fSerif, fontStyle: "italic", fontSize: 200, lineHeight: 0.85, letterSpacing: "-0.04em", color: ORANGE, fontWeight: 500 }}>50 €</div>
        <div>
          <Eyebrow>— Notre coût d'impact</Eyebrow>
          <p style={{ fontSize: 26, color: INK, maxWidth: "44ch", lineHeight: 1.4, margin: "12px 0 16px", ...fSerif, fontWeight: 400, letterSpacing: "-0.015em" }}>
            permettent à une femme de bénéficier d'<em style={{ color: ORANGE }}>une séance complète</em> de toucher relationnel
            — incluant la supervision et le suivi.
          </p>
          <div style={{ ...fMono, fontSize: 12, color: INK_3, letterSpacing: "0.04em" }}>— Coût moyen 2025, audit interne</div>
        </div>
      </div>
    </section>

    {/* Trois formes de mécénat */}
    <section style={{ padding: "120px 40px", background: CREAM_V, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, position: "relative", overflow: "hidden" }}>
      <Blob size={300} color={HONEY_V} seed={1} opacity={0.3} style={{ position: "absolute", bottom: 60, right: -80 }} />
      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
        <div style={{ marginBottom: 56, maxWidth: 760 }}>
          <Eyebrow color={VIOLET}>— Trois formes d'engagement</Eyebrow>
          <h2 style={{ ...fSerif, fontSize: 56, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.0, margin: "16px 0 0", color: INK }}>
            <em style={{ color: VIOLET, fontWeight: 500 }}>Plusieurs voies</em> selon vos moyens et votre temps.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { kind: "MÉCÉNAT FINANCIER", title: "Don défiscalisable", body: "À partir de 1 000 €, votre don ouvre droit à 60 % de réduction d'impôt sur les sociétés. On vous adresse un reçu fiscal et un rapport d'impact annuel.", link: "Demander le RIB", color: ORANGE, bg: PEACH_V, blob: ROSE_V },
            { kind: "MÉCÉNAT DE COMPÉTENCES", title: "Mise à disposition d'expertise", body: "Communication, juridique, comptabilité, RH, design — vos collaborateurs interviennent sur des missions courtes. Valorisable fiscalement.", link: "Voir les chantiers", color: VIOLET, bg: LAV_V, blob: MAUVE_V },
            { kind: "LOCAUX & MATÉRIEL", title: "Mise à disposition de lieux", body: "Salle d'atelier, espace de réunion, hébergement ponctuel d'événement. Tout ce qui nous évite de louer ouvre des séances.", link: "Voir nos besoins", color: ORANGE, bg: HONEY_V, blob: ORANGE },
          ].map((it, i) => (
            <article key={i} style={{ background: it.bg, padding: 32, borderRadius: 14, display: "flex", flexDirection: "column", minHeight: 380, position: "relative", overflow: "hidden" }}>
              <Blob size={140} color={it.blob} seed={i + 2} opacity={0.25} style={{ position: "absolute", bottom: -40, right: -40 }} />
              <div style={{ ...fMono, fontSize: 11, letterSpacing: "0.14em", color: it.color, marginBottom: 20, position: "relative" }}>{it.kind}</div>
              <h3 style={{ ...fSerif, fontSize: 28, fontWeight: 500, margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.15, color: INK, position: "relative" }}>{it.title}</h3>
              <p style={{ fontSize: 14.5, color: INK_2_V, lineHeight: 1.6, marginBottom: 24, flex: 1, position: "relative", ...fSans }}>{it.body}</p>
              <div style={{ position: "relative" }}>
                <LinkArrow color={it.color}>{it.link}</LinkArrow>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* Chiffres impact */}
    <section style={{ background: VIOLET, color: PAPER_V, padding: "120px 40px", position: "relative", overflow: "hidden" }}>
      <Blob size={500} color={MAUVE_V} seed={2} opacity={0.4} style={{ position: "absolute", top: -120, left: -150 }} />
      <Blob size={300} color={HONEY_V} seed={4} opacity={0.18} style={{ position: "absolute", bottom: -80, right: -50 }} />
      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
        <div style={{ marginBottom: 56, maxWidth: 800 }}>
          <Eyebrow color={HONEY_V}>— Notre impact 2025</Eyebrow>
          <h2 style={{ ...fSerif, fontSize: 56, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.0, margin: "16px 0 0", color: PAPER_V }}>
            Ce que <em style={{ color: HONEY_V, fontWeight: 500 }}>vos dons</em> rendent possible.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, borderTop: `1px solid rgba(251,247,238,0.3)`, paddingTop: 40 }}>
          {[
            { num: "168", l: "femmes accompagnées en parcours individuel." },
            { num: "32", l: "ateliers collectifs animés en 2025." },
            { num: "11", l: "structures partenaires conventionnées." },
            { num: "84 %", l: "des participantes recommandent l'accompagnement." },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ ...fSerif, fontStyle: "italic", fontWeight: 500, fontSize: 80, lineHeight: 0.95, color: HONEY_V, letterSpacing: "-0.03em", marginBottom: 16 }}>{s.num}</div>
              <p style={{ fontSize: 14.5, color: "rgba(251,247,238,0.85)", lineHeight: 1.55, margin: 0, ...fSans }}>{s.l}</p>
            </div>
          ))}
        </div>
        <div style={{ ...fMono, fontSize: 11, color: "rgba(251,247,238,0.55)", letterSpacing: "0.04em", marginTop: 32 }}>
          — RAPPORT D'ACTIVITÉ 2025, À PARAÎTRE PRINTEMPS 2026
        </div>
      </div>
    </section>

    {/* Partenaires */}
    <section style={{ padding: "120px 40px", background: PAPER_V }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <Eyebrow>— Ils nous soutiennent déjà</Eyebrow>
          <h2 style={{ ...fSerif, fontSize: 48, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "16px 0 0", color: INK, maxWidth: "20ch" }}>
            Quelques <em style={{ color: ORANGE, fontWeight: 500 }}>partenaires</em>.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            { kind: "FONDATION", name: "Lyon Métropole Habitat", c: ORANGE, bg: PEACH_V },
            { kind: "ASSOCIATION", name: "L'Éclaircie — Le MAS", c: VIOLET, bg: LAV_V },
            { kind: "ASSOCIATION", name: "ALPIL", c: VIOLET, bg: LAV_V },
            { kind: "ASSOCIATION", name: "Un Chez Soi d'Abord", c: ORANGE, bg: HONEY_V },
            { kind: "STRUCTURE", name: "EHPAD Médot", c: VIOLET, bg: LAV_V },
            { kind: "STRUCTURE", name: "La Maison des femmes", c: ORANGE, bg: PEACH_V },
            { kind: "ENTREPRISE", name: "Cabinet Lasserre Avocats", c: VIOLET, bg: ROSE_V },
            { kind: "ENTREPRISE", name: "Pôle Pixel — Lyon 8", c: ORANGE, bg: HONEY_V },
          ].map((p, i) => (
            <div key={i} style={{ background: p.bg, padding: "22px 22px", borderRadius: 8 }}>
              <div style={{ ...fMono, fontSize: 10, letterSpacing: "0.12em", color: p.c, marginBottom: 8 }}>— {p.kind}</div>
              <div style={{ ...fSerif, fontSize: 17, fontWeight: 500, color: INK, letterSpacing: "-0.01em", lineHeight: 1.2 }}>{p.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Documents */}
    <section style={{ padding: "120px 40px", background: CREAM_V, borderTop: `1px solid ${LINE}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <Eyebrow>— Pour aller plus loin</Eyebrow>
          <h2 style={{ ...fSerif, fontSize: 48, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "16px 0 0", color: INK, maxWidth: "20ch" }}>
            <em style={{ color: ORANGE, fontWeight: 500 }}>Documents</em> de référence.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { meta: "PROJET ASSOCIATIF · SEPT. 2025", t: "Document de projet — Lyon Habitat Métropole 2025", b: "« Se (re)toucher pour se (re)lier : une innovation au service des femmes isolées. »", status: "Disponible sur demande", color: ORANGE },
            { meta: "RAPPORT D'ACTIVITÉ · À PARAÎTRE", t: "Rapport d'activité 2025", b: "Bilan détaillé : actions, participantes, partenariats et finances de l'année.", status: "À paraître — printemps 2026", color: VIOLET },
            { meta: "PLAQUETTE MÉCÉNAT · 2026", t: "Devenir mécène — guide pratique", b: "Toutes les formes d'engagement, les bénéfices fiscaux, les modalités de partenariat.", status: "Téléchargeable", color: ORANGE },
            { meta: "MANIFESTE", t: "Toucher relationnel — manifeste", b: "Le texte fondateur de l'association — pour comprendre d'où on vient et où on va.", status: "Téléchargeable", color: VIOLET },
          ].map((d, i) => (
            <div key={i} style={{ background: PAPER_V, border: `1px solid ${LINE}`, padding: 28, borderRadius: 8, display: "flex", flexDirection: "column" }}>
              <div style={{ ...fMono, fontSize: 11, letterSpacing: "0.1em", color: d.color, marginBottom: 16 }}>— {d.meta}</div>
              <h4 style={{ ...fSerif, fontSize: 22, fontWeight: 500, margin: "0 0 12px", color: INK, letterSpacing: "-0.015em", lineHeight: 1.2 }}>{d.t}</h4>
              <p style={{ ...fSans, fontSize: 14, color: INK_2_V, lineHeight: 1.6, marginBottom: 20, flex: 1 }}>{d.b}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: `1px solid ${LINE}` }}>
                <span style={{ ...fMono, fontSize: 11, color: INK_3, letterSpacing: "0.04em", textTransform: "uppercase" }}>{d.status}</span>
                <a href="#" style={{ ...fSerif, fontStyle: "italic", color: d.color, textDecoration: "none", fontSize: 14 }}>Télécharger →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA contact */}
    <section style={{ background: PAPER_V, position: "relative", overflow: "hidden", borderTop: `1px solid ${LINE}` }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "120px 60px" }}>
        <div style={{ background: ORANGE, color: PAPER_V, padding: "72px 64px", borderRadius: 22, position: "relative", overflow: "hidden", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48, alignItems: "center" }}>
          <Blob size={300} color={HONEY_V} seed={2} opacity={0.4} style={{ position: "absolute", bottom: -100, right: -80 }} />
          <Blob size={140} color={ROSE_V} seed={3} opacity={0.5} style={{ position: "absolute", top: 30, right: 60 }} />
          <div style={{ position: "relative" }}>
            <Eyebrow color={HONEY_V}>— Prendre contact</Eyebrow>
            <h2 style={{ ...fSerif, fontSize: 56, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.0, margin: "16px 0 20px", maxWidth: "16ch", color: PAPER_V }}>
              On <em style={{ color: HONEY_V, fontWeight: 500 }}>en parle</em> ?
            </h2>
            <p style={{ fontSize: 18, color: "rgba(251,247,238,0.9)", lineHeight: 1.55, maxWidth: "44ch", marginBottom: 0, ...fSans }}>
              Audrey Rolandeau, fondatrice, vous reçoit pour comprendre vos enjeux et co-construire
              une forme d'engagement qui vous correspond.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
            <a href="#" style={{ background: PAPER_V, color: ORANGE, padding: "16px 26px", borderRadius: 8, fontSize: 15, fontWeight: 500, textDecoration: "none", textAlign: "center", ...fSans }}>
              Prendre rendez-vous →
            </a>
            <a href="#" style={{ border: `1.5px solid ${PAPER_V}`, color: PAPER_V, padding: "16px 26px", borderRadius: 8, fontSize: 15, textDecoration: "none", textAlign: "center", ...fSans }}>
              Demander la plaquette
            </a>
            <span style={{ ...fMono, fontSize: 11, color: "rgba(251,247,238,0.6)", letterSpacing: "0.06em", textAlign: "center", marginTop: 8 }}>
              MECENAT@2MAINSDEFEMMES.FR
            </span>
          </div>
        </div>
      </div>
    </section>
  </>
);

Object.assign(window, { StructurePage, FemmePage, EntreprisePage });

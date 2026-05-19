import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Seed le global Navigation avec les valeurs hardcodées qui étaient
// dans src/lib/site.ts (constantes DEFAULT_HEADER_NAV, DEFAULT_HEADER_BUTTONS,
// defaultFooterColumns) avant le global Navigation.
//
// Idempotent : skip si la table `navigation` contient déjà une row.
//
// Tous les liens sont créés en `link_type='custom'` avec `link_url`
// hardcodé. Audrey pourra les convertir en `link_type='page'` (relation
// Pages) via /cms/admin/globals/navigation si elle veut suivre les
// renommages de slug.

type Link = { label: string; url: string }
type NavItem = { label: string; url?: string; is_dropdown?: boolean; children?: Link[] }
type Column = { title: string; links: Link[] }

const HEADER_NAV: NavItem[] = [
  {
    label: "L'association",
    is_dropdown: true,
    children: [
      { label: 'Qui sommes-nous', url: '/qui-sommes-nous' },
      { label: 'Nos publics cible', url: '/publics-cible' },
      { label: 'Nos interventions', url: '/interventions' },
      { label: 'Nos financeurs et réseaux', url: '/financeurs' },
    ],
  },
  { label: "L'isolement corporel", url: '/isolement-corporel' },
  { label: 'Structure santé/social', url: '/structures' },
  { label: 'Femme concernée', url: '/femmes' },
  {
    label: 'Entreprise',
    is_dropdown: true,
    children: [
      { label: 'Nos offres', url: '/entreprises' },
      { label: 'Mécénat entreprise', url: '/mecenat' },
    ],
  },
]

const HEADER_BUTTONS: Link[] = [
  { label: "Le blog — actualités de l'association", url: '/actualites' },
  { label: 'Nous rejoindre — bénévolat, praticien·ne·s, adhésion', url: '/agir' },
  { label: 'Nous soutenir — don, mécénat', url: '/soutenir' },
]

// URLs HelloAsso non incluses ici (Audrey peut les ajouter à la main
// après seed). Le code Astro a un fallback hardcoded sur `helloasso.com/.../2mains-de-femmes`
// en attendant.
const FOOTER_COLUMNS: Column[] = [
  {
    title: 'Actualités',
    links: [
      { label: 'Blog', url: '/actualites' },
      { label: 'Agenda', url: '/agenda' },
      { label: 'Nos documents cadres', url: '/documents' },
      { label: 'Nous contacter', url: '/contact' },
    ],
  },
  {
    title: 'Infos légales',
    links: [
      { label: 'Mentions légales', url: '/mentions-legales' },
      { label: 'RGPD et confidentialité', url: '/rgpd' },
      { label: 'Accessibilité : non conforme', url: '/accessibilite' },
      { label: 'Admin', url: '/cms/admin' },
    ],
  },
]

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  const existing = await db.execute<{ count: string }>(
    sql`SELECT COUNT(*)::text AS count FROM "navigation"`,
  )
  const count = Number.parseInt(existing.rows[0]?.count ?? '0', 10)
  if (count > 0) {
    payload.logger.info({ count }, 'navigation already seeded — skipping')
    return
  }

  // 1. Row parent du global
  const navResult = await db.execute<{ id: number }>(sql`
    INSERT INTO "navigation" (updated_at, created_at)
    VALUES (NOW(), NOW())
    RETURNING id
  `)
  const navId = navResult.rows[0]?.id
  if (!navId) {
    throw new Error('Failed to create navigation parent row')
  }

  // 2. Header nav items (avec children pour les dropdowns)
  for (let i = 0; i < HEADER_NAV.length; i++) {
    const item = HEADER_NAV[i]
    const itemResult = await db.execute<{ id: string }>(sql`
      INSERT INTO "navigation_header_nav"
        ("_order", "_parent_id", "id", "label", "is_dropdown", "link_type", "link_url")
      VALUES (
        ${i + 1},
        ${navId},
        gen_random_uuid()::varchar,
        ${item.label},
        ${item.is_dropdown ?? false},
        'custom',
        ${item.url ?? null}
      )
      RETURNING id
    `)
    const itemId = itemResult.rows[0]?.id
    if (item.children && itemId) {
      for (let j = 0; j < item.children.length; j++) {
        const child = item.children[j]
        await db.execute(sql`
          INSERT INTO "navigation_header_nav_children"
            ("_order", "_parent_id", "id", "label", "link_type", "link_url")
          VALUES (
            ${j + 1},
            ${itemId},
            gen_random_uuid()::varchar,
            ${child.label},
            'custom',
            ${child.url}
          )
        `)
      }
    }
  }

  // 3. Header buttons
  for (let i = 0; i < HEADER_BUTTONS.length; i++) {
    const btn = HEADER_BUTTONS[i]
    await db.execute(sql`
      INSERT INTO "navigation_header_buttons"
        ("_order", "_parent_id", "id", "label", "link_type", "link_url")
      VALUES (
        ${i + 1},
        ${navId},
        gen_random_uuid()::varchar,
        ${btn.label},
        'custom',
        ${btn.url}
      )
    `)
  }

  // 4. Footer columns avec leurs links
  for (let i = 0; i < FOOTER_COLUMNS.length; i++) {
    const col = FOOTER_COLUMNS[i]
    const colResult = await db.execute<{ id: string }>(sql`
      INSERT INTO "navigation_footer_columns"
        ("_order", "_parent_id", "id", "title")
      VALUES (
        ${i + 1},
        ${navId},
        gen_random_uuid()::varchar,
        ${col.title}
      )
      RETURNING id
    `)
    const colId = colResult.rows[0]?.id
    if (colId) {
      for (let j = 0; j < col.links.length; j++) {
        const link = col.links[j]
        await db.execute(sql`
          INSERT INTO "navigation_footer_columns_links"
            ("_order", "_parent_id", "id", "label", "link_type", "link_url", "highlight")
          VALUES (
            ${j + 1},
            ${colId},
            gen_random_uuid()::varchar,
            ${link.label},
            'custom',
            ${link.url},
            false
          )
        `)
      }
    }
  }

  payload.logger.info(
    {
      headerItems: HEADER_NAV.length,
      buttons: HEADER_BUTTONS.length,
      footerCols: FOOTER_COLUMNS.length,
    },
    'navigation seed done',
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Les FK CASCADE retirent automatiquement les sous-tables.
  await db.execute(sql`DELETE FROM "navigation"`)
}

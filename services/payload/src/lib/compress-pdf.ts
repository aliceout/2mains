import { execFile } from 'node:child_process'
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

const execFileP = promisify(execFile)

// En dessous de ce seuil un PDF ne gagnera quasi rien : on n'y touche pas.
const MIN_BYTES = 3 * 1024 * 1024 // 3 Mo
const DPI = 200

/**
 * Recompresse un PDF à 200 DPI via Ghostscript (`gs`).
 *
 * Retourne le buffer compressé UNIQUEMENT s'il est réellement plus léger
 * que l'original (un PDF texte/vectoriel ne gagne rien voire grossit) ;
 * sinon `null` → l'appelant garde l'original.
 *
 * Ne throw jamais : si `gs` est absent (dev Windows) ou plante, on
 * renvoie `null`. Un upload ne doit jamais échouer à cause de ça.
 */
export async function compressPdf(input: Buffer): Promise<Buffer | null> {
  if (input.length < MIN_BYTES) return null
  let dir: string | undefined
  try {
    dir = await mkdtemp(join(tmpdir(), 'pdfz-'))
    const inPath = join(dir, 'in.pdf')
    const outPath = join(dir, 'out.pdf')
    await writeFile(inPath, input)
    // /ebook fixe la base ; les -d…ImageResolution=200 qui suivent
    // l'écrasent pour viser 200 DPI pile.
    await execFileP('gs', [
      '-sDEVICE=pdfwrite',
      '-dCompatibilityLevel=1.4',
      '-dPDFSETTINGS=/ebook',
      '-dDownsampleColorImages=true', `-dColorImageResolution=${DPI}`,
      '-dDownsampleGrayImages=true', `-dGrayImageResolution=${DPI}`,
      '-dDownsampleMonoImages=true', `-dMonoImageResolution=${DPI}`,
      '-dNOPAUSE', '-dBATCH', '-dQUIET',
      `-sOutputFile=${outPath}`,
      inPath,
    ])
    const out = await readFile(outPath)
    return out.length < input.length ? out : null
  } catch {
    return null
  } finally {
    if (dir) await rm(dir, { recursive: true, force: true }).catch(() => {})
  }
}

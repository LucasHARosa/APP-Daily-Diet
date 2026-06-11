const sharp = require('sharp');
const path = require('path');

const ASSETS = path.join(__dirname, '..', 'assets', 'images');
const LOGO = path.join(ASSETS, 'Logo.svg');

// greenLight #E5F0DB
const BG = { r: 229, g: 240, b: 219, alpha: 1 };
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

async function run() {
  // 1024×1024 — app icon, no transparency
  await sharp(LOGO)
    .resize(800, 800, { fit: 'contain', background: BG })
    .flatten({ background: BG })
    .extend({ top: 112, bottom: 112, left: 112, right: 112, background: BG })
    .toFormat('png')
    .toFile(path.join(ASSETS, 'icon.png'));
  console.log('✓ icon.png (1024×1024)');

  // 1080×1080 — Android adaptive foreground, logo na safe zone (66%), fundo transparente
  await sharp(LOGO)
    .resize(720, 720, { fit: 'contain', background: TRANSPARENT })
    .extend({ top: 180, bottom: 180, left: 180, right: 180, background: TRANSPARENT })
    .toFormat('png')
    .toFile(path.join(ASSETS, 'android-icon-foreground.png'));
  console.log('✓ android-icon-foreground.png (1080×1080)');

  // 400×400 — splash screen (expo-splash-screen escala internamente)
  await sharp(LOGO)
    .resize(400, 400, { fit: 'contain', background: TRANSPARENT })
    .toFormat('png')
    .toFile(path.join(ASSETS, 'splash-icon.png'));
  console.log('✓ splash-icon.png (400×400)');

  // 64×64 — favicon web
  await sharp(LOGO)
    .resize(64, 64, { fit: 'contain', background: BG })
    .flatten({ background: BG })
    .toFormat('png')
    .toFile(path.join(ASSETS, 'favicon.png'));
  console.log('✓ favicon.png (64×64)');

  console.log('\nTodos os ícones gerados em assets/images/');
}

run().catch(console.error);

import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream, existsSync, mkdirSync } from 'fs';

const BASE_URL = 'https://devsite.cfd';

(async () => {
  if (!existsSync('./frontend/public')) {
    mkdirSync('./frontend/public', { recursive: true });
  }

  const smStream = new SitemapStream({ hostname: BASE_URL });
  const writeStream = createWriteStream('./fornt-end/public/sitemap.xml');
  smStream.pipe(writeStream);

  // Pagini statice
  smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
  smStream.write({ url: '/contact', changefreq: 'monthly', priority: 0.5 });
  smStream.write({ url: '/about', changefreq: 'monthly', priority: 0.5 });

  // Pagini categorii (rămân în sitemap)
  try {
    const catRes = await fetch(`${BASE_URL}/api/categories`);
    if (!catRes.ok) throw new Error(`HTTP error! status: ${catRes.status}`);
    const categories = await catRes.json();

    categories.forEach((cat) => {
      const catSlug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-');
      if (catSlug) {
        smStream.write({
          url: `/product-category/${catSlug}`,
          changefreq: 'weekly',
          priority: 0.7,
        });
      }
    });
  } catch (err) {
    console.error('❌ Eroare la categoriile din sitemap:', err);
  }

  smStream.end();
  await streamToPromise(smStream);
  console.log('✅ sitemap.xml generat cu succes!');
})();

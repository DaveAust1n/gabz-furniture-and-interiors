# Gabs SEO maintenance

The website serves complete static HTML, including page text, canonicals and JSON-LD. A client-side schema injector or SSR migration is unnecessary.

## Edit page metadata

Edit `seo/pages.json`, then run `node scripts/build-seo.mjs`. Commit the generated HTML with the data file. Run `node scripts/build-seo.mjs --check` before publishing. The generator keeps title, description, social metadata and WebPage/Service schema aligned; it rejects titles over 60 characters, descriptions over 155, incorrect canonical origins, missing primary headings and accidental noindex tags. These lengths are editorial targets, not Google ranking rules.

## Images

Original JPEGs and videos are retained. Responsive WebP derivatives are used through picture elements for the homepage hero and five service-page images. JPEG remains the fallback and the social-sharing image. Never lazy-load the main hero; retain lazy loading for lower-page pictures.

For future uploads, install Pillow in your local Python environment and run `python scripts/optimize-images.py public/path/to/photo.jpg`. It creates 480px and 800px WebP derivatives without enlarging small files. Review image quality before adding picture sources and accurate width/height attributes. WebP uses quality 88; it is a compressed derivative, not a lossless copy. Videos are untouched.

## Accurate content and schema

Keep business details consistent with the approved Google Business Profile. Service and project pages describe actual work. Do not generate Product offers, prices, availability, ratings, wood types or sustainability claims from guesses. Add Product schema only when a genuine product record and corresponding visible page exist. Use descriptive alt text for visible details; do not invent materials.

## Maintenance

Check links, images, navigation and enquiry links after changes. Review Search Console indexing and actual enquiries. Audits and metadata do not guarantee rankings. No new paid SEO service, analytics account or backend is configured by this update.

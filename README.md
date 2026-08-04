# Diamond Group @ Florida State — website

Static site for the Diamond Group (Michael Diamond, EOAS/FSU), replacing the previous WordPress site
at msdiamond.cloud. Vanilla HTML/CSS/JS, published via GitHub Pages from the `gh-pages` branch.

## Pages

- `index.html` — home / recent updates
- `about-me.html` — About Michael
- `cv.html` — links to CV PDF (`files/cv_md_20241114.pdf`)
- `group.html` — group members
- `research.html` — research areas (Marine Cloud Brightening, Natural Experiments, Smoke-Cloud
  Interactions, Cloud Droplet Remote Sensing, Previous Work), each as an anchored section
- `papers.html` — full publication list
- `talks.html` — academic talks
- `outreach.html` — contact, in the news, interactive models, past outreach talks
- `news.html` — hand-maintained news list (no comments/subscriptions — add a new
  `<div class="news-item">` block at the top of the list when you have an update)

## Updating content

There's no build step or CMS — edit the HTML files directly. Nav/header/footer markup is duplicated
across pages (no templating), so if you change the nav, update it in every `.html` file.

## Custom domain (msdiamond.cloud)

The `CNAME` file in this repo tells GitHub Pages to serve this site at `msdiamond.cloud`. You'll also
need to point DNS at GitHub Pages and enable the custom domain in the repo's Pages settings — see the
setup notes provided alongside this migration.

## Images

`images/` contains headshots and photos pulled from the old WordPress media library, resized/compressed
for the web. `files/` contains the CV PDF.

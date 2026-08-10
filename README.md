# Diamond Group @ Florida State — website

Static site for the Diamond Group (Michael Diamond, EOAS/FSU), replacing the previous WordPress site
at msdiamond.cloud. Vanilla HTML/CSS/JS, published via GitHub Pages from the `gh-pages` branch at
https://michael-s-diamond.github.io/camp/.

## Pages

- `index.html` — home / recent updates; also has the CV link (`files/cv_md_20241114.pdf`) and
  GitHub/LinkedIn icon links in the mini-bio card (no separate CV page anymore)
- `about-me.html` — About Michael (no longer linked from the nav, but still reachable directly)
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

## Domain

This site is served at the default `michael-s-diamond.github.io/camp/` address — there is no custom
domain configured (no `CNAME` file). msdiamond.cloud has been retired; if a `CNAME` file or a custom
domain re-appears in the repo's Pages settings, remove/clear it, since either one will redirect the
github.io URL away from this site.

## Images

`images/` contains headshots and photos pulled from the old WordPress media library, resized/compressed
for the web. `files/` contains the CV PDF.

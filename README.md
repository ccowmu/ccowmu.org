# cclub.cs.wmich.edu

The website of the Computer Club at Western Michigan University. Hugo builds it as two sites: the main site in the repo root, and the minutes site in `minutes/`. The build script joins them in `public/`.

## Preview

Install Hugo (extended). Then run:

```bash
./dev.sh
```

Open http://localhost:1313. After each edit, run `./dev.sh` again and reload the page.

Do not use `hugo server`. It skips the minutes site.

## Edit the home page

All home page text lives in `data/portal.toml`. The file starts with a guide. It holds the nav, the topic line, the featured event, the section links, the server list, the socials, the service tiles and the Top 10 list.

The terminal commands live in `data/terminal.toml`. Each entry is one command and its output. Set `hidden = true` to keep a command out of `help`.

## Add a blinkie or stamp

Put the image in the matching folder:

| Item | Size | Folder |
|---|---|---|
| Blinkie | 150x20 | `static/images/blinkies/` |
| Stamp | 99x56 | `static/images/stamps/` |

The image shows on the next build. The file name becomes the alt text. To give it a link or better alt text, add an entry in `data/portal.toml`:

```toml
[[stamps]]
file = "dvdStamp.gif"
alt = "dvd logo"
url = "https://example.com"
```

## Display menu

The Display button in the nav opens theme, text size, reduced motion and color-blind options. Choices persist in the browser. The page also obeys the system settings for reduced motion and high contrast. To add a theme, add a `:root[data-theme='name']` block in `portal.css` and the name to the `THEMES` list in `static/js/prefs.js`.

## Tests

```bash
node --test tests/*.test.js
```

The tests cover the preference logic. CI runs them before the build.

## Edit the other pages

The Join, Connect and Hackathon pages are Markdown in `content/`. Each panel is a `panel` or `cardpanel` shortcode. Copy an existing panel to add one.

## Add meeting minutes

Minutes live in a separate repo: https://github.com/ccowmu/minutes. Add a file named `YYYYMMDD.md` there. The build script pulls that repo and writes the site pages.

Do not edit `minutes/content/` in this repo. The build script overwrites it.

## Deploy

On the server, run `pull-website.sh` from the `server-rebuild` repo. It pulls this repo and runs `./build.sh`. Caddy serves `public/`.

The hit counter and the live server status come from the `portal_api` container in `server-rebuild`. The page calls it at `/api`. If the container is down, the page shows the seed count and the fixed server list.

GitHub Actions runs `./build.sh` on every push. A red check means the build is broken.

## Repository layout

| Path | Holds |
|---|---|
| `data/portal.toml` | Home page content |
| `data/terminal.toml` | Terminal commands |
| `content/` | Join, and other smaller pages |
| `layouts/` | Templates. The shared header and footer are in `layouts/partials/portal/` |
| `static/css/portal.css` | All styles |
| `static/js/` | Clock, countdown, hit counter, display preferences, terminal and minutes search |
| `tests/` | Node tests for the preference logic |
| `static/fonts/` | Ubuntu, self-hosted |
| `static/images/` | Images, with one folder each for blinkies and stamps |
| `minutes/` | The minutes site. It uses the partials and data from the root |
| `public/` | Build output |

## Before the first public commit

`public/` and `minutes/public/` are build output. Git still tracks old copies. Run this once, then commit:

```bash
git rm -r --cached public minutes/public
```

`underConstruction` is `false` in both config files, so search engines index the site. Set it to `true` to hide a work in progress.

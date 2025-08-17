This site is built with Hugo.

- Root site uses `hugo.yml` for config.
- Minutes subsite uses `minutes/config.toml` and builds separately.
- All templates use `relURL` and `relativeURLs=true` so links work on GitHub Pages and on cclub.cs.wmich.edu.
- Under construction mode is enabled; remove `params.underConstruction` when launching.

Local build quickstart:

- Build minutes: `hugo -s minutes`
- Build main: `hugo`
- Copy minutes: `mkdir -p public/minutes && cp -r minutes/public/* public/minutes/`

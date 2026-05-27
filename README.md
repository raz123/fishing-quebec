# Quebec Fishing Spots

**🌐 Live: https://raz123.github.io/fishing-quebec/**

Find public fishing spots and pourvoiries (outfitters) across Quebec.

- **Interactive map** with 1,800+ spots (1,364 public + 494 pourvoiries)
- **Fish species** information for each spot
- **Recommended equipment** with Amazon affiliate links
- **Bilingual** (English/Français)
- **Geolocation** to find spots near you

## Development

```bash
npm install
node scripts/build-data.cjs  # Fetch latest data from Quebec open data APIs
npm run dev                   # Start dev server
npm run build                 # Build for production
```

## Amazon Associates

Your tracking ID (`redag2-20`) is configured. Equipment ASINs need to be filled in `data-src/equipment.json` for the Amazon links to become active.

## Deploy

Push to `main` → GitHub Actions auto-builds and deploys to Pages.

## Data Sources

- [Guide de consommation du poisson](https://www.donneesquebec.ca/recherche/fr/dataset/e9a065a3-977a-479a-b935-dbfcd78347b6) (CC-BY 4.0)
- [Pourvoiries SIT Québec](https://www.donneesquebec.ca/recherche/dataset/f43fbfd7-2b40-4f40-99da-2e0ac1339012) (CC-BY 4.0)

## License

Data: CC-BY 4.0. Code: MIT.

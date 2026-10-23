# GitHub Pages deployment verification

**Verified:** October 23, 2026.

**Public site:** https://sguzman.github.io/mercata/

**Deployment workflow:** [Publish Mercata site — run 40033381652](https://github.com/sguzman/mercata/actions/runs/40033381652), completed successfully for commit `fc791b1a3d6059f130fa0ddcbd64c924aaa00ba7`. Its configuration, upload and deployment steps all passed.

**Independent HTTP validation:** [Verify public research and website — run 40033381778](https://github.com/sguzman/mercata/actions/runs/40033381778), completed successfully. At 2026-10-23T22:24:48Z, a GitHub-hosted Linux runner fetched the HTTPS endpoint with `curl --fail` and verified that the response contained `id="catalog-grid"`. The job printed:

> PASS: public Pages endpoint returned the Mercata catalog

The same run passed the source/ontology verifier, Node tests and automated Firefox desktop/mobile checks. The browser checks use a separately hosted local copy of the committed website; the HTTP probe checks public Pages reachability. These are distinct acceptance conditions.

**Limit:** This does not guarantee the public CDN updates instantaneously on each future commit. A new deployment should be verified by its own workflow outcome.

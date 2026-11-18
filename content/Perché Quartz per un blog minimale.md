---
title: Perché Quartz per un blog minimale
description: Pro e contro dell'usare Quartz 5 come piattaforma di blogging invece di un CMS.
date: 2026-11-17
tags:
  - quartz
  - strumenti
  - recensione
---

# Perché Quartz per un blog minimale

Quartz nasce per i *digital garden*, ma si presta sorprendentemente bene a un blog piccolo.

## Cosa mi piace

- **Scrittura in Markdown**: ogni articolo è un file, modificabile con qualsiasi editor.
- **Velocità**: il sito è statico, con SPA routing e bundle ridotti.
- **Collegamenti**: i wikilink e i backlink trasformano gli articoli in una rete, non in una semplice sequenza cronologica.
- **Zero manutenzione**: GitHub Pages fa da host, senza database o pannelli amministrativi da aggiornare.

## Cosa manca

- **Commenti**: il plugin giscus va configurato a mano con repo, category e ID. L'ho disattivato per restare minimale.
- **Editor web**: non c'è un'interfaccia per scrivere dal browser; serve Git o un editor locale.
- **Programmazione articoli**: non esiste uno scheduling nativo, si pubblica con un commit.

Per un blog personale dove la scrittura avviene in locale, questi limiti sono accettabili. Se serve un flusso editoriale multi-autore, un CMS tradizionale resta più adatto.

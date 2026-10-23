# ujep.datatimes.cz – studijní prostředí UJEP × DataTimes

Mikrosajt s interaktivními osnovami předmětů, které na UJEP vede Kateřina Mahdalová. Založeno 23. 10. 2026.

- Čistě statický web (HTML, CSS, trocha JS), bez sestavování. Nasazení: Cloudflare Pages, výstupní složka = kořen repa.
- Bez přihlašování, neindexuje se (`robots.txt`, `noindex`). Odevzdávání zůstává v Moodle, stránka neukládá údaje studujících (odškrtnuté úkoly a rozepsané věty jen v localStorage prohlížeče).

```
index.html                              rozcestník předmětů
assets/                                 style.css, app.js (úkoly, kvízy, kalkulačka koalic, stavitel věty), loga
datova-zurnalistika/index.html          interaktivní osnova
datova-zurnalistika/kapitola-N/         kapitoly
```

## Jak přidat kapitolu

Zkopírovat `kapitola-2/index.html` do `kapitola-N/`, přepsat obsah, přidat dlaždici do osnovy a odkaz do navigace.

Zastávka (kvíz): `<fieldset class="qq" data-answer="1">` = správně je druhé tlačítko (počítá se od 0), `data-answer="all"` = správné jsou všechny odpovědi a vysvětlení rozebírá každou.

## Zdroje

Odkazujeme primárně na vlastní články DataTimes (mahdalova-skop.cz), čísla na ČSÚ (volby.gov.cz), dále na stránky obcí a u zpráv z obcí na veřejnoprávní média nebo ČTK. Jiné zpravodajské weby jen výjimečně.

Logo UJEP: Wikimedia Commons, `UJEP_Logo.svg` (doplněn viewBox kvůli škálování).

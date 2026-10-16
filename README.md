# PulseFit

Application Next.js de musculation pour débutants et confirmés : programmes personnalisés, suivi de séances hors ligne, progression explicable, stats, nutrition et assistant IA (Premium).

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS 4
- **GSAP** pour les animations d’entrée / transitions UI
- **Zustand** + `localStorage` pour l’état et le mode hors ligne (V1)
- Icônes **SVG** custom

## Démarrer

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Parcours démo

1. **Commencer** → inscription → questionnaire (objectifs, niveau, matériel, dispo)
2. **Accueil / Plans** → activer un programme
3. **Séance** → logger séries, RIR, chronomètre de repos, pause / reprise
4. **Stats** → volume, PR, recommandations de charge explicables
5. **Profil** → thème clair/sombre, couleur d’accent, sync simulée
6. **Premium** → activer la démo pour l’assistant IA

## Architecture V1 → suite

| Couche | V1 (actuelle) | Suite |
| --- | --- | --- |
| Auth | Locale (démo) | Supabase Auth |
| Données | Zustand + localStorage | SQLite/IndexedDB + sync serveur |
| Progression | Règles déterministes offline | Affinage + historique des décisions |
| IA / Premium | Simulation locale | API serveur + Stripe/RevenueCat |
| Mobile natif | PWA + APK Capacitor (GitHub Releases) | Play Store (licence) |

Design par défaut : fond noir, accent lime `#B5FF33`, couleurs d’accent modifiables dans le profil.

## Déployer sur Coolify

1. Dans Coolify : **+ New Resource** → **Public Repository**
2. URL : `https://github.com/Natheo123/Pulse-Fit` · branche `main`
3. **Build Pack** : `Dockerfile` (pas Nixpacks)
4. **Ports Exposes** : `3000`
5. **Environment Variables** (Runtime) :
   - `DEEPSEEK_API_KEY` = ta clé
   - `DEEPSEEK_MODEL` = `deepseek-chat` (optionnel)
   - `HOSTNAME` = `0.0.0.0` (déjà dans le Dockerfile)
6. Domaine : ajoute ton domaine / sous-domaine Coolify → SSL auto
7. **Deploy**

L’app web (API IA incluse) tourne en mode `standalone` Docker. L’APK Capacitor reste un build séparé (Actions).

## APK Android (sans Play Store)

L’APK est généré automatiquement par GitHub Actions (build debug, installable en sideload).

1. Pousse sur `main` → l’artifact **PulseFit-debug** apparaît dans l’onglet **Actions**
2. Ou crée un tag pour une Release téléchargeable :
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```
3. Sur le téléphone : autorise les sources inconnues → ouvre le `.apk` → Installer

Build local (nécessite Android SDK) :

```bash
npm install
npm run build:mobile
npx cap add android   # une seule fois
npx cap sync android
cd android && ./gradlew assembleDebug
```

L’APK se trouve dans `android/app/build/outputs/apk/debug/app-debug.apk`.

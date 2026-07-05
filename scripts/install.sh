#!/usr/bin/env bash
#
# install-plugins.sh
#
# Lit un fichier dependencies.json à la racine du projet contenant une liste
# d'URLs GitHub, clone chaque repo, et copie son dossier "src" (à l'exception
# de main.ts, reset.css et style.css) dans src/plugins/<nom-du-repo>.
#
# Usage :
#   ./install-plugins.sh
#   ./install-plugins.sh --force        # réinstalle même si le plugin existe déjà
#   ./install-plugins.sh --file custom.json
#
set -euo pipefail

# --- Configuration ---------------------------------------------------------

DEPENDENCIES_FILE="dependencies.json"
PLUGINS_DIR="src/plugins"
FORCE=0

# Fichiers à exclure lors de la copie du dossier src du plugin
EXCLUDED_FILES=("main.ts" "reset.css" "style.css")

# --- Parsing des arguments ---------------------------------------------------

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force|-f)
      FORCE=1
      shift
      ;;
    --file)
      DEPENDENCIES_FILE="$2"
      shift 2
      ;;
    *)
      echo "Argument inconnu : $1" >&2
      exit 1
      ;;
  esac
done

# --- Fonctions utilitaires ---------------------------------------------------

log()  { echo -e "\033[1;34m[install-plugins]\033[0m $*"; }
warn() { echo -e "\033[1;33m[install-plugins]\033[0m $*" >&2; }
err()  { echo -e "\033[1;31m[install-plugins]\033[0m $*" >&2; }

# Extrait le nom du repo à partir d'une URL GitHub, ex :
#   https://github.com/Safirl/three-base-experience     -> three-base-experience
#   https://github.com/Safirl/three-base-experience.git -> three-base-experience
#   git@github.com:Safirl/three-base-experience.git     -> three-base-experience
extract_repo_name() {
  local url="$1"
  local name
  name="$(basename "$url")"
  name="${name%.git}"
  echo "$name"
}

# --- Vérifications préalables ------------------------------------------------

if ! command -v git >/dev/null 2>&1; then
  err "git n'est pas installé ou introuvable dans le PATH."
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  err "node n'est pas installé ou introuvable dans le PATH (nécessaire pour parser le JSON)."
  exit 1
fi

if [[ ! -f "$DEPENDENCIES_FILE" ]]; then
  err "Fichier '$DEPENDENCIES_FILE' introuvable à la racine du projet."
  exit 1
fi

mkdir -p "$PLUGINS_DIR"

# --- Lecture du fichier dependencies.json ------------------------------------
# On utilise node pour parser proprement le JSON (déjà présent dans un projet vite)
# et on récupère une URL par ligne.

PLUGIN_URLS=()
while IFS= read -r line; do
  [[ -n "$line" ]] && PLUGIN_URLS+=("$line")
done < <(node -e "
  const fs = require('fs');
  const raw = fs.readFileSync(process.argv[1], 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('JSON invalide dans ' + process.argv[1] + ' : ' + e.message);
    process.exit(1);
  }
  if (!Array.isArray(data)) {
    console.error('Le fichier ' + process.argv[1] + ' doit contenir un tableau JSON.');
    process.exit(1);
  }
  for (const url of data) {
    if (typeof url === 'string' && url.trim().length > 0) {
      console.log(url.trim());
    }
  }
" "$DEPENDENCIES_FILE")

if [[ "${#PLUGIN_URLS[@]}" -eq 0 ]]; then
  warn "Aucune URL trouvée dans '$DEPENDENCIES_FILE'."
  exit 0
fi

log "Installation de ${#PLUGIN_URLS[@]} plugin(s) depuis '$DEPENDENCIES_FILE'..."

# --- Nettoyage global ---------------------------------------------------------
# Garde une trace du dossier temporaire en cours pour le supprimer même en cas
# d'interruption ou d'erreur inattendue (compatible bash 3.2, sans trap RETURN).

CURRENT_TMP_DIR=""
cleanup() {
  if [[ -n "$CURRENT_TMP_DIR" && -d "$CURRENT_TMP_DIR" ]]; then
    rm -rf "$CURRENT_TMP_DIR"
  fi
}
trap cleanup EXIT

# --- Boucle d'installation ----------------------------------------------------

for url in "${PLUGIN_URLS[@]}"; do
  repo_name="$(extract_repo_name "$url")"
  target_dir="$PLUGINS_DIR/$repo_name"

  echo ""
  log "→ $repo_name ($url)"

  if [[ -d "$target_dir" && "$FORCE" -eq 0 ]]; then
    log "  Déjà présent dans '$target_dir', on passe (utilise --force pour réinstaller)."
    continue
  fi

  if [[ -d "$target_dir" && "$FORCE" -eq 1 ]]; then
    warn "  --force actif : suppression de '$target_dir' avant réinstallation."
    rm -rf "$target_dir"
  fi

  tmp_dir="$(mktemp -d)"
  CURRENT_TMP_DIR="$tmp_dir"

  log "  Clonage dans un dossier temporaire..."
  if ! git clone --depth 1 --quiet "$url" "$tmp_dir"; then
    err "  Échec du clonage de '$url'. Plugin ignoré."
    rm -rf "$tmp_dir"
    CURRENT_TMP_DIR=""
    continue
  fi

  src_path="$tmp_dir/src"
  if [[ ! -d "$src_path" ]]; then
    err "  Aucun dossier 'src' trouvé dans '$repo_name'. Plugin ignoré."
    rm -rf "$tmp_dir"
    CURRENT_TMP_DIR=""
    continue
  fi

  mkdir -p "$target_dir"

  log "  Copie de src/ vers '$target_dir' (exclusions : ${EXCLUDED_FILES[*]})..."

  # Construction dynamique des arguments d'exclusion pour rsync
  rsync_excludes=()
  for excl in "${EXCLUDED_FILES[@]}"; do
    rsync_excludes+=(--exclude "$excl")
  done

  if command -v rsync >/dev/null 2>&1; then
    rsync -a "${rsync_excludes[@]}" "$src_path"/ "$target_dir"/
  else
    # Fallback sans rsync : copie tout puis supprime les fichiers exclus
    cp -R "$src_path"/. "$target_dir"/
    for excl in "${EXCLUDED_FILES[@]}"; do
      find "$target_dir" -maxdepth 1 -name "$excl" -exec rm -f {} \;
    done
  fi

  rm -rf "$tmp_dir"
  CURRENT_TMP_DIR=""

  log "  ✔ Plugin '$repo_name' installé dans '$target_dir'."
done

echo ""
log "Terminé."

param(
  [string]$Project,        # target project name (CN)
  [string]$Category,       # target category name (CN)
  [string]$Prefix,         # target category page prefix (en), e.g. club
  [string]$SubPrefix,      # target detail sub prefix (en), if differs from $Prefix
  [string]$SrcProject,     # source project (CN), e.g. it equals 工程项目
  [string]$SrcCategory,    # source category (CN), e.g. 书局
  [string]$SrcPrefix = "bookstore" # source detail prefix (en) - ASCII ok
)

$ErrorActionPreference = 'Stop'

$sub = if ($SubPrefix) { $SubPrefix } else { $Prefix }

# --- source semantic names from src detail page 1 (caption) ---
$srcPage = "$SrcPrefix-1.html"
$sc = Get-Content $srcPage -Raw -Encoding UTF8
$srcSem = @([regex]::Matches($sc,'<div class="collection-detail-caption">\s*<h4>(.*?)</h4>',[System.Text.RegularExpressions.RegexOptions]::Singleline) | ForEach-Object { $_.Groups[1].Value.Trim() } | Select-Object -First 5)
if ($srcSem.Count -ne 5) { Write-Output "[ERR] src sem count = $($srcSem.Count)"; exit 1 }

# --- target semantic names from target detail page 1 ---
$tPage1 = "$sub-1.html"
if (-not (Test-Path $tPage1)) { Write-Output "[ERR] missing $tPage1"; exit 1 }
$tc = Get-Content $tPage1 -Raw -Encoding UTF8
$tarSem = @([regex]::Matches($tc,'<div class="collection-detail-caption">\s*<h4>(.*?)</h4>',[System.Text.RegularExpressions.RegexOptions]::Singleline) | ForEach-Object { $_.Groups[1].Value.Trim() } | Select-Object -First 5)
if ($tarSem.Count -ne 5) { Write-Output "[ERR] target sem count = $($tarSem.Count)"; exit 1 }

# --- 8-grid images (category page) ---
$gridDir = "img\{0}\{1}" -f $Project,$Category
New-Item -ItemType Directory -Force -Path $gridDir | Out-Null
for ($n=1; $n -le 8; $n++) {
  $src = "img\{0}\{1}\{2}-{3}-{4}.png" -f $SrcProject,$SrcCategory,$SrcProject,$SrcCategory,$n
  $dst = "img\{0}\{1}\{2}-{3}-{4}.png" -f $Project,$Category,$Project,$Category,$n
  Copy-Item $src $dst -Force
}

# --- detail images: category1..8 folders with 5 semantic images each ---
for ($k=1; $k -le 8; $k++) {
  $folder = "img\{0}\{1}\{2}{3}" -f $Project,$Category,$Category,$k
  if (Test-Path $folder) { Remove-Item $folder -Recurse -Force }
  New-Item -ItemType Directory -Force -Path $folder | Out-Null
  for ($i=0; $i -lt 5; $i++) {
    $src = "img\{0}\{1}\{2}1\{3}1-{4}.png" -f $SrcProject,$SrcCategory,$SrcCategory,$SrcCategory,$srcSem[$i]
    $dst = "{0}\{1}{2}-{3}.png" -f $folder,$Category,$k,$tarSem[$i]
    Copy-Item $src $dst -Force
  }
}

# --- update category page (8-grid) references ---
$gridPage = "$Prefix.html"
if (Test-Path $gridPage) {
  $g = Get-Content $gridPage -Raw -Encoding UTF8
  $go = $g
  # hrefs on category page point to detail sub pages ($sub)
  $pat = "<a href=`"$sub-([0-9]+)\.html`" class=`"collection-item`""
  $rep = "<a href=`"$sub-`$1.html`" class=`"collection-item`" style=`"background-image:url('img/$Project/$Category/$Project-$Category-`$1.png'); background-size:cover; background-position:center;`""
  $g = [regex]::Replace($g,$pat,$rep)
  if ($g -ne $go) { Set-Content -LiteralPath $gridPage -Value $g -Encoding UTF8 -NoNewline }
}

# --- update 8 detail pages media references ---
for ($k=1; $k -le 8; $k++) {
  $p = "$sub-$k.html"
  if (-not (Test-Path $p)) { continue }
  $c = Get-Content $p -Raw -Encoding UTF8
  $script:kk = $k
  $script:sems = $tarSem
  $script:counter = 0
  $script:proj = $Project
  $script:cat  = $Category
  $cb = [System.Text.RegularExpressions.MatchEvaluator]{
    $ci = $script:counter; $script:counter = $ci + 1
    $sem = $script:sems[$ci]; $kk = $script:kk; $p_ = $script:proj; $ct = $script:cat
    '<div class="collection-detail-media" style="background-image:url(' + "'" + ('img/{0}/{1}/{2}{3}/{4}{5}-{6}.png' -f $p_,$ct,$ct,$kk,$ct,$kk,$sem) + "'" + '); background-size:cover; background-position:center;"'
  }
  $c = [regex]::Replace($c,'<div class="collection-detail-media"[^>]*>',$cb)
  Set-Content -LiteralPath $p -Value $c -Encoding UTF8 -NoNewline
}

Write-Output "[$Category] DONE | sems: $($tarSem -join ', ')"


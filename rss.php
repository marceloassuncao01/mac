<?php
// Permite acesso de qualquer origem
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/xml; charset=UTF-8");

// Usa cURL para maior compatibilidade
$url = "https://livecoins.com.br/feed/";
$ch = curl_init($url);
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_TIMEOUT => 10,
  CURLOPT_USERAGENT => "Mozilla/5.0 (RSS Proxy)"
]);
$conteudo = curl_exec($ch);
$erro = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($erro || $httpCode >= 400 || !$conteudo) {
  http_response_code(502);
  echo "<error>Falha ao obter o feed</error>";
  exit;
}

echo $conteudo;

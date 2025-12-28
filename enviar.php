<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Captura e sanitiza os dados do formulário
    $nome = htmlspecialchars($_POST['nome']);
    $email = htmlspecialchars($_POST['email']);
    $mensagem = htmlspecialchars($_POST['mensagem']);

    // Configuração do e-mail de destino
    $to = "contato@seudominio.com"; // substitua pelo seu e-mail da Hostinger
    $subject = "Mensagem recebida pelo site";
    $body = "Nome: $nome\nEmail: $email\nMensagem:\n$mensagem";
    $headers = "From: $email";

    // Envia o e-mail
    if (mail($to, $subject, $body, $headers)) {
        echo "<p style='color:lime;'>Mensagem enviada com sucesso!</p>";
    } else {
        echo "<p style='color:red;'>Erro ao enviar a mensagem. Tente novamente.</p>";
    }
}
?>

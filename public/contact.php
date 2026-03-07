<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

require __DIR__ . '/../mail-config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

$data = json_decode(file_get_contents('php://input'), true);

// Honeypot anti-spam
$honeypot = trim($data['website'] ?? '');
if ($honeypot !== '') {
    echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès.']);
    exit;
}

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$companyType = trim($data['company_type'] ?? '');
$message = trim($data['message'] ?? '');

if (!$name || !$email || !$companyType || !$message) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Tous les champs sont requis.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Adresse email invalide.']);
    exit;
}

try {
    $mail = new PHPMailer(true);
    $mail->CharSet = 'UTF-8';
    $mail->isSMTP();
    $mail->Host       = MAIL_SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = MAIL_SMTP_USER;
    $mail->Password   = MAIL_SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = MAIL_SMTP_PORT;

    $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
    $mail->addAddress(MAIL_TO);
    $mail->addReplyTo($email, $name);

    $mail->Subject = '[Rhizia] Nouveau message de ' . $name;
    $mail->Body    = "Nom : $name\nEmail : $email\nType d'entreprise : $companyType\n\nMessage :\n$message";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => "Erreur lors de l'envoi du message."]);
}

<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    $password = $_POST['password'];
    if (strlen($password) === 0) {
        echo "No password provided.";
        exit;
    }
    $sha1 = strtoupper(sha1($password));
    $prefix = substr($sha1, 0, 5);
    $suffix = substr($sha1, 5);
    $url = "https://api.pwnedpasswords.com/range/" . $prefix;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'CyberPasswordAnalyzer/1.0');
    // Uncomment the next line if testing locally and having SSL issues
    // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);
    if ($response === false) {
        echo "Error connecting to breach database. CURL error: " . htmlspecialchars($error);
        exit;
    }
    $found = false;
    $lines = explode("\n", $response);
    foreach ($lines as $line) {
        $line = trim($line);
        if (stripos($line, $suffix) === 0) {
            $found = true;
            $count = intval(explode(':', $line)[1]);
            echo "⚠️ Password found in public data breaches (" . $count . " times). Avoid using it!";
            exit;
        }
    }
    echo "✅ This password was NOT found in known breaches. (Still, use a unique password for each site!)";
}
?>
<?php
// Connection to database
try {
    $db = new PDO(
        'mysql:host=localhost;dbname=dwwmtodo;charset=utf8',
        'root',
        '',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION // Enable error handling
        ]
    );
} catch (Exception $e){
    // Error logging handling (send by email, write to a log file)
    die("Connexion refusée à la base de données. ".$e->getMessage());
}

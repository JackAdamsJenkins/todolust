<?php

// Gérer les CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Authorization, Access-Control-Allow-Headers');

// Si la méthode est OPTIONS, on renvoie une réponse vide
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


require_once 'connect.php';
try {
    // Faire le code qui récupère les données de la base de données SI on les demande (get)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $req = $db->prepare('SELECT * FROM tasks');
        $req->execute();
        $tasks = $req->fetchAll();
        echo json_encode(['success' => true, 'tasks' => $tasks]);
    }

    // Si on est sur la méthode POST, on ajoute la tâche
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        // Si je récupère la donnée task, je l'ajoute à la BDD
        if(!empty($data['task'])){
            $req = $db->prepare('INSERT INTO tasks(task, status) VALUES (:task, :status)');
            $req->execute(['task' => $data['task'], 'status' => 'todo']);

            // Si la tâche a été ajoutée, je renvoie la tâche avec un succès
            if($req->rowCount() > 0){
                echo json_encode(['success' => true, 'task' => $data['task']]);
            }
        }

        if(!empty($data['id']) && !empty($data['status'])){
            $req = $db->prepare('UPDATE tasks SET status = :status WHERE id = :id');
            $req->execute(['status' => $data['status'], 'id' => $data['id']]);

            // Si la tâche a été ajoutée, je renvoie la tâche avec un succès
            if($req->rowCount() > 0){
                echo json_encode(['success' => true]);
            }
        }
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
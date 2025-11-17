// #include <SimpleAmqpClient/SimpleAmqpClient.h>
#include <fstream>
#include <sstream>
#include <iostream>
#include <vector>
#include <thread>
#include <chrono>
// #include <nlohmann/json.hpp>
#include "Capteur.hpp"
#include "CapteurDataLoader.hpp"
#include "RabbitMQClient.hpp"
#include "ServeurCapteurs.hpp"




/*
using json = nlohmann::json;




// ------------------- Main -------------------
int main() {
    // Intervalle simulé 800 ns
    int64_t interval_ns = 800;

    // Serveur en boucle infinie
    ServeurCapteurs serveur("Data.json", "localhost", "capteurs_queue", interval_ns);
    serveur.run();

    return 0;
}

*/




// ------------------- Main -------------------
int main() {
    // Intervalle simulé en nanosecondes (ici 800 ns)
    int64_t interval_ns = 800;

    // Création du serveur (simulé)
    ServeurCapteurs serveur("Data.json", "localhost", "capteurs_queue", interval_ns);

    // Lancement de la boucle infinie
    serveur.run();

    return 0;
}

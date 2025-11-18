


#include "CapteurDataLoader.hpp"
#include <iostream>
#include <stdexcept>



CapteurDataLoader::CapteurDataLoader(const std::string& path) : filepath(path) {}

std::vector<Capteur> CapteurDataLoader::loadData() {
    std::vector<Capteur> capteurs;
    std::ifstream file(filepath);
    if (!file.is_open()) throw std::runtime_error("Impossible d'ouvrir: " + filepath);

    std::stringstream buffer;
    buffer << file.rdbuf();
    file.close();

    json data = json::parse(buffer.str());
    for (auto& item : data["capteurs"]) {
        Capteur c;
        c.id = item["id"];
        c.typeCapteur = item["typeCapteur"];
        c.valeurActuelle = item["valeurActuelle"];
        c.unite = item["unite"];
        c.seuilAlerte = item["seuilAlerte"];
        c.seuilCritique = item["seuilCritique"];
        c.etat = item["etat"];
        c.timestampDerniereMesure = item["timestampDerniereMesure"];
        c.localisation = item["localisation"];
        capteurs.push_back(c);
    }
    return capteurs;
}




/*

#include "CapteurDataLoader.hpp"
#include <vector>
#include <iostream>

CapteurDataLoader::CapteurDataLoader(const std::string& path) : filepath(path) {}

std::vector<Capteur> CapteurDataLoader::loadData() {
    // Simulation de capteurs pour test
    std::vector<Capteur> capteurs;
    capteurs.push_back({"c1","temperature",25.5,"C",30,40,"normal","2025-11-17T17:00:00","machine_1"});
    capteurs.push_back({"c2","pression",1.2,"bar",2,3,"normal","2025-11-17T17:00:00","machine_2"});
    return capteurs;
}
*/
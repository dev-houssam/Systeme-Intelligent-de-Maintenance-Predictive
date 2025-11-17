
/*
#ifndef CAPTEURDATALOADER_HPP
#define CAPTEURDATALOADER_HPP

#include <string>
#include <vector>
#include <fstream>
#include <sstream>
// #include <nlohmann/json.hpp>
#include "Capteur.hpp"





using json = nlohmann::json;

class CapteurDataLoader {
private:
    std::string filepath;
public:
    CapteurDataLoader(const std::string& path);

    std::vector<Capteur> loadData();
};

#endif // CAPTEURDATALOADER_HPP


*/



#ifndef CAPTEURDATALOADER_HPP
#define CAPTEURDATALOADER_HPP

#include <vector>
#include <string>
#include "Capteur.hpp"

class CapteurDataLoader {
private:
    std::string filepath;  // chemin du fichier (pour info, pas utilisé ici si simulation)
public:
    CapteurDataLoader(const std::string& path);

    // Charge les capteurs (ici on simule avec des valeurs codées)
    std::vector<Capteur> loadData();
};

#endif // CAPTEURDATALOADER_HPP

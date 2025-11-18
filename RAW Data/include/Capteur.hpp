#ifndef CAPTEUR_HPP
#define CAPTEUR_HPP

#include <string>
#include <nlohmann/json.hpp>




using json = nlohmann::json;

struct Capteur {
    std::string id;
    std::string typeCapteur;
    double valeurActuelle;
    std::string unite;
    double seuilAlerte;
    double seuilCritique;
    std::string etat;
    std::string timestampDerniereMesure;
    std::string localisation;

    std::string toJson() const {
        json j;
        j["id"] = id;
        j["typeCapteur"] = typeCapteur;
        j["valeurActuelle"] = valeurActuelle;
        j["unite"] = unite;
        j["seuilAlerte"] = seuilAlerte;
        j["seuilCritique"] = seuilCritique;
        j["etat"] = etat;
        j["timestampDerniereMesure"] = timestampDerniereMesure;
        j["localisation"] = localisation;
        return j.dump();
    }
};

#endif // CAPTEUR_HPP









/*
#include <sstream>

struct Capteur {
    std::string id;
    std::string typeCapteur;
    double valeurActuelle;
    std::string unite;
    double seuilAlerte;
    double seuilCritique;
    std::string etat;
    std::string timestampDerniereMesure;
    std::string localisation;

    std::string toJson() const {
        std::ostringstream oss;
        oss << "{"
            << "\"id\":\"" << id << "\","
            << "\"typeCapteur\":\"" << typeCapteur << "\","
            << "\"valeurActuelle\":" << valeurActuelle << ","
            << "\"unite\":\"" << unite << "\","
            << "\"seuilAlerte\":" << seuilAlerte << ","
            << "\"seuilCritique\":" << seuilCritique << ","
            << "\"etat\":\"" << etat << "\","
            << "\"timestampDerniereMesure\":\"" << timestampDerniereMesure << "\","
            << "\"localisation\":\"" << localisation << "\""
            << "}";
        return oss.str();
    }
};

#endif
*/
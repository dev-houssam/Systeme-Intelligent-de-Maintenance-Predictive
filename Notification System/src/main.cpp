#include <SimpleAmqpClient/SimpleAmqpClient.h>
#include <iostream>
#include <vector>
#include <memory>
#include <string>
#include "Notifier.hpp"
#include "MailNotifier.hpp"
#include "SMSNotifier.hpp"
#include "PushNotifier.hpp"
#include "MCPNotifier.hpp"
#include <nlohmann/json.hpp>

using json = nlohmann::json;

int main() {
    // --- Init notifiers ---
    std::vector<std::unique_ptr<Notifier>> notifiers;
    notifiers.push_back(std::make_unique<MailNotifier>());
    notifiers.push_back(std::make_unique<SMSNotifier>());
    notifiers.push_back(std::make_unique<PushNotifier>());
    notifiers.push_back(std::make_unique<MCPNotifier>());

    // --- RabbitMQ config ---
    const std::string EXCHANGE = "system_manager_notifier_exchange";
    const std::string ROUTING_KEY = "notification_alert";
    const std::string QUEUE = "notification_queue";

    AmqpClient::Channel::ptr_t channel;

    try {
        channel = AmqpClient::Channel::Create("localhost");
    } catch (...) {
        std::cerr << "❌ Impossible de se connecter à RabbitMQ !" << std::endl;
        return 1;
    }

    try {
        // Exchange
        channel->DeclareExchange(EXCHANGE,
                                 AmqpClient::Channel::EXCHANGE_TYPE_DIRECT,
                                 true);

        // Queue
        channel->DeclareQueue(QUEUE, true, false, false);

        // Bind
        channel->BindQueue(QUEUE, EXCHANGE, ROUTING_KEY);
    }
    catch (const std::exception& e) {
        std::cerr << "❌ Erreur déclaration exchange/queue: " << e.what() << std::endl;
        return 1;
    }

    std::cout << "🟢 Consumer prêt. En attente de messages..." << std::endl;

    // Consumer tag
    std::string consumer_tag = channel->BasicConsume(QUEUE, "", true, false, false);

    // ---------------------
    //   LOOP INFINI
    // ---------------------
        AmqpClient::Envelope::ptr_t envelope;

        try {

    if (!channel->BasicConsumeMessage(consumer_tag, envelope, 50)) {
        // Aucun message reçu dans les 500 ms → recommencer la boucle sans erreur
        //continue;
    }    

} catch (const std::exception& e) {
        std::cerr << "❌ Erreur réception message : " << e.what() << std::endl;
        //continue;
    }
   while (true) {



    // 👉 Aucun message reçu pendant 500ms
    if (!envelope) {
        // Tu peux faire autre chose ici (logs, check activité, timers...)
        //continue;
    }

    std::string body = envelope->Message()->Body();

    json data;
    try {
        auto data = json::parse(body);

        std::string sensorId = data.value("sensor_id", "unknown");
        std::string message  = data.value("message", "No message");
        std::string timestamp = data.value("timestamp", "unknown");
        std::string severity = data.value("severity", "info");

        // Champs ADT et IA : peuvent être null ou absents
        json adt = nullptr;
        json ia  = nullptr;

        if (data.contains("adt") && !data["adt"].is_null()) {
            adt = data["adt"];
        }

        if (data.contains("ia") && !data["ia"].is_null()) {
            ia = data["ia"];
        }

        if (data.contains("adt")) {
            std::cout << "[ADT] " << data["adt"].dump() << std::endl;
        }

        if (data.contains("ia")) {
            std::cout << "[IA] " << data["ia"].dump() << std::endl;
        }

        // → Maintenant tu peux passer ces valeurs à tes notifiers
        for (auto& notifier : notifiers) {
            notifier->sendNotification(sensorId, message, timestamp);
        }

        std::cout << "🔔 Notification traitée : " << message 
                << " (capteur " << sensorId << ")" << std::endl;

    } catch (const std::exception& e) {
        std::cerr << "❌ Erreur parsing JSON : " << e.what() << std::endl;
    }


    std::cout << "🔔 Notification envoyée.\n" << std::endl;
}


    return 0;
}

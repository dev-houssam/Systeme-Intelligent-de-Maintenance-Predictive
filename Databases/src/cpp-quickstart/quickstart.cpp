#include <cstdint>
#include <iostream>
#include <vector>

#include <bsoncxx/builder/basic/document.hpp>
#include <bsoncxx/json.hpp>
#include <mongocxx/client.hpp>
#include <mongocxx/instance.hpp>
#include <mongocxx/uri.hpp>

using bsoncxx::builder::basic::kvp;
using bsoncxx::builder::basic::make_document;

int main() {
    mongocxx::instance instance;
    mongocxx::uri uri("mongodb://umg_cycatrice:P_at_cyc4AuDB@127.0.0.1:30017/");
    mongocxx::client client(uri);
    auto db = client["maintenance_predictive"];
    auto collection = db["movies"];

    auto result = collection.find_one(make_document(kvp("title", "The Shawshank Redemption")));
    if (result) {
        std::cout << bsoncxx::to_json(*result) << std::endl;
    } else {
        std::cout << "No result found" << std::endl;
    }
}
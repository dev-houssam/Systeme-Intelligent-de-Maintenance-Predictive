# ------------------ Variables ------------------
CXX = g++
CXXFLAGS = -std=c++17 -O2 -Wall -I./include
LDFLAGS = -lpthread

#LDFLAGS = -lSimpleAmqpClient -lboost_system -lpthread

SRC_DIR = src
BIN_DIR = bin
OBJ_DIR = obj
TARGET = $(BIN_DIR)/serveur_capteurs

# Liste de tous les fichiers source
SRC = $(wildcard $(SRC_DIR)/*.cpp)
# Convertit les .cpp en .o
OBJ = $(patsubst $(SRC_DIR)/%.cpp, $(OBJ_DIR)/%.o, $(SRC))

# ------------------ Règles ------------------
all: $(TARGET)

# Lien final
$(TARGET): $(OBJ)
	@mkdir -p $(BIN_DIR)
	$(CXX) $(CXXFLAGS) $^ -o $@ $(LDFLAGS)
	@echo "Compilation terminée. Exécutable: $@"

# Compilation des objets
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp
	@mkdir -p $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Nettoyage
clean:
	rm -rf $(OBJ_DIR) $(TARGET)
	@echo "Fichiers objets et exécutable supprimés."

.PHONY: all clean

#!/bin/bash
#
source venvCyc/bin/activate
echo "Merci j'y suis, la preuve :"
pwd

#source activeEnvironment.sh

echo "### HELP ###"
echo "Commandes: "
echo "mongosh -u umg_cycatrice -p P_at_cyc4AuDB --authenticationDatabase maintenance_predictive"
sleep 5
mongosh -u umg_cycatrice -p P_at_cyc4AuDB --authenticationDatabase maintenance_predictive


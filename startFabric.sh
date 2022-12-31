set -e

export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
CC_SRC_LANGUAGE=${1:-"javascript"}
CC_SRC_LANGUAGE=`echo "$CC_SRC_LANGUAGE" | tr [:upper:] [:lower:]`

CC_SRC_PATH="../rice-supply-chain/chaincode/"

echo ${CC_SRC_LANGUAGE}  ${CC_SRC_PATH}

# clean old identites in the wallets
rm -rf app/wallet/*

# launch network
pushd ../test-network
./network.sh down
./network.sh up createChannel -ca -c channel1 -s couchdb
cd addOrg3
./addOrg3.sh up -ca -c channel1
cd ..
./network.sh deployCC -c channel1 -ccn rsc -ccv 1 -cci initLedger -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_PATH}
popd

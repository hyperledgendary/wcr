peer lifecycle chaincode package cp.tar.gz --lang node --path . --label cp_1
peer lifecycle chaincode install cp.tar.gz

peer lifecycle chaincode approveformyorg  --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
                                                --channelID mychannel  \
                                                --name papercontract  \
                                                -v 3  \
                                                --package-id $PACKAGE_ID \
                                                --sequence 5  \
                                                --tls  \
                                                --cafile $ORDERER_CA

      peer lifecycle chaincode commit -o localhost:7050 \
                                --peerAddresses localhost:7051 --tlsRootCertFiles ${PEER0_ORG1_CA} \
                                --peerAddresses localhost:9051 --tlsRootCertFiles ${PEER0_ORG2_CA} \
                                --ordererTLSHostnameOverride orderer.example.com \
                                --channelID mychannel --name papercontract -v 3 \
                                --sequence 5 \
                                --tls --cafile $ORDERER_CA --waitForEvent 


peer chaincode query -o localhost:7050 --channelID mychannel --name papercontract -c '{"Args":["my-first-contract:my_first_transaction","hello"]}' --tls --cafile $ORDERER_CA --ordererTLSHostnameOverride orderer.example.com

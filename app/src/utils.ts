import jwt_decode from "jwt-decode";
import UTIdeaPatentContract from "./contracts/UTIdeaPatent.json"
import DocDexContract from "./contracts/DocDex.json"



// function that check for a JWT Token instance
export function verifyJwtValidity(token: any) {
    // ski checking if the token is null
    if (!token) return false
    try {
        // decode the token
        const decoded: any = jwt_decode(token)
        // check validity by current timestamp 
        // and expiration timestamp comparison
        const diff = decoded.exp - Math.floor(Date.now() / 1000)

        if (diff > 0) {
            return true
        }
    } catch (error) {
        // decoding error logged to the console
        console.error(error)
    }
    return false
}


// request smart contract instance

export function getUTIdeaContract(web3: any): Object {
    // get contract networks
    const UTNetworks = UTIdeaPatentContract.networks
    // get first network
    const UTNetworkId = Object.keys(UTNetworks)[0] as keyof typeof UTNetworks
    let UTdeployedNetwork: any = UTIdeaPatentContract.networks[UTNetworkId]
    
    // create contract instance
    const UIinstance = new web3.eth.Contract(
        UTIdeaPatentContract.abi,
        UTdeployedNetwork && UTdeployedNetwork.address
    )
    return UIinstance
}


export function getUTDocDexContract(web3: any): Object {
    // get contract networks
    const docDexNetworks = DocDexContract.networks
    // get first network
    const docDexNetworkId = Object.keys(docDexNetworks)[0] as keyof typeof docDexNetworks
    let DocDexDeployedNetwork: any = DocDexContract.networks[docDexNetworkId]
    
    // create contract instance
    const DocDexInstance = new web3.eth.Contract(
        DocDexContract.abi,
        DocDexDeployedNetwork && DocDexDeployedNetwork.address
    )
    return DocDexInstance
}
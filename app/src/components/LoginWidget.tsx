import axios from "../api"
import { Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { setJwtToken, setLoggedin } from "../store/AuthSlice"
import metamaskLogoFull from '../ressources/metamask-fox-wordmark-horizontal.svg';
import metamaskLogoLess from '../ressources/metamask-fox.svg';
import { RootState } from "../store"


export function LoginWidget(props: any) {

    // get current login state
	const dispatch = useDispatch()
	const loggedin = useSelector<RootState, boolean>((state) => state.auth.loggedin)

	const address = props.address
	const adressLength = props.address.length

    // compute public address mask for more readability
	const addressMask = address.substring(0, 10) + "..." + address.substring(adressLength - 4, adressLength)
	
    // make a login request
    const loginRequest = async () => {
        // login endpoint on the backend
		let endpoint = `auth/nonce/${address}`
        // get login nonce from the backend
		const { data: nonce } = await axios.get(endpoint)

        // sign the nonce with the current private key
		const signedMessage = await props.web3.eth.personal.sign(
			props.web3.utils.utf8ToHex(nonce),
			address,
		)
        // compose credentials with address and signature of the nonce
		const credentials = {
			username: address,
			password: signedMessage,
		}
        // login endpoint
		endpoint = `auth/login`
        try {
            // request JWT token from the backend
            const { data: token } = await axios.post(endpoint, credentials)
            // save JWT token on store and localstorage
            window.localStorage.setItem('jwtToken', token.access_token)
            dispatch(setJwtToken(token.access_token))
            dispatch(setLoggedin(true))
        } catch (error) {
            // request fail if the signature is the wrong one
        }
	}

	const logoutRequest = () => {
        // remove JWT token if logout is requested
		dispatch(setJwtToken(''))
		dispatch(setLoggedin(false))
		window.localStorage.setItem('jwtToken', '')
	}
	if (!loggedin) {
		return (
			<Button variant="outline-light" size="sm" onClick={loginRequest}>
				<img src={metamaskLogoFull} height="20" alt="Metamask logo"/> Connexion
			</Button>
		)
	} else {
		return (
			<Button variant="outline-light" size="sm" onClick={logoutRequest}>
				<img src={metamaskLogoLess} height="22" alt="Metamask logo"/>Déconnexion ({addressMask})
			</Button>
		)
	}
}
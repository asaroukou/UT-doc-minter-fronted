import { useEffect, useState } from "react"
import { RootState } from './store'
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom"
import { LinkContainer } from "react-router-bootstrap"
import getWeb3 from "./getWeb3"
import {
	Navbar,
	Nav,
	Container,
	Row,
	Col,
	Spinner,
	Button
} from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import { Ideas } from "./components/Ideas"

import "./App.css"
import { Publications } from "./components/publications"
import { Submit } from "./components/submit"
import { SubmitFile } from "./components/submit-file"
import { UserContainer } from "./components/user"

import { useSelector, useDispatch } from 'react-redux'
import { setJwtToken, setLoggedin } from './store/AuthSlice'
import { create as IPFSClient } from 'ipfs-http-client'

import { LoginWidget } from "./components/LoginWidget"
import { verifyJwtValidity, getUTIdeaContract, getUTDocDexContract } from "./utils"
import About from "./components/About"

function App() {

	// get redux store selector
	const jwtToken = useSelector<RootState, string>((state) => state.auth.jwtToken)
	const loggedin = useSelector<RootState, boolean>((state) => state.auth.loggedin)

	const dispatch = useDispatch()

	// init current application state
	const [web3, setWeb3] = useState<any>({})
	const [accounts, setAccounts] = useState<Array<any>>([])
	const [docDexContract, setDocDexContract] = useState<Object>({})
	const [patentContract, setPatentContract] = useState<Object>({})
	const [loading, setLoading] = useState<boolean>(true)
	const [ipfs, setIpfs] = useState<Object>({})

	useEffect(() => {
		async function loadWeb3() {
			try {

				// Create a web3 Instance
				const web3 = await getWeb3()

				// request current wallet account list 
				const accounts = await web3.eth.getAccounts()

				// get Smart Contract instances
				const UIinstance = getUTIdeaContract(web3)
				const DocDexInstance = getUTDocDexContract(web3)


				//Define IPFS Authentication token
				const projectId = '...'
				const projectSecret = '...'
				const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

				// get IPFS Instance with defined options
				const option = {
					host: 'ipfs.infura.io',
					port: 5001,
					protocol: 'https',
					headers: {
						authorization: auth
					}
				}
				const ipfsClient = IPFSClient(option)

				// Check if user in loggedin
				const jwtToken = window.localStorage.getItem('jwtToken')
				const loggedin = verifyJwtValidity(jwtToken)

				// set application state and dispatch to store
				setAccounts(accounts)
				dispatch(setJwtToken(jwtToken))
				dispatch(setLoggedin(loggedin))
				setPatentContract(UIinstance)
				setDocDexContract(DocDexInstance)
				setWeb3(web3)
				setIpfs(ipfsClient)
				setLoading(false)

			} catch (error) {
				// Catch any errors for any of the above operations.
				alert(
					`Failed to load web3, accounts, or contract. Check console for details.`
				)
				console.error(error)
			}
		}
		loadWeb3()
	})
	const explorerUrl = `https://rinkeby.etherscan.io/address/${accounts[0]}#tokentxnsErc721`
	if (loading) {
		return (
			<Container className="">
				<Row className="justify-content-center align-items-center text-center loading-container" >
					<Col lg="6">
						<Spinner animation="border" role="status" variant="primary">
						</Spinner>
						<div className="text-primary">Loading Web3, accounts, and smart contract. <b>Please, make sure you have a web3 wallet installed with Rinkeby as selected network...</b></div>
					</Col>
				</Row>
			</Container>
		)
	}


	return (
		<div className="App">
			<Router>
				<AppNavbar jwtToken={jwtToken} loggedin={loggedin} address={accounts[0]} web3={web3} />
				<Switch>
					<Route path="/user/:address">
						<UserContainer instance={patentContract} web3={web3} />
					</Route>
					<Route path="/user">
						<UserContainer
							web3={web3}
							instance={patentContract}
							address={accounts[0]}
						/>
					</Route>
					<Route path="/submit">
						<Submit
							instance={patentContract}
							accounts={accounts}
							web3={web3}
						/>
					</Route>
					<Route path="/submit-new-file">
						<SubmitFile
							patentContract={patentContract}
							docContract={docDexContract}
							accounts={accounts}
							web3={web3}
							ipfs={ipfs}
						/>
					</Route>
					<Route path="/about">
						<About />
					</Route>
					<Route path="/ideas">
						<Ideas instance={patentContract} web3={web3} />
					</Route>

					<Route path="/">
						<Publications instance={patentContract} />
					</Route>
				</Switch>
				{loggedin && (<Navbar fixed="bottom" bg="primary" variant="light" className="text-center">

					<Button variant="link" color="light" size="sm" href={explorerUrl} target="_blank" className="mr-3 text-light">
						<small>Explore my history: <b>{explorerUrl}</b></small>
					</Button>

				</Navbar>)}
			</Router>
		</div>
	)

}

type AppNavbarProps = {
	loggedin: boolean,
	jwtToken: string,
	address: string,
	web3: any,
}

function AppNavbar(props: AppNavbarProps) {

	let userAuthenticatedSection = <></>

	if (props.loggedin) {
		userAuthenticatedSection =
			<>
				<LinkContainer to="/user">
					<Nav.Link>Mes idées</Nav.Link>
				</LinkContainer>
				<LinkContainer to="/submit-new-file">
					<Nav.Link>Soumettre publication</Nav.Link>
				</LinkContainer>
				<LinkContainer to="/submit">
					<Nav.Link>Soumettre idée</Nav.Link>
				</LinkContainer>
			</>
	}

	return <>
		<Navbar bg="primary mb-5" variant="dark">
			<Navbar.Brand href="#home">utDOC MINTER</Navbar.Brand>
			<Nav className="mr-auto">
				<LinkContainer to="/">
					<Nav.Link>Publications</Nav.Link>
				</LinkContainer>
				<LinkContainer to="/ideas">
					<Nav.Link>Idées</Nav.Link>
				</LinkContainer>
				{userAuthenticatedSection}
				<LinkContainer to="/about">
					<Nav.Link>À propos (About)</Nav.Link>
				</LinkContainer>
			</Nav>
			<span className="text-white mr-2">(Rinkeby)</span> <LoginWidget jwtToken={props.jwtToken} loggedin={props.loggedin} address={props.address} web3={props.web3} />
		</Navbar>
	</>
}

export default App


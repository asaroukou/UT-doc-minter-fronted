import React, { useState } from "react";
import {
	Button,
	Form,
	Container,
	Row,
	Col,
	Alert,
	Spinner,
} from "react-bootstrap";

type SubmitProps = {
	web3: any,
	accounts: any[],
	instance: any,
}

export function Submit(props: SubmitProps) {
	const idea: any = {
		name: React.createRef(),
		description: React.createRef(),
	}
	const [msg, setMsg] = useState<{ type: string, text: string }>({ type: '', text: '' })
	const [pending, setPending] = useState<boolean>(false)

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		setPending(true)
		let ideaName = idea.name.current.value
		let ideaDescription = idea.description.current.value
		ideaName = props.web3.utils.utf8ToHex(ideaName)
		ideaDescription = props.web3.utils.utf8ToHex(ideaDescription)

		try {
			if (ideaDescription.length === 0 || ideaName === 0) {
				throw new Error("Idea name and description should be filled");
			}
			const { createIdea } = props.instance.methods
			await createIdea(ideaName, ideaDescription)
				.send({
					from: props.accounts[0],
				})
			setMsg({ type: "success", text: "Your idea has been submited" })
			idea.name.current.value = "";
			idea.description.current.value = "";
		} catch (error) {
			setMsg({
				type: "danger",
				text: `Une erreur est survenu. ${error.message}`,
			})
		}
		setPending(false)
	}


	let alertMessage;
	if (msg && msg.type) {
		alertMessage = <Alert variant={msg.type}>{msg.text}</Alert>;
	}
	return (
		<>
			<Container>
				<Row className="justify-content-center">
					<Col lg="6"><h3>Soumettre une idée</h3>
						{alertMessage}
						<Form onSubmit={handleSubmit}>
							<fieldset disabled={pending}>
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Label>Titre</Form.Label>
									<Form.Control
										type="text"
										placeholder=""
										ref={idea.name}
									/>
								</Form.Group>

								<Form.Group controlId="exampleForm.ControlTextarea1">
									<Form.Label>Description</Form.Label>
									<Form.Control
										ref={idea.description}
										as="textarea"
										rows={3}
										placeholder="Décrire votre idée..."
									/>
								</Form.Group>
								<Button variant="primary" type="submit">
									{pending ? <Spinner
										as="span"
										animation="border"
										size="sm"
										role="status"
										aria-hidden="true"
									/> : <></>}
									{pending ? "En cours..." : "Soumettre"}
								</Button>
							</fieldset>
						</Form>
					</Col>
				</Row>
			</Container>
		</>
	);

}

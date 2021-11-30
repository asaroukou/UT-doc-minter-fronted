import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
} from "react-bootstrap"
import fileIcon from '../ressources/file.svg';

import { LinkContainer } from "react-router-bootstrap";
import { Card, } from "react-bootstrap";

type IdeasProps = {
  instance?: any,
  web3: any,
}

export function Ideas(props: IdeasProps) {

  const [data, setData] = useState<Array<Idea>>([])


  useEffect(() => {
    // init the state with ideas
    async function initData() {
      /** get function of smart contract instance
       * tokenIdToIdeaInfo: return data about an Idea with i index
       * totalSupply: return the total minted token by the SC (total of ideas)
       * ownerOf: return owner address of given Idea index
      */
      const { tokenIdToIdeaInfo, totalSupply, ownerOf } =
        props.instance.methods;
      
      // get total supply
      const tokenSupply = await totalSupply().call();

      const data = [];
      // load all fetched ideas on the component's state
      for (let i = 1; i <= tokenSupply; i++) {
        const tokenData = await tokenIdToIdeaInfo(i).call();
        const owner = await ownerOf(i).call();
        try {
          const idea: Idea = {
            id: i,
            name: props.web3.utils.hexToUtf8(tokenData.name),
            description: props.web3.utils.hexToUtf8(tokenData.description),
            owner: owner,
          }
          data.push(idea);
        } catch (error) {

        }
      }
      setData(data)
    }

    initData()
  })




  return (
    <>
      <Container>
        <h3>Liste des idées</h3><br />
        {
          data.length === 0
            ?
            <>
              <br /><br /><br />
              <Row className="align-items-center justify-content-center flex-column py-5">
                <img src={fileIcon} alt="" width="100" className="mb-2" />
                Section vide
              </Row>
            </>
            :
            <Row xs={2} md={3} lg={3}>
              {
                data.map((idea, key) => {
                  return (
                    <Col key={key} className="mb-4">
                      <PatentCard idea={idea} />
                    </Col>
                  );
                })
              }
            </Row>
        }
      </Container>
    </>
  );

}


type PatentCardProps = {
  idea: Idea,
}

export type Idea = {
  id: number,
  name: string,
  description: string,
  owner: string,
}

export function PatentCard(props: PatentCardProps) {
  const userUrl = `/user/${props.idea.owner}`;
  return (
    <Card>
      <Card.Header>
        <Card.Title>{props.idea.name}</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Subtitle className="mb-2 text-truncate" />
        <Card.Text>{props.idea.description}</Card.Text>
        <LinkContainer to={userUrl}>
          <small className="author-link">Auteur: {props.idea.owner}</small>
        </LinkContainer>
        <br />
        <small>Numéro d'ordre <b>#{props.idea.id}</b></small>
      </Card.Body>
    </Card>
  );
}



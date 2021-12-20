import React, { useEffect, useState } from "react";
import { BsGithub, BsTwitter, BsLinkedin } from 'react-icons/bs';
import {
    Container,
    Row,
    Col,
} from "react-bootstrap"


export default function About() {
    return <Container>
        <Row>
            <Col sm md={8}>

                <h3>À propos de ce projet</h3>
                <p>Le but de ce projet est de proposer une plateforme de prépublication scientifique. La
                    caractéristique principale de l’application est de proposer à l’auteur d’émettre une preuve
                    incontestable (non répudiable), irrévocable et simplement vérifiable (intégrité) de la mise en
                    ligne d’un document. Afin de marquer cette preuve d’existence dans le temps, une blockchain
                    sera utilisée comme registre distribuée afin de sauvegarder durablement l’information et
                    permettre la vérification de cette preuve par n’importe quelle entité le souhaitant.</p>
                <p>Chaque `preuve` est un NFT (Non, Fungible Token) émis sur la blockchain Ethereum sous la forme d'un ERC721.
                    Le document est quand à lui sauvegrader sur IPFS.
                </p>
                <p>Pour plus de contexte sur ce projet, <a target="_blank" href="https://ipfs.io/ipfs/bafybeig5b3zi3lmxyh7a6ik5cfmxhc5uca22j23rpl7wiybf4cvybwfpvy">consulter le rapport complet sur IPFS ici</a>.</p>


                <h3>About this project</h3>
                <p>The aim of this project is to provide a platform for scientific prepublication. The main feature of the application is to offer the author to issue indisputable (non-repudiable), irrevocable and simply verifiable (integrity) proof of the uploading of a document. In order to mark this proof of history over time, a blockchain will be used as a distributed ledger in order to sustainably safeguard the information and allow verification of this proof by any entity wishing to do so.
                </p>
                <p>Each `proof` is an NFT (No, Fungible Token) issued on the Ethereum blockchain in the form of an ERC721. The document is when to save it on IPFS.

                </p>
                <p>For more context on this project, <a target="_blank" href="https://ipfs.io/ipfs/bafybeig5b3zi3lmxyh7a6ik5cfmxhc5uca22j23rpl7wiybf4cvybwfpvy">read the full report save on IPFS here</a>.
                </p>

            </Col>
            <Col sm md={4}>

                <h4>Follow me: </h4>
                <ul className="social-networks">
                    <li><a href="https://github.com/asaroukou">Github <BsGithub /></a></li>
                    <li><a href="https://twitter.com/AbdelMbyas">Twitter <BsTwitter /></a></li>
                    <li><a href="https://www.linkedin.com/in/abdel-saroukou/">Linkedin <BsLinkedin /></a></li>
                </ul></Col>
        </Row>
    </Container>
}



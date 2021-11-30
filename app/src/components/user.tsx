import React, { useEffect, useState } from "react";
import {
    useParams,
} from "react-router-dom";
import {
    Container,
    Row,
    Col
} from "react-bootstrap";
import { Idea, PatentCard } from "./Ideas"
import fileIcon from '../ressources/file.svg';

type UserContainerProps = {
    address?: any,
    instance: any,
    web3: any
}

export function UserContainer(props: UserContainerProps) {
    // get address on current url path
    let { address }: any = useParams();
    let isLocal = false;
    if (!address) {
        isLocal = true;
        address = props.address;
    }

    return (
        <>
            <User address={address} instance={props.instance} isLocal={isLocal} web3={props.web3} />
        </>
    );
}

type UserProps = {
    address: string,
    instance: any,
    isLocal: boolean,
    web3: any,
}

export function User(props: UserProps) {

    const [data, setData] = useState<Array<Idea>>([])

    useEffect(() => {
        async function initData() {
            /** get function of smart contract instance
             * tokenIdToIdeaInfo: return data about an Idea with i index
             * balanceOf: return the total minted token owned by an address
             * ownerOf: return owner address of given Idea index
             * tokenOfOwnerByIndex: return all token index for a given address
             */
            const {
                tokenOfOwnerByIndex,
                balanceOf,
                tokenIdToIdeaInfo,
                ownerOf
            } = props.instance.methods;

            // get address token balance
            const tokenBalance = await balanceOf(props.address).call()
            const data: Array<Idea> = [];

            //fetch all address token details
            for (let i = 0; i < tokenBalance; i++) {
                const tokenDataId = await tokenOfOwnerByIndex(
                    props.address,
                    i
                ).call();
                const tokenData = await tokenIdToIdeaInfo(tokenDataId).call()
                const owner = await ownerOf(tokenDataId).call()
                const idea = {
                    id: tokenDataId,
                    name: props.web3.utils.hexToUtf8(tokenData.name),
                    description: props.web3.utils.hexToUtf8(tokenData.description),
                    owner: owner,
                }
                data.push(idea)
            }
            // save the address token details
            setData(data)
        }
        initData()
    })


    return (
        <>
            <Container>
                <div>
                    {props.isLocal ? (
                        <h3>Mes idées</h3>
                    ) : (
                        <h3>Idées de: {props.address}</h3>
                    )}
                </div><br />

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
                            {data.map((idea, key) => {
                                return (
                                    <Col key={key} className="mb-4">
                                        <PatentCard idea={idea} />
                                    </Col>
                                );
                            })}
                        </Row>
                }
            </Container>
        </>
    );

}



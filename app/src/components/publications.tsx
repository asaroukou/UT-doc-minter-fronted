import React, { useEffect, useState } from "react";
import { BsDownload } from 'react-icons/bs';

import axios from "../api"
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Badge
} from "react-bootstrap";
import { CID } from 'ipfs-http-client'

import { Card, } from "react-bootstrap";
import fileIcon from '../ressources/file.svg';

type PublicationsProps = {
  instance?: any,
}


export function Publications(props: PublicationsProps) {

  const [data, setData] = useState<Array<any>>([])
  const [filterEnabled, setFilterEnabled] = useState<boolean>(false)
  const [categories, setCategories] = useState<Array<any>>([])
  const [orderedCategories, setOrderedCategories] = useState<any>({})

  const filters: any = {
    category: React.createRef(),
    author: React.createRef(),
  }

  const resetForm = async () => {
    await fetchData()
  }

  const fetchData = async () => {
    const { data } = await axios.get('/document')
    setData(data)
    setFilterEnabled(false)
  }

  useEffect(() => {
    async function initData() {
      const { data: categories } = await axios.get('/category')
      const orderedCategories: any = {}
      for (let i = 0; i < categories.length; i++) {
        orderedCategories[categories[i]['id']] = categories[i]['name']
      }
      setCategories(categories)
      setOrderedCategories(orderedCategories)
      await fetchData()
    }
    initData()
  }, [])



  const filter = async (event: React.FormEvent) => {
    event.preventDefault()
    const author = filters.author.current.value
    const category = filters.category.current.value
    const endpoint = `/document/filter/?author=${author}&category=${category}`
    const { data } = await axios.get(endpoint)
    setData(data)
    setFilterEnabled(true)

  }


  const categoriesOption = categories?.map(el => {
    return <option key={el.id} value={el.id}>{el.name}</option>
  })
  return (
    <>
      <Container>
        <Row className="d-flex">
          <Col xs={3} className="mr-auto">
            <h3>{
              filterEnabled
                ?
                <span>Résultats <small className="text-primary" onClick={() => resetForm()}>(Effacer)</small></span>
                :
                'Publications'
            }
            </h3>
          </Col>
          <Col><Form onSubmit={filter}>
            <Form.Row className="align-items-center justify-content-end">
              <Col xs="auto" className="my-1">

                <Form.Control
                  as="select"
                  className="mr-sm-2"
                  id="inlineFormCustomSelect"
                  custom
                  ref={filters.category}
                >

                  <option value="">Filtrer par domaine...</option>
                  {categoriesOption}
                </Form.Control>

              </Col>
              <Col xs="auto" className="my-1">
                <Form.Control
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Adresse de l'auteur"
                  ref={filters.author}
                />
              </Col>
              <Col xs="auto" className="my-1">
                <Button type="submit" >Chercher...</Button>
              </Col>
            </Form.Row>
          </Form></Col>
        </Row>

        <br />
        {
          data.length === 0
            ?
            <>
              <br /><br /><br />
              <Row className="align-items-center justify-content-center flex-column py-5">
                <img src={fileIcon} alt="" width="100" className="mb-2" />
                Aucun document trouvé
              </Row>
            </>
            :
            <Row xs={2} md={3} lg={3} >
              {data.map((document, key) => {
                return (
                  <Col key={key} className="mb-4">
                    <DocumentCard document={document} orderedCategories={orderedCategories} />
                  </Col>
                );
              })}
            </Row>
        }
      </Container>
    </>
  );

}


type DocumentCardProps = {
  document: any,
  orderedCategories: any
}

export function DocumentCard(props: DocumentCardProps) {
  const cid = new CID(props.document.hash).toV1().toBaseEncodedString("base32")
  const url = `https://ipfs.io/ipfs/${cid}`
  return (
    <Card>
      <Card.Header>
        <Badge variant="primary">
          <small>
            <b>
              {props.orderedCategories[props.document.categoryId]}
            </b>
          </small>
        </Badge><br /><br />
        <Card.Title className="mb-1">{props.document.name}</Card.Title>
      </Card.Header>
      <Card.Body>

        <Card.Text className="fs- text">{props.document.description}</Card.Text>
        <small>Auteur: {props.document.authorAddress}</small><br />
        <small>#{props.document.hash}</small><br />
        <Button variant="primary" size="sm" href={url} target="_blank" className="mt-2 p-1"><BsDownload /> Télécharger</Button>
      </Card.Body>
    </Card>
  );
}


import * as yup from 'yup';
import { Formik } from 'formik';

import React, { useEffect, useState } from "react";
import axios from "../api"

import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
const Buffer = require('buffer/').Buffer

type SubmitProps = {
  web3: any,
  accounts: any[],
  patentContract: any,
  docContract: any,
  ipfs: any
}

export function SubmitFile(props: SubmitProps) {

  const formRef: any = {
    description: React.createRef(),
    documentName: React.createRef(),
  }

  const [categories, setCategories] = useState<any>(null)
  const [msg, setMsg] = useState<{ type: string, text: string }>({ type: '', text: '' })


  useEffect(() => {
    async function initData() {
      const { data: categories } = await axios.get('/category')
      setCategories(categories)
    }
    initData()
  }, [])


  const uploadToIpfs = async (buffer: any) => {
    return await props.ipfs.add(buffer)
  }

  const submitFile = async (values: any) => {
    try {
      const { path: documentHash } = await uploadToIpfs(values.buffer)
      const { addDocument } = props.docContract.methods
      const documentName = values.name;
      await addDocument(documentName, documentHash).send({
        from: props.accounts[0],
      });
      const endpoint = '/document'
      const payload = {
        hash: documentHash,
        mime: "application/pdf",
        url: documentHash,
        category: parseInt(values.domain),
        tags: [],
        name: values.name,
        description: values.description
      }
      const bearer = localStorage.getItem('jwtToken')

      await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${bearer}`
        }
      })

    } catch (error) {
      throw Error(error.message)
    }
  }


  let alertMessage;

  if (msg && msg.type) {
    alertMessage = <Alert variant={msg.type}>{msg.text}</Alert>;
  }
  const categoriesOption: Array<any> = categories?.map((el: any) => {
    return <option key={el.id} value={el.id}>{el.name}</option>
  })

  const FILE_SIZE = 2 * 1024 * 1024
  const SUPPORTED_FORMATS = ['application/pdf']
  const schema = yup.object().shape({
    name: yup.string().required(),
    filename: yup.string(),
    description: yup.string().required(),
    file: yup.mixed()
      .required()
      .test('size', "Fichier trop volumineux (2Mo max)", value => value.size <= FILE_SIZE)
      .test('type', "Fichier non supporté (uniquement PDF)", value => SUPPORTED_FORMATS.includes(value.type)),
    domain: yup.string().required(),
    submit: yup.string(),
  });
  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <Col lg="6">
            <h3>Soumettre un document</h3>
            {alertMessage}
            <Formik
              validationSchema={schema}
              initialValues={{
                name: '',
                description: '',
                file: [],
                domain: undefined,
                filename: '',
                submit: '',
              }}
              onSubmit={async (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
                try {
                  await submitFile(values)
                  resetForm({})
                  setStatus({ success: true })
                  setMsg({
                    type: "success",
                    text: `Publication effectué`
                  })
                } catch (error) {
                  setMsg({
                    type: "danger",
                    text: `Une erreur est survenu. ${error.message}`,
                  })
                  setStatus({ success: false })
                  setSubmitting(false)
                  setErrors({ submit: error.message })
                }
                setSubmitting(false)
              }}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                setFieldValue,
                values,
                touched,
                isValid,
                isSubmitting,
                errors,
              }) => (<Form onSubmit={handleSubmit}>


                <fieldset disabled={isSubmitting}>
                  <Form.Group>
                    <Form.Label>Nom du document</Form.Label>
                    <Form.Control
                      ref={formRef.documentName}
                      type="text"
                      name="name"
                      id="name"
                      value={values.name}
                      onChange={handleChange}
                      isValid={touched.name && !errors.name}
                    />
                  </Form.Group>
                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Choisir un fichier à publier</Form.Label>
                        <Form.File
                          id="file"
                          name="file"
                          custom
                          label={values.filename || 'Choisir un fichier'}
                          data-browse="Parcourir"
                          onChange={(event: any) => {
                            const target = event.currentTarget

                            if (event.target && event.target.files.length > 0) {

                              const file = event.target.files[0]
                              setFieldValue("file", target.files[0])
                              setFieldValue("filename", target.files[0].name)
                              let reader = new FileReader()
                              reader.onloadend = (r) => {
                                const buffer = Buffer.from(reader.result)
                                setFieldValue("buffer", buffer)
                              }
                              reader.readAsArrayBuffer(file)
                            } else {
                              setFieldValue("file", [])
                              setFieldValue("filename", '')
                            }
                          }}
                        />
                      </Form.Group></Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Domaine d'étude</Form.Label>
                        <Form.Control as="select"
                          custom
                          name="domain"
                          id="domain"
                          value={values.domain}
                          onChange={handleChange}
                          isValid={touched.domain && !errors.domain}
                        >
                          <option value="">Selectionner...</option>
                          {categoriesOption}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Group>
                    <Form.Label>Description / Abstract</Form.Label>
                    <Form.Control
                      ref={formRef.description}
                      as="textarea"
                      rows={3}
                      name="description"
                      id="description"
                      placeholder="Description du contenu du document..."
                      value={values.description}
                      onChange={handleChange}
                      isValid={touched.description && !errors.description}
                    />
                  </Form.Group>

                  <Button variant="primary block" type="submit" disabled={!isValid}>
                    {isSubmitting ? <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    /> : <></>}
                    {isSubmitting ? "En cours..." : "Soumettre"}
                  </Button>
                </fieldset>
              </Form>
              )}
            </Formik>

          </Col>
        </Row>
      </Container>
    </>
  );

}
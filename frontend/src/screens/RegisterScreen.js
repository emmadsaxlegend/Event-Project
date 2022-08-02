import React, { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { getError } from '../utils';


const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, product: action.payload, loading: false };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };

function Register() {
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });
  console.log(product._id)

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const uniqueKey = product._id
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post("http://localhost:5000/api/users/signup", {
          name,
          email,
          password,
          uniqueKey
        });
        res.data && window.location.replace(`/product/${product.slug}`)
      } catch (err) {

      }
    };

    return (
        <Container>
            <Row>
                <Col md={7} className="d-flex align-items-center justify-content-center">
                    <Form className='signup__form' onSubmit={handleSubmit}>
                        <h1 className='text-center'>Register</h1>
                        <Form.Text className="text-muted">
                                We'll never share your details with anyone else.
                            </Form.Text>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Your Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Book
                        </Button>
                        
                    </Form>
                </Col>
                <Col md={5}>
                <img src={product.image} className="card-img-top" alt={product.name} />
                </Col>
            </Row>
        </Container>
    )
}

export default Register



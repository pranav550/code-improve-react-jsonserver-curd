import React from "react";
import { Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { Modal, Row, Col, Container, Form } from "react-bootstrap";

function Posts() {
  const [post, setPost] = useState([]);
  const [title, setTitle] = useState("");
  const [isEnable, setEnable] = useState(false);
  const [author, setAuthor] = useState("");
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = () => {
    axios.get("http://localhost:3002/posts").then((post) => {
      setPost(post.data);
    });
  };

  const deletePost = (id) => {
    axios.delete(`http://localhost:3002/posts/${id}`).then((post) => {
      getPosts();
    });
  };

  const addPost = () => {
    axios
      .post(`http://localhost:3002/posts/`, {
        title,
        author,
      })
      .then((post) => {
        handleClose();
        getPosts();
        setTitle("");
        setAuthor("");
      });
  };

  const editPost = (id) => {
    axios.get(`http://localhost:3002/posts/${id}`).then((post) => {
      setTitle(post.data.title);
      setAuthor(post.data.author);
      handleShow();
      setEnable(true);
      setEditId(id);
    });
  };

  const updatePost = () => {
    axios
      .put(`http://localhost:3002/posts/${editId}`, {
        title,
        author,
      })
      .then((post) => {
        handleClose();
        getPosts();
        setTitle("");
        setAuthor("");
      });
  };

  const items = post.map((data, index) => {
    return (
      <tbody key={index}>
        <tr>
          <td>{data.id}</td>
          <td>{data.title}</td>
          <td>{data.author}</td>
          <td>
            {/* <Button variant="primary">View</Button>{' '} */}
            <Button variant="warning" onClick={(e) => editPost(data.id)}>
              Edit
            </Button>{" "}
            <Button variant="danger" onClick={(e) => deletePost(data.id)}>
              Delete
            </Button>
          </td>
        </tr>
      </tbody>
    );
  });
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <h3 className="pt-2">Post List</h3>
          </Col>
          <Col>
            <div className="mt-2 mb-2 d-flex justify-content-end">
              <Button variant="primary" onClick={handleShow}>
                Add New Post
              </Button>
            </div>
          </Col>
        </Row>
        {/* Table Start */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          {items}
        </Table>

        {/* Modal */}

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            {!isEnable ? (
              <Modal.Title>Add Post</Modal.Title>
            ) : (
              <Modal.Title>Edit Post</Modal.Title>
            )}
          </Modal.Header>
          <Modal.Body>
            <Container className="mt-1">
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </Form.Group>
                {!isEnable ? (
                  <Button variant="primary" onClick={addPost}>
                    Add Post
                  </Button>
                ) : (
                  <Button variant="primary" onClick={updatePost}>
                    Update Post
                  </Button>
                )}
              </Form>
            </Container>
          </Modal.Body>
        </Modal>

        {/* Modal end */}
      </Container>
    </div>
  );
}

export default Posts;

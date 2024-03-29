import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import './profile-view.scss';

import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap';

export class ProfileView extends React.Component {
    constructor() {
        super();

        this.state = {
            Username: null,
            Password: null,
            Email: null,
            Birthday: null,
            FavoriteMovies: [],
        };
    }

    componentDidMount() {
        const accessToken = localStorage.getItem('token');
        this.getUser(accessToken);
    }

    onLoggedOut() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.setState({
            user: null,
        });
        window.open('/', '_self');
    }

    getUser = (token) => {
        const Username = localStorage.getItem('user');
        axios.get(`https://obi-flix.herokuapp.com/users/${Username}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                this.setState({
                    Username: response.data.Username,
                    Password: response.data.Password,
                    Email: response.data.Email,
                    Birthday: response.data.Birthday,
                    FavoriteMovies: response.data.FavoriteMovies,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    // update user info in form
    editUser = (e) => {
        e.preventDefault();
        const Username = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        axios.put(`https://obi-flix.herokuapp.com/users/${Username}`, {
            Username: this.state.Username,
            Password: this.state.Password,
            Email: this.state.Email,
            Birthday: this.state.Birthday
        }, { headers: { Authorization: `Bearer ${token}` } }
        )
            .then((response) => {
                this.setState({
                    Username: response.data.Username,
                    Password: response.data.Password,
                    Email: response.data.Email,
                    Birthday: response.data.Birthday,
                });

                localStorage.setItem('user', this.state.Username);
                alert("Profile updated");
                window.open('/profile', '_self');
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    // remove movie from favorite list
    onRemoveFavorite = (e, movie) => {
        e.preventDefault();
        const Username = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        axios.delete(`https://obi-flix.herokuapp.com/users/${Username}/movies/${movie._id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                console.log(response);
                alert("Movie removed");
                this.componentDidMount();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    // delete account 
    onDeleteUser() {
        const Username = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        axios.delete(`https://obi-flix.herokuapp.com/users/${Username}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                console.log(response);
                alert("Profile deleted");
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.open('/', '_self');
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    setUsername(value) {
        this.setState({
            Username: value,
        });
    }

    setPassword(value) {
        this.setState({
            Password: value,
        });
    }

    setEmail(value) {
        this.setState({
            Email: value,
        });
    }

    setBirthday(value) {
        this.setState({
            Birthday: value,
        });
    }

    render() {
        const { movies, onBackClick } = this.props;
        const { FavoriteMovies, Username, Email, Birthday } = this.state;

        if (!Username) {
            return null;
        }

        return (
            <Container align='center'>
                <Card>
                    <Card.Body>
                        <Card.Title>Update your Profile</Card.Title>
                        <Form
                            className="update-form"
                            onSubmit={(e) =>
                                this.editUser(
                                    e,
                                    this.Username,
                                    this.Password,
                                    this.Email,
                                    this.Birthday
                                )
                            }
                        >
                            <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Username"
                                    placeholder="New Username"
                                    value={Username}
                                    onChange={(e) => this.setUsername(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="Password"
                                    placeholder="New Password"
                                    value={""}
                                    onChange={(e) => this.setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="Email"
                                    placeholder="Enter Email"
                                    value={Email}
                                    onChange={(e) => this.setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Birthday</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="Birthday"
                                    value={Birthday}
                                    onChange={(e) => this.setBirthday(e.target.value)}
                                />
                            </Form.Group>
                            <div>
                                <Button style={{ margin: "20px" }} type="submit" onClick={this.editUser}>Update User</Button>
                                <Button variant="danger" onClick={() => this.onDeleteUser()}>Delete User</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>


                <Card.Body sm={4}>
                    <Card.Title style={{ marginTop: "20px" }}>{Username}'s Favorite movies</Card.Title>
                    {FavoriteMovies.length === 0 && (
                        <div className="text-center">No Favorite Movies</div>
                    )}

                    {FavoriteMovies.length > 0 &&
                        movies.map((movie) => {
                            if (
                                movie._id ===
                                FavoriteMovies.find((fav) => fav === movie._id)
                            ) {
                                return (
                                    <Card key={movie._id} >
                                        <Card.Img
                                            className="poster"
                                            variant="top"
                                            src={movie.ImageURL}
                                        />
                                        <Card.Body>
                                            <Card.Title>
                                                {movie.Title}
                                            </Card.Title>
                                            <Button variant="danger" value={movie._id} onClick={(e) => this.onRemoveFavorite(e, movie)}>Remove</Button>
                                        </Card.Body>
                                    </Card>
                                );
                            }
                        })}

                </Card.Body>

                <div>
                    <Button variant="outline-primary" onClick={() => { onBackClick(null); }}>Back</Button>
                </div>
            </Container>
        );
    }
}

ProfileView.propTypes = {
    movies: PropTypes.arrayOf(PropTypes.shape({
        Title: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
        ImageURL: PropTypes.string.isRequired,
        Genre: PropTypes.shape({
            Name: PropTypes.string.isRequired,
            Description: PropTypes.string.isRequired,
        }).isRequired,
        Director: PropTypes.shape({
            Bio: PropTypes.string.isRequired,
            Birth: PropTypes.string.isRequired,
            Name: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
    onBackClick: PropTypes.func.isRequired
};
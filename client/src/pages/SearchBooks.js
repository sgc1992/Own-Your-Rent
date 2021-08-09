import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';

import Auth from '../utils/auth';
import { saveBook, searchGoogleBooks, searchApartment } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);

  const [searchedApartments, setSearchedApartments] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {

      const query = {
        "listingType": "Sale",
        "propertyTypes": [
          "House",
          "NewApartments"
        ],
        "minBedrooms": 3,
        "minBathrooms": 2,
        "minCarspaces": 1,
        "locations": [
          {
            "state": "NSW",
            "region": "",
            "area": "",
            "suburb": searchInput,
            "postCode": 2090,
            "includeSurroundingSuburbs": false
          }
        ]
      }
      console.log(query);
      const apartmentresponse = await searchApartment(query);

      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();
      const apartments = await apartmentresponse.json();
      setSearchedApartments(apartments);

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));


      const apartmentData = items.map((apartment) => ({
        // listingName:apartment.
        // auctionSchedule:apartment.
        

        // imageUrl: apartment.listing.media[0].url,
        // priceDetails:apartment.
        // propertyDetails:apartment.

      }));
      console.log(apartmentData);


      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await saveBook(bookToSave, token);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Enter your location</h1>
          <Form onSubmit={handleFormSubmit}>
            {console.log(searchedBooks)}
            {console.log(searchedApartments)}
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='enter your location'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>


      <Container>
        <h2>
          {searchedApartments.length
            ? `Viewing ${searchedApartments.length} results:`
            : 'Search for your property'}
        </h2>
        <CardColumns>
          {searchedApartments.map((apartment) => {
            console.log(apartment);
            return (
              <Card  border='dark'>
                <p>{apartment.listing.advertiser.name}</p>
                <p>{apartment.listing.priceDetails.displayPrice}</p>
                <p>{apartment.listing.propertyDetails.state}</p>
                {/* <img src={apartment.listing.media[0].url}/> */}

                <Card.Title>{apartment.imageUrl}</Card.Title>




                <Card.Body>

                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>

    </>
  );
};

export default SearchBooks;

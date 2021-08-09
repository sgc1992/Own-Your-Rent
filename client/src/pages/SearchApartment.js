import React, { useState } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';


import {searchApartment } from '../utils/API';


const SearchApartment = () => {
  const [searchedApartments, setSearchedApartments] = useState([]);
  
  const [searchInput, setSearchInput] = useState('');

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
            "postCode": 2095,
            "includeSurroundingSuburbs": false
          }
        ]
      }
      console.log(query);
      const apartmentresponse = await searchApartment(query);

      const apartments = await apartmentresponse.json();
      setSearchedApartments(apartments);
      setSearchInput('');
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
              <Card border='dark'>
                <p>Agency: {apartment.listing.advertiser.name}</p>
                <p>Listingtype: {apartment.listing.listingType}</p>
                <p>Price: {apartment.listing.priceDetails.displayPrice}</p>
                <p>Property Details: {apartment.listing.propertyDetails.state}</p>
                
              </Card>
            );
          })}
        </CardColumns>
      </Container>

      

    </>
  );
};

export default SearchApartment;

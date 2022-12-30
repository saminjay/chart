import React, { useState, useEffect, useCallback } from 'react';

import { NavDropdown, Navbar, Container } from 'react-bootstrap';

import Table from './Table';
import LineGraph from './LineGraph';

const ALL_REVENUES = 'All Revenues';

export default function Home () {
  const [data, setData] = useState([]);
  const [revenueList, setRevenueList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRevenue, setSelectedRevenue] = useState(ALL_REVENUES);

  const getRevenueList = (apiData) => {
    const revList = new Set();
    apiData.forEach(({ revenue_type }) => {
      revList.add(revenue_type);
    });
    setRevenueList([...revList])
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('http://fetest.pangeatech.net/data');
      const resData = await response.json();
      getRevenueList(resData);
      setData(resData);
    } catch (err) {
      console.log(err);
      // Can toast "Something went wrong!" or something like that
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setFilteredData(data.filter(({ revenue_type }) => selectedRevenue === ALL_REVENUES || revenue_type === selectedRevenue));
  }, [selectedRevenue, data]);

  return <div>
    <Navbar bg='primary' variant='dark'>
      <Container>
        <NavDropdown title={selectedRevenue} id="basic-nav-dropdown" onSelect={setSelectedRevenue}>
          <NavDropdown.Item key={ALL_REVENUES} eventKey={ALL_REVENUES}>All Revenues</NavDropdown.Item>
          {
            revenueList.map((revenue) => <NavDropdown.Item key={revenue} eventKey={revenue}>{revenue}</NavDropdown.Item>)
          }
        </NavDropdown>
      </Container>
    </Navbar>
    <Container>
      <LineGraph data={filteredData} />
      <Table data={filteredData} pagination pageSize={10} />
    </Container>
  </div>;
};
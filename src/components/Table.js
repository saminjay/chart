import React, { useState, useMemo } from 'react';
import { Pagination, Table } from 'react-bootstrap';

export default function RevenueTable ({ data, pagination, pageSize }) {
  const [page, setPage] = useState(1);


  const showTableData = useMemo(() => {
    const lowerLimit = (page - 1) * pageSize;
    const upperLimit = page * pageSize;

    return data.filter((_, idx) => (idx >= lowerLimit && idx < upperLimit)).map((el) => {
      return <tr key={el.S_no}>
        <td>{el.S_no}</td>
        <td>{el.line_of_business}</td>
        <td>{el.revenue_type}</td>
        <td>{el.product}</td>
        <td>{`${el.month.substr(0, 3)} - ${el.year % 100}`}</td>
        <td>{el.acv}</td>
        <td>{el.tcv}</td>
        <td>{el.revenue}</td>
      </tr>
    });
  }, [data, page, pageSize]);

  const showPagination = () => {
    if (!pagination) {
      return null;
    }

    const noOfPages = parseInt(data.length / pageSize) + !!(data.length % pageSize);
    const pageItems = [];

    for (let i = 1; i <= noOfPages; i++) {
      if (i < 3 || i > noOfPages - 2) {
        pageItems.push(<Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>{i}</Pagination.Item>);
      } else if (page >= 3 && page <= noOfPages - 2) {
        if (page > 3 && i !== page) {
          pageItems.push(<Pagination.Ellipsis key='ellipsis1' onClick={() => setPage(page - 1)} />);
          i = page;
        }
        if (i === page) {
          pageItems.push(<Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>{i}</Pagination.Item>);
          i = noOfPages - 2;
        }
        if (page < noOfPages - 2) {
          pageItems.push(<Pagination.Ellipsis key='ellipsis2' onClick={() => setPage(page + 1)} />);
          i = noOfPages - 2;
        }
      } else {
        pageItems.push(<Pagination.Ellipsis key='ellipsis' />);
        i = noOfPages - 2;
      }
    }

    return <Pagination>
      <Pagination.Prev disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Pagination.Prev>
      {pageItems}
      <Pagination.Next disabled={noOfPages === page} onClick={() => setPage(page + 1)}>Next</Pagination.Next>
    </Pagination>
  };

  return <div>
    <Table
      striped
      bordered
      hover
      responsive
    >
      <thead>
        <tr key='head'>
          <th>S No.</th>
          <th>Line of Business</th>
          <th>Revenue Type</th>
          <th>Product</th>
          <th>Posting Period</th>
          <th>ACV</th>
          <th>TCV</th>
          <th>Revenue</th>
        </tr>
      </thead>
      <tbody>
        {showTableData}
      </tbody>
    </Table>
    {showPagination()}
  </div>;
}
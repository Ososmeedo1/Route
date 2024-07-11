import React, { useEffect, useState } from 'react';
import axios from 'axios';




function App() {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const customerData = await axios.get('http://localhost:5000/customers');
      const transactionData = await axios.get('http://localhost:5000/transactions');
      setCustomers(customerData.data);
      setTransactions(transactionData.data);
    };
    fetchData();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(filter.toLowerCase())
  );



  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
  };

  const transactionsForCustomer = transactions.filter(transaction =>
    transaction.customer_id === selectedCustomer?.id
  );

  const transactionData = transactionsForCustomer.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += transaction.amount;
    return acc;
  }, {});



  const combinedFilter = (customer) => {
    const nameMatch = customer.name.toLowerCase().includes(filter.toLowerCase());
    const transactionMatch = transactions.some(transaction =>
      transaction.customer_id === customer.id &&
      transaction.amount.toString().includes(filter)
    );
    return nameMatch || transactionMatch;
  };


  const combinedFilteredCustomers = customers.filter(combinedFilter);
  return <>

    <h1 className='text-center text-success fw-bold m-5'>Customer Transactions</h1>
    <input
      type="text"
      placeholder="Filter by name or amount"
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className='form-control w-25 mx-auto border-3 border-success m-5'
    />

    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <div className="content">
            <h2 className='text-success fw-bold  border-bottom border-black w-50 border-3'>Customers</h2>
            <table className='table my-0'>
              <thead>
                <tr>
                  <th>id</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} onClick={() => handleCustomerClick(customer)}>
                    <td>{customer.id}</td>
                    <td>{customer.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-8">
          <div className="content">
            <h2 className='text-success fw-bold  border-bottom border-black w-50 border-3'>Transactions</h2>

            <table className='table my-0'>
              <thead>
                <tr>
                  <th>id</th>
                  <th>customer_id</th>
                  <th>date</th>
                  <th>amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.customer_id}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.amount}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    
    
  </>
}

export default App







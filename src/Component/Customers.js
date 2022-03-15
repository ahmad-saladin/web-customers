import React, { useEffect, useState} from 'react';
import axios from 'axios';
import Render from './Render';
import countryValidationDetails from '../Commons/CountryValidationDetails';
import {REST_REPORTS_BASE_URL, CUSTOMERS_API} from '../Commons/Constants/RestConstants';

const Customers = () => {

const initialState = {
  customers : [],
  pagination : {pageSize : 6, pageIndex: 0},
  filter: {"state" : '', "country": ''}
};
const [state, setState] = useState(initialState);

const updateState = (updateStateComponent, updateData) => {
  const updatedState = {...state};
  if(updateStateComponent === 'customers'){
    updatedState.customers = updateData;
  }
  if(updateStateComponent === 'pagination'){
    updatedState.pagination = updateData;
  }
  if(updateStateComponent === 'filter'){
    updatedState.filter = updateData;
  }
      setState(updatedState);
};

const filterHandler = (event) => {
  if(event.key === 'Enter'){
    let appliedFilter = null;
    if(event.target.name === 'state'){
      appliedFilter = {...state.filter, "state": event.target.value};
    }
    if(event.target.name === 'country'){
      appliedFilter = {...state.filter, "country": event.target.value};
    }
    updateState('filter', appliedFilter);
  }
};

const paginationHandler = (event) => {
  let updatedPagination = null;
  if(event.target.name === 'next-page'){
   updatedPagination = {...state.pagination, pageIndex: state.pagination.pageIndex +1};
  }
  if(event.target.name === 'prev-page'){
      updatedPagination = {...state.pagination, pageIndex: state.pagination.pageIndex -1};
  }
  updateState('pagination', updatedPagination);

}

  useEffect(() => {
   // Fetch customers from the back-end.
    const getCustomers = async () =>{
      try {
        let params = new URLSearchParams();
        params.append("page_size", state.pagination.pageSize);
        params.append("page_index", state.pagination.pageIndex);
        const {data: response} = await axios.get(REST_REPORTS_BASE_URL + CUSTOMERS_API, {params});
        processCustomers(response);
      } catch (error) {
        console.error(error.message);
      }
    }
    // process the retrieved customers data.
    const processCustomers = (rawCustomers) =>{
      let processedCustomers = [];
      for (const rawCustomer of rawCustomers) {
        const phone = rawCustomer.phone;
        const countryCode = phone.substring( phone.indexOf('(') + 1, phone.indexOf(')'));
        const customer = [...rawCustomers];
        for (const countryValidationDetail of countryValidationDetails) {
          if(countryValidationDetail['code'] === countryCode){
            customer.country = countryValidationDetail['country'];
            customer.state = new RegExp(countryValidationDetail['regex']).test(phone)? 'Valid' : 'InValid';
            break;
          }
        }
        customer.countryCode = countryCode;
        customer.phone = phone;
        customer.name = rawCustomer.name;
        processedCustomers.push(customer);
      }
      // filter:
      if(state.filter.state !== ''){
        processedCustomers = processedCustomers.filter(customer => state.filter.state === customer["state"]);
      }
      if(state.filter.country !== ''){
        processedCustomers = processedCustomers.filter(customer => state.filter.country === customer["country"]);
      }
      updateState('customers', processedCustomers);
    }
    getCustomers();
  }, [state.filter.state, state.filter.country, state.pagination.pageIndex, state.pagination.pageSize]);

  return <Render customers = {state.customers}
                 filterHandler = {filterHandler}
                 paginationHandler = {paginationHandler}
                 pageIndex = {state.pagination.pageIndex}/>;
}

export default Customers;